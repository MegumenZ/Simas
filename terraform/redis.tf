data "google_redis_instance" "simas_redis" {
  name    = "simas-redis"
  region  = "asia-southeast2"
  project = var.project_id
}
