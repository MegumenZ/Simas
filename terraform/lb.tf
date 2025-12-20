resource "google_compute_region_network_endpoint_group" "frontend_neg" {
  name                  = "simasfe-neg"
  region                = var.region_fe
  network_endpoint_type = "SERVERLESS"

  cloud_run {
    service = google_cloud_run_service.frontend.name
  }
}

resource "google_compute_backend_service" "frontend_backend" {
  name                  = "simasfe-backend"
  protocol              = "HTTP"
  load_balancing_scheme = "EXTERNAL"
  port_name             = "http"
  timeout_sec           = 30

  security_policy = google_compute_security_policy.simas_waf.id

  backend {
    group = google_compute_region_network_endpoint_group.frontend_neg.id
  }
}

resource "google_compute_url_map" "frontend_url_map" {
  name            = "simasfe-url-map"
  default_service = google_compute_backend_service.frontend_backend.id
}