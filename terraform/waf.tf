resource "google_compute_security_policy" "simas_waf" {
  name        = "simas-security-policy"
  description = "WAF Basic Protection (SQLi, XSS, Rate Limit)"
  type        = "CLOUD_ARMOR"

  # Rule 1: Rate Limiting (Anti DDoS/Spam)
  # Membatasi max 200 request per menit per IP
  rule {
    action   = "rate_based_ban"
    priority = "1000"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    rate_limit_options {
      conform_action = "allow"
      exceed_action  = "deny(429)"
      enforce_on_key = "IP"
      rate_limit_threshold {
        count        = 200
        interval_sec = 60
      }
      ban_duration_sec = 300
    }
    description = "Rate Limit: 200 req/min"
  }

  # Rule 2: Block XSS (Cross-Site Scripting)
  rule {
    action   = "deny(403)"
    priority = "2000"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('xss-v33-stable')"
      }
    }
    description = "Block XSS attacks"
  }

  # Rule 3: Block SQL Injection
  rule {
    action   = "deny(403)"
    priority = "3000"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('sqli-v33-stable')"
      }
    }
    description = "Block SQL Injection attacks"
  }

  # Rule Default: Allow All
  rule {
    action   = "allow"
    priority = "2147483647"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Default allow rule"
  }
}