resource "google_cloud_run_service" "frontend" {
  name     = "simasfe"
  location = var.region_fe

  template {
    spec {
      container_concurrency = 80
      timeout_seconds       = 300

      containers {
        # CI/CD controls image version
        image = "asia-southeast1-docker.pkg.dev/iam-lab-122140089/cloud-run-source-deploy/simas/simasfe"

        ports {
          container_port = 8080
        }

        env {
          name  = "NEXT_PUBLIC_API_URL"
          value = var.backend_url
        }

        resources {
          limits = {
            cpu = "1000m"
            memory = "2Gi"
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      template[0].spec[0].containers[0].image,
      template[0].metadata[0].annotations,
    ]
  }
}

resource "google_cloud_run_service" "backend" {
  name     = "simasbe"
  location = var.region_be

  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale"        = "20"
        "run.googleapis.com/vpc-access-connector" = var.vpc_connector_id
        "run.googleapis.com/vpc-access-egress"    = "private-ranges-only"
      }
    }

    spec {
      service_account_name  = "281940551809-compute@developer.gserviceaccount.com"
      container_concurrency = 80
      timeout_seconds       = 300

      containers {
        # CI/CD controls image version
        image = "asia-southeast2-docker.pkg.dev/iam-lab-122140089/cloud-run-source-deploy/simas/simasbe"

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
              name = data.google_secret_manager_secret.database_url.secret_id
              key  = "latest"
            }
          }
        }

        resources {
          limits = {
            cpu = "1000m"
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

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      template[0].spec[0].containers[0].image,
      template[0].metadata[0].annotations,
      template[0].spec[0].containers[0].env,
    ]
  }
}