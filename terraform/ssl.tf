resource "google_compute_managed_ssl_certificate" "frontend_cert" {
  name = "simasfe-cert"

  managed {
    domains = ["komasimas.web.id"]
  }
}
