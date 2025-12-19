resource "google_compute_url_map" "http_redirect" {
  name = "simasfe-http-redirect"

  default_url_redirect {
    https_redirect = true
    strip_query    = false
  }
}

resource "google_compute_target_http_proxy" "http_redirect_proxy" {
  name    = "simasfe-http-redirect-proxy"
  url_map = google_compute_url_map.http_redirect.self_link
}

resource "google_compute_global_forwarding_rule" "http_redirect_rule" {
  name       = "simasfe-http-redirect-rule"
  port_range = "80"
  target     = google_compute_target_http_proxy.http_redirect_proxy.self_link
}
