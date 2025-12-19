data "google_vpc_access_connector" "redis_connector" {
  name    = "konektor-redis"
  region  = "asia-southeast2"
  project = var.project_id
}
