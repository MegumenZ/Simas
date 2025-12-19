resource "google_cloud_run_service" "frontend" {
  name     = "simasfe"
  location = var.region_fe

  template {
    spec {
      containers {
        image = var.frontend_image

        ports {
          container_port = 8080
        }

        env {
          name  = "NEXT_PUBLIC_API_URL"
          value = var.backend_url
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}


resource "google_cloud_run_service" "backend" {
  name     = "simasbe"
  location = var.region_be

  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale"         = "20"
        "run.googleapis.com/vpc-access-connector" = var.vpc_connector_id
        "run.googleapis.com/vpc-access-egress"    = "private-ranges-only"
      }
    }

    spec {
      service_account_name = google_service_account.backend_sa.email
      container_concurrency = 80
      timeout_seconds       = 300

      containers {
        image = var.backend_image

        ports {
          container_port = 8080
        }

        env {
          name  = "REDIS_HOST"
          value = data.google_redis_instance.simas_redis.host
        }

        env {
          name  = "REDIS_PORT"
          value = tostring(data.google_redis_instance.simas_redis.port)
        }

        env {
          name = "DATABASE_URL"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.database_url.secret_id
              key  = "latest"
            }
          }
        }

        resources {
          limits = {
            cpu    = "1"
            memory = "512Mi"
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}