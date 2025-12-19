resource "google_service_account" "backend_sa" {
  account_id   = "simas-backend-sa"
  display_name = "SIMAS Backend Cloud Run Service Account"
}
