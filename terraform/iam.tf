resource "google_project_iam_member" "backend_secret_access" {
  role   = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:${google_service_account.backend_sa.email}"
}

resource "google_project_iam_member" "backend_sql_access" {
  role   = "roles/cloudsql.client"
  member = "serviceAccount:${google_service_account.backend_sa.email}"
}
