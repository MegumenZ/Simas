resource "google_compute_target_https_proxy" "frontend_https_proxy" {
  name             = "simasfe-https-proxy"
  url_map          = google_compute_url_map.frontend_url_map.self_link
  ssl_certificates = [google_compute_managed_ssl_certificate.frontend_cert.self_link]
}
