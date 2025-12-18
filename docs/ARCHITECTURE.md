# SIMAS - Cloud Architecture Documentation

## Google Cloud Platform Deployment Architecture

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Cloud Architecture Overview](#cloud-architecture-overview)
3. [Component Details](#component-details)
4. [Network Architecture](#network-architecture)
5. [Security Architecture](#security-architecture)
6. [Data Flow](#data-flow)
7. [Scalability & High Availability](#scalability--high-availability)
8. [Disaster Recovery](#disaster-recovery)
9. [Monitoring & Observability](#monitoring--observability)
10. [Deployment Pipeline](#deployment-pipeline)

---

## Executive Summary

SIMAS adalah aplikasi cloud-native yang di-deploy sepenuhnya di **Google Cloud Platform (GCP)**. Arsitektur dirancang untuk:

- ✅ **Simple & Reliable** - Single region deployment di Singapore
- ✅ **Fully Managed** - Database dan infrastructure managed by Google
- ✅ **Cost-Optimized** - Fixed resources, no auto-scaling overhead
- ✅ **Secure** - Enterprise-grade security dengan VPC dan private IP
- ✅ **Easy to Maintain** - Simple configuration, easy to understand

### Infrastructure Summary

| Component    | Service                | Purpose                     |
| ------------ | ---------------------- | --------------------------- |
| Frontend     | Cloud Run              | Next.js application hosting |
| Backend      | Cloud Run              | Express.js API server       |
| Database     | Cloud SQL (PostgreSQL) | Relational data storage     |
| Cache        | Memorystore for Redis  | Session storage & caching   |
| File Storage | Cloud Storage          | PDF/DOCX file storage       |
| Monitoring   | Cloud Monitoring       | System observability        |
| Logging      | Cloud Logging          | Centralized logging         |

---

## Cloud Architecture Overview

### High-Level Architecture Diagram

```
                                Internet
                                    │
                                    │ HTTPS
                                    ▼
                        ┌───────────────────────┐
                        │   Cloud Run Services  │
                        │   Frontend + Backend  │
                        └───────────┬───────────┘
                                    │
                                    │ VPC Connector
                                    │ (Private IP)
                                    ▼
                    ┌───────────────┴────────────────┐
                    │                                │
                    ▼                                ▼
       ┌────────────────────────┐     ┌────────────────────────┐
       │   Cloud SQL            │     │  Memorystore Redis     │
       │   PostgreSQL 14        │     │  Redis 7.0             │
       │   • db-f1-micro        │     │  • 1GB Memory          │
       │   • 10GB SSD           │     │  • Basic Tier          │
       │   • Private IP         │     │  • Private IP          │
       └────────┬───────────────┘     └────────────────────────┘
                │
                ▼
       ┌────────────────────────┐
       │   Cloud Storage        │
       │   • Standard Class     │
       │   • PDF/DOCX Files     │
       └────────────────────────┘

            Monitoring Layer
    ┌───────────────────────────────┐
    │  Cloud Monitoring & Logging   │
    └───────────────────────────────┘
```

### Regional Deployment

**Primary Region:** `asia-southeast1` (Singapore)

**Rationale:**

- Lowest latency untuk Asia Tenggara
- Simple single-region deployment
- Cost-effective
- Complete service availability

---

## Component Details

### 1. Frontend - Cloud Run Service

**Service Configuration:**

```yaml
Service Name: simas-frontend
Region: asia-southeast1
Container Image: gcr.io/PROJECT_ID/simas-frontend:latest

Resources:
  Memory: 512Mi
  CPU: 1 vCPU

Instances:
  Fixed: 1 instance (always on)

Networking:
  Ingress: All
  VPC Connector: simas-vpc-connector

Environment:
  NEXT_PUBLIC_API_URL: https://simas-backend-xxx.run.app
  NODE_ENV: production
  PORT: 3000
```

**Cold Start Optimization:**

- Next.js standalone build
- Minimal dependencies
- Pre-compiled assets
- Startup CPU boost enabled

### 2. Backend - Cloud Run Service

**Service Configuration:**

```yaml
Service Name: simas-backend
Region: asia-southeast2
Container Image: gcr.io/PROJECT_ID/simas-backend:latest

Resources:
  Memory: 512Mi-1Gi (auto-adjustable)
  CPU: 1-2 vCPU
  CPU Throttling: false (always allocated)

Scaling:
  Min Instances: 1 (always warm)
  Max Instances: 10
  Concurrency: 80 requests/instance
  Request Timeout: 300s (5 min)

Networking:
  Ingress: All
  Egress: Private ranges + Cloud SQL
  VPC Connector: simas-vpc-connector
  Cloud SQL Connection: via Unix socket

Environment:
  DATABASE_URL: postgresql://[DB_CONNECTION]
  INSTANCE_CONNECTION_NAME: PROJECT:REGION:INSTANCE
  WEB_ORIGIN: https://simas-frontend-xxx.run.app
  NODE_ENV: production
  PORT: 3001
```

**Cloud SQL Connector:**

- Private IP connection
- Automatic IAM authentication
- Connection pooling (max 100)
- SSL/TLS encryption

### 3. Database - Cloud SQL for PostgreSQL

**Instance Configuration:**

```yaml
Instance Name: simas-db
Database Version: POSTGRES_14
Region: asia-southeast2
Zone: asia-southeast2-a (Primary)

Machine Type:
  Tier: db-f1-micro (0.6GB RAM, 1 shared vCPU)
  Upgrade Path: db-g1-small → db-n1-standard-1

Storage:
  Type: SSD
  Size: 10GB
  Auto-increase: Enabled
  Max: 100GB

Network:
  Private IP: 10.x.x.x (VPC)
  Public IP: Disabled (security)
  Authorized Networks: None
  SSL Required: Yes

High Availability:
  Mode: Zonal (upgradeable to Regional)
  Failover: Automatic
  Replica: Optional (asia-southeast2-b)

Backup:
  Automated Backups: Daily
  Retention: 7 days
```

**Connection Management:**

- Prisma connection pooling
- Max pool size: 100

### 4. Cache - Memorystore for Redis

**Instance Configuration:**

```yaml
Instance Name: simas-redis
Redis Version: 7.0
Tier: Basic
Region: asia-southeast1

Capacity:
  Memory Size: 1 GB

Network:
  IP Address: 10.11.x.x (Private IP)
  Authorized Network: simas-vpc

Configuration:
  maxmemory-policy: allkeys-lru
  Eviction Policy: LRU (Least Recently Used)
```

### 5. File Storage - Cloud Storage

**Bucket Configuration:**

```yaml
Bucket Name: simas-files-[PROJECT_ID]
Location: asia-southeast1 (Regional)
Storage Class: Standard

Access Control:
  Public Access: Prevented
  Uniform Bucket-Level Access: Enabled

Permissions:
  Backend Service Account: Storage Object Admin

CORS Configuration:
  Origin: https://simas-backend-xxx.run.app
  Methods: GET, PUT, POST, DELETE
  Headers: Content-Type, X-API-TOKEN
```

**File Organization:**

```
simas-files-bucket/
├── uploads/
│   └── YYYY/
│       └── MM/
│           └── filename-timestamp.pdf
├── backups/
│   └── YYYY-MM-DD/
└── archives/
    └── YYYY/
```

### 6. Networking - VPC

**VPC Configuration:**

```yaml
VPC Name: simas-vpc
Region: asia-southeast1
Subnets:
  - simas-subnet-db (10.10.0.0/24)
  - simas-subnet-redis (10.11.0.0/24)
  - simas-subnet-connector (10.12.0.0/28)

VPC Connector:
  Name: simas-vpc-connector
  Region: asia-southeast1
  IP Range: 10.12.0.0/28
  IP: x.x.x.x (Static External IP)

SSL Certificate:
  Type: Google-managed
  Domains:
    - simas.example.com
    - www.simas.example.com
  Auto-renewal: Yes

Backend Services:
  - Frontend (Cloud Run)
    - Health Check: /_next/health
    - Timeout: 30s
    - Protocol: HTTPS

  - Backend (Cloud Run)
    - Health Check: /health
    - Timeout: 300s
    - Protocol: HTTPS

Security:
  Cloud Armor: Enabled
  DDoS Protection: Always-on
  Rate Limiting: 1000 req/min per IP
  Geo-filtering: Optional
  Iam Policy: Restrict access to known IPs
```

---

## Network Architecture

### Network Flow Diagram

```
                        Internet (Public)
                              │
                    ┌─────────▼──────────┐
                    │  Cloud Load        │
                    │  Balancer          │
                    │  35.x.x.x          │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Cloud CDN         │
                    │  (Static Assets)   │
                    └─────────┬──────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
     ┌────────▼────────┐            ┌────────▼────────┐
     │  Frontend       │            │  Backend        │
     │  Cloud Run      │            │  Cloud Run      │
     │  Public IP      │            │  Public IP      │
     └────────┬────────┘            └────────┬────────┘
              │                               │
              │                               │ VPC Connector
              │                               │ (10.12.0.0/28)
              │                               │
              │                      ┌────────▼────────┐
              │                      │  Private VPC    │
              │                      │  10.0.0.0/8     │
              │                      └────────┬────────┘
              │                               │
              │                      ┌────────▼────────┐
              │                      │  Cloud SQL      │
              │                      │  Private IP     │
              │                      │  10.10.0.x      │
              │                      └────────┬────────┘
              │                               │
              └───────────────┬───────────────┘
                              │
                     ┌────────▼────────┐
                     │  Cloud Storage  │
                     │  Private Access │
                     └─────────────────┘
```

### Security Zones

**Public Zone:**

- Cloud Run services (public endpoints)

**Private Zone:**

- Cloud SQL (private IP only)
- Memorystore Redis (private IP only)
- VPC internal network
- Cloud Storage (private access)

---

## Security Architecture

### Identity & Access Management (IAM)

**Service Accounts:**

```yaml
# Backend Service Account
backend@PROJECT.iam.gserviceaccount.com
Roles:
  - Cloud Run Invoker
  - Cloud SQL Client
  - Cloud Storage Object Admin
  - Cloud Logging Writer
```

### Network Security

**Firewall Rules:**

- VPC Connector can access Cloud SQL (port 5432)
- VPC Connector can access Redis (port 6379)
- Cloud Run services use VPC Connector for private access

### Data Security

**Encryption:**

- **At Rest:** All data encrypted with Google-managed keys (AES-256)
- **In Transit:** TLS 1.3 for all connections
- **Database:** Transparent data encryption (TDE)
- **Files:** Server-side encryption (SSE)

```

### Application Security

**Authentication:**
- Token-based (UUID)
- Stored in Cloud SQL (indexed)
- 24-hour expiration
- Secure HTTP-only cookies (frontend)

**Authorization:**
- Role-based access control (RBAC)
- Admin vs User roles
- Middleware enforcement

**Input Validation:**
- Zod schema validation
- File type checking (PDF/DOCX)
- Size limits (10MB)
- SQL injection prevention (Prisma ORM)

---

## Data Flow

### User Request Flow

**1. User Login Flow (with Redis Session):**
```

User Browser
│
│ POST /api/users/login
│ {email, password}
▼
Backend Cloud Run
│
│ 1. Validate credentials
│ 2. Check Cloud SQL
▼
Cloud SQL
│
│ Query user table
│ Verify password hash (bcrypt)
◄
Backend Cloud Run
│
│ 3. Generate UUID token
│ 4. Store session in Redis
▼
Memorystore Redis
│
│ SET session:{token} {userId, role, ...} EX 86400
◄
Backend Cloud Run
│
│ 5. Update token in database (backup)
▼
Cloud SQL
│
│ UPDATE users SET token=...
◄
Backend Cloud Run
│
│ 6. Return {token, user}
▼
User Browser
│
│ Store token in cookie
└─► Redirect to dashboard

```

**1b. Subsequent Request (Fast Path with Redis):**
```

User Browser
│
│ GET /api/dashboard (with X-API-TOKEN)
▼
Backend Cloud Run
│
│ 1. Check session in Redis (fast!)
▼
Memorystore Redis
│
│ GET session:{token}
│ Cache HIT (< 1ms latency)
◄
Backend Cloud Run
│
│ 2. Session valid, proceed
│ 3. Check dashboard cache
▼
Memorystore Redis
│
│ GET dashboard:stats:{userId}
│ Cache HIT or MISS
◄
Backend Cloud Run
│
│ If MISS: Query Cloud SQL
│ If HIT: Return cached data
▼
User Browser

```

**2. File Upload Flow:**
```

Admin Browser
│
│ POST /api/surat (multipart/form-data)
│ {data + file}
▼
Load Balancer
│
▼
Backend Cloud Run
│
│ 1. Verify token (X-API-TOKEN)
│ 2. Verify admin role
│ 3. Validate file (type, size)
▼
Multer Middleware
│
│ 4. Save to /tmp (Cloud Run)
▼
Backend Cloud Run
│
│ 5. Upload to Cloud Storage
▼
Cloud Storage
│
│ Store: uploads/2025/12/file-xxx.pdf
│ Return: gs://bucket/path
◄
Backend Cloud Run
│
│ 6. Save metadata to database
│ {file_url, pengirim, nomor_surat, ...}
▼
Cloud SQL
│
│ INSERT INTO surat ...
◄
Backend Cloud Run
│
│ 7. Return letter data
▼
Admin Browser
│
│ Display success message

```

**3. File Download Flow:**
```

User Browser
│
│ GET /api/surat/1/file
│ Headers: X-API-TOKEN
▼
Backend Cloud Run
│
│ 1. Verify token
│ 2. Get letter metadata
▼
Cloud SQL
│
│ SELECT file_url FROM surat WHERE id=1
◄
Backend Cloud Run
│
│ 3. Generate signed URL (1 hour)
▼
Cloud Storage
│
│ Signed URL with temp access
◄
Backend Cloud Run
│
│ 4. Stream file to client
│ Headers: Content-Disposition, Content-Type
▼
User Browser
│
│ Download file

```

---

## Scalability & High Availability

### Auto-Scaling Configuration

**Cloud Run Scaling Metrics:**
```

Metric Threshold Action
─────────────────────────────────────────────────────
CPU Utilization > 60% Add instance
Memory Utilization > 80% Add instance
Request Latency > 500ms Add instance
Concurrent Requests > 60/instance Add instance
Queue Depth > 20 requests Add instance

Scale Down:

- Idle time > 15 minutes
- Gradual scale to min instances
- Keep warm instances (min=1 for backend)

```

**Cloud SQL Scaling:**
```

Current: db-f1-micro (0.6GB RAM)
│
├─> db-g1-small (1.7GB RAM)
│ Trigger: Connection pool > 50
│
├─> db-n1-standard-1 (3.75GB RAM, 1 vCPU)
│ Trigger: CPU > 80% for 5 min
│
└─> db-n1-standard-2 (7.5GB RAM, 2 vCPU)
Trigger: CPU > 80% sustained

Read Replicas (Optional):

- Location: asia-southeast2-b
- Read-only queries
- Automatic failover

````

### High Availability Setup

**Component Availability:**

| Component | Availability | RPO | RTO |
|-----------|-------------|-----|-----|
| Cloud Run | 99.95% | 0 | <1 min |
| Cloud SQL | 99.95% | <1 min | 1-2 min |
| Cloud Storage | 99.99% | 0 | <1 sec |
| Load Balancer | 99.99% | 0 | <1 sec |

**Failure Scenarios:**

```yaml
Scenario 1: Cloud Run Instance Failure
  Detection: Health check fails (3 consecutive)
  Action: Terminate instance, start new one
  Impact: 0 downtime (other instances serve traffic)
  Duration: <30 seconds

Scenario 2: Cloud SQL Primary Failure
  Detection: Database connection timeout
  Action: Automatic failover to standby
  Impact: 1-2 minutes downtime
  Duration: 60-120 seconds

Scenario 3: Zone Failure (asia-southeast2-a)
  Detection: Multi-zone monitoring
  Action: Traffic rerouted to zone B/C
  Impact: <1 minute degraded performance
  Duration: Until zone recovers

Scenario 4: Region Failure (Disaster)
  Detection: Regional health checks
  Action: Manual failover to DR region
  Impact: 5-10 minutes downtime
  Duration: Manual intervention required
````

---

## Disaster Recovery

### Backup Strategy

**Cloud SQL Backups:**

```yaml
Automated Backups:
  Frequency: Daily at 03:00 WIB
  Retention: 7 days (configurable up to 365)
  Location: asia-southeast2
  Type: Full backup

Point-in-Time Recovery:
  Enabled: Yes
  Window: Up to 7 days
  Granularity: Down to the second

Transaction Logs:
  Retention: 7 days
  Frequency: Continuous

Manual Backups:
  On-demand: Before major changes
  Retention: Until manually deleted
```

**Cloud Storage Backups:**

```yaml
Object Versioning: Enabled
  Versions kept: 30 days
  Deleted objects: 30 days retention

Backup Bucket:
  Name: simas-files-backup
  Location: asia-northeast1 (Tokyo)
  Replication: Cross-region

Daily Sync:
  Schedule: 02:00 WIB
  Method: gsutil rsync
  Incremental: Yes
```

### Recovery Procedures

**RTO/RPO Targets:**

| Scenario            | RTO      | RPO       |
| ------------------- | -------- | --------- |
| Application failure | 5 min    | 0         |
| Database corruption | 30 min   | <1 hour   |
| Regional outage     | 4 hours  | <1 hour   |
| Complete disaster   | 24 hours | <24 hours |

**Recovery Steps:**

```bash
# 1. Restore Cloud SQL
gcloud sql backups restore BACKUP_ID \
  --backup-instance=simas-db \
  --backup-instance=simas-db-restored

# 2. Point-in-Time Recovery
gcloud sql instances clone simas-db simas-db-clone \
  --point-in-time='2025-12-18T10:00:00.000Z'

# 3. Restore Cloud Storage
gsutil -m rsync -r -d \
  gs://simas-files-backup \
  gs://simas-files-production

# 4. Redeploy Applications
gcloud run deploy simas-backend \
  --image gcr.io/PROJECT/simas-backend:STABLE_TAG

gcloud run deploy simas-frontend \
  --image gcr.io/PROJECT/simas-frontend:STABLE_TAG
```

---

## Monitoring & Observability

### Cloud Monitoring Dashboards

**Key Metrics:**

```yaml
Application Metrics:
  - Request rate (req/s)
  - Request latency (p50, p95, p99)
  - Error rate (%)
  - Success rate (%)

Infrastructure Metrics:
  - Instance count (Cloud Run)
  - CPU utilization (%)
  - Memory utilization (%)
  - Network throughput (Mbps)

Database Metrics:
  - Connections count
  - QPS (queries per second)
  - Transaction count
  - Replication lag (if HA)
  - Disk utilization (%)

Storage Metrics:
  - Bucket size (GB)
  - Request count
  - Egress bandwidth
  - Cache hit ratio (CDN)
```

**Alerting Policies:**

```yaml
Critical Alerts (PagerDuty):
  - Error rate > 5% for 5 minutes
  - Database connection failure
  - Service completely down
  - P99 latency > 5 seconds

Warning Alerts (Email):
  - Error rate > 2% for 10 minutes
  - CPU > 80% for 15 minutes
  - Memory > 90% for 10 minutes
  - Disk > 80% usage

Info Alerts (Slack):
  - Deployment completed
  - Scaling events
  - Backup completion
  - Certificate renewal
```

### Logging Strategy

**Log Aggregation:**

```yaml
Cloud Logging:
  Retention: 30 days (default)
  Export: BigQuery (long-term analysis)

Log Types:
  - Application logs (stdout/stderr)
  - Access logs (HTTP requests)
  - Audit logs (IAM changes)
  - System logs (Cloud Run events)

Log Levels:
  - ERROR: Application errors, exceptions
  - WARN: Warnings, degraded performance
  - INFO: Important events, state changes
  - DEBUG: Detailed execution flow
```

**Log-based Metrics:**

```yaml
Custom Metrics:
  - 401 Unauthorized count
  - File upload success/failure
  - Login attempts by IP
  - Database query duration
  - Cache hit/miss ratio
```

---

## Deployment Pipeline

### CI/CD Architecture

```
Developer
    │
    │ git push
    ▼
GitHub Repository
    │
    │ Webhook trigger
    ▼
Cloud Build
    │
    ├─> Build Docker images
    │   ├─> Backend
    │   └─> Frontend
    │
    ├─> Run tests
    │   ├─> Unit tests
    │   └─> Integration tests
    │
    ├─> Push to Container Registry
    │   ├─> gcr.io/PROJECT/simas-backend:TAG
    │   └─> gcr.io/PROJECT/simas-frontend:TAG
    │
    └─> Deploy to Cloud Run
        ├─> Rolling update (blue-green)
        ├─> Health checks
        └─> Traffic migration (gradual)
```

### Deployment Configuration

**Cloud Build Trigger:**

```yaml
Name: deploy-simas-production
Trigger: Push to main branch
Included files: backend/**, frontend/**
Build configuration: cloudbuild.yaml

Steps: 1. Build Backend
  2. Test Backend
  3. Build Frontend
  4. Test Frontend
  5. Push Images
  6. Deploy Backend
  7. Deploy Frontend
  8. Smoke Tests
  9. Notify Team

Timeout: 20 minutes
Service Account: cloudbuild@PROJECT.iam
```

**Deployment Strategy:**

```yaml
Strategy: Blue-Green with Traffic Split

Phase 1: Deploy new version (Green)
  - Deploy to 0% traffic
  - Run smoke tests
  - Duration: 2 minutes

Phase 2: Gradual rollout
  - 0% → 10% (monitor 5 min)
  - 10% → 50% (monitor 5 min)
  - 50% → 100% (monitor 10 min)

Phase 3: Complete or rollback
  - If error rate > 2%: Automatic rollback
  - If successful: Keep new version
  - Old version: Keep for 24 hours
```

---

## Cost Optimization

### Cost Breakdown (Estimated)

```yaml
Monthly Costs (Medium Traffic - 100k requests):
  Cloud Run Frontend:     $1.60
  Cloud Run Backend:      $65.61
  Cloud SQL (db-f1-micro): $14.05
  Memorystore Redis (1GB): $43.80
  Cloud Storage:          $1.77
  Load Balancer:          $18.25
  VPC Connector:          $20.00
  Networking:             $3.00
  ────────────────────────────────
  Total:                  $168.08/month
  (Rp 2,605,240 @ 15,500)

Cost Breakdown by Traffic Level:
  Startup (10k req/mo):   ~Rp 2.1M/month
  Small (50k req/mo):     ~Rp 2.4M/month
  Medium (100k req/mo):   ~Rp 2.6M/month
  Large (500k req/mo):    ~Rp 11.2M/month

Optimization Opportunities:
  1. Backend min=0 → Save $62/month (~Rp 961k)
  2. Skip Load Balancer → Save $18/month (~Rp 279k)
  3. Redis committed use (1-year) → Save 25% (~Rp 170k)
  4. Use Committed Use Discounts → Save 30-50%
  5. Storage lifecycle → Save 50% on old files
  6. Cache-first strategy → Reduce DB load
```

---

## Best Practices

### Development

✅ Implement proper error handling
✅ Use connection pooling
✅ Implement caching strategies
✅ Optimize Docker images

### Operations

✅ Monitor all key metrics
✅ Set up proper alerting
✅ Regular backup testing
✅ Document runbooks
✅ Capacity planning

### Security

✅ Principle of least privilege
✅ Regular security audits
✅ Keep dependencies updated
✅ Use Secret Manager
✅ Enable VPC Service Controls

---

## Conclusion

SIMAS leverages Google Cloud Platform's fully managed services to deliver:

- **Scalable** architecture that grows with demand
- **Reliable** infrastructure with 99.95% uptime
- **Secure** deployment with enterprise-grade security
- **Cost-effective** pay-per-use pricing
- **Maintainable** serverless operations

This cloud-native architecture eliminates infrastructure management overhead and allows focus on application development and user value delivery.

---

**Document Version:** 1.0
**Last Updated:** December 18, 2025
**Architecture Owner:** DevOps Team
**Next Review:** March 2026
