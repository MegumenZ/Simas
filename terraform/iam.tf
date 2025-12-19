resource "google_project_iam_member" "backend_secret_access" {
  role   = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:${google_cloud_run_service.backend.template[0].spec[0].service_account_name}"
}

resource "google_project_iam_member" "backend_sql_access" {
  role   = "roles/cloudsql.client"
  member = "serviceAccount:${google_cloud_run_service.backend.template[0].spec[0].service_account_name}"
}
