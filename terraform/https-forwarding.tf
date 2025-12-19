resource "google_compute_global_forwarding_rule" "frontend_https_rule" {
  name                  = "simasfe-https-rule"
  load_balancing_scheme = "EXTERNAL"
  port_range            = "443"
  target                = google_compute_target_https_proxy.frontend_https_proxy.self_link
}
