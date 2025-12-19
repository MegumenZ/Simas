resource "google_secret_manager_secret" "database_url" {
  secret_id = "DATABASE_URL"

  replication {
    automatic = true
  }
}
