variable "project_id" {
  type = string
}

variable "region_fe" {
  type = string
}

variable "region_be" {
  type = string
}

variable "backend_url" {
  type = string
}

variable "vpc_connector_id" {
  type        = string
  description = "Full VPC Access Connector ID"
}