# SIMAS - Sistem Manajemen Surat

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![GCP](https://img.shields.io/badge/Google_Cloud-Ready-4285F4?logo=google-cloud)
![Cloud Run](https://img.shields.io/badge/Cloud_Run-Deployed-4285F4?logo=google-cloud)

**Cloud-Native Document Management System** - Aplikasi manajemen surat dan dokumen instansi yang di-deploy sepenuhnya di **Google Cloud Platform (GCP)** dengan arsitektur sederhana dan fully managed services.

## ☁️ Cloud Architecture

```
                    Internet
                       │
                       ▼
           ┌─────────────────────┐
           │  Cloud Run          │
           │  Frontend + Backend │
           └──────────┬───────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
┌─────────────────┐      ┌─────────────────┐
│  Cloud SQL      │      │  Memorystore    │
│  (PostgreSQL)   │      │  (Redis)        │
└─────────────────┘      └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Cloud Storage  │
│  (PDF/DOCX)     │
└─────────────────┘
```

**Region:** `asia-southeast1` (Singapore)

## 🚀 Quick Start (Local Development)

```bash
# Clone repository
git clone https://github.com/MegumenZ/Simas.git
cd Simas

# Setup Backend (with Cloud SQL Proxy for local dev)
cd backend
npm install
npx prisma migrate deploy
npx prisma generate
npm run build
npm start

# Setup Frontend
cd ../frontend
npm install
npm run build
npm start
```

**Production:** See [Cloud Deployment Guide](#-cloud-deployment)

## 📋 Table of Contents

- [Cloud Architecture](#️-cloud-architecture)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Cloud Infrastructure](#️-google-cloud-infrastructure)
- [Architecture Deep Dive](#-architecture-deep-dive)
- [Installation](#-installation)
- [Cloud Deployment](#-cloud-deployment)
- [Documentation](#-documentation)
- [Monitoring & Operations](#-monitoring--operations)
- [Cost Optimization](#-cost-optimization)
- [License](#-license)

## ✨ Features

### User Management

- 👤 Role-based access control (Admin & User)
- 🔐 Secure authentication with token-based system
- 📝 Profile management
- 👥 User CRUD operations (Admin only)

### Letter Management

- 📬 Create, read, update, delete surat
- 📎 File upload support (PDF & DOCX)
- 🔄 Status tracking (Pending, Diterima)
- 🔍 Advanced filtering (date, month, year)
- 📊 Pagination support
- 📥 File download functionality
- 📈 Monthly reports

### Dashboard & Analytics

- 📊 Real-time statistics
- 📈 Recent letters overview
- 👥 User activity monitoring (Admin)
- 🎯 Role-specific dashboards

## 🛠 Technology Stack

### ☁️ Google Cloud Services (Production)

- **Compute**: Cloud Run (Serverless containers)
- **Database**: Cloud SQL for PostgreSQL 14
- **Cache**: Memorystore for Redis 7.0 (Session & Cache)
- **Storage**: Cloud Storage (Regional, Standard class)
- **Networking**: Cloud Load Balancing + Cloud CDN
- **Security**: IAM, VPC, Private IP
- **Monitoring**: Cloud Monitoring + Cloud Logging
- **Registry**: Container Registry

### 🖥 Backend (Express.js on Cloud Run)

- **Runtime**: Node.js 20
- **Framework**: Express.js 5.1
- **ORM**: Prisma 6.9
- **Cache**: ioredis (Redis client)
- **Authentication**: Token-based (UUID + Redis session)
- **Validation**: Zod
- **File Upload**: Multer → Cloud Storage
- **Logging**: Winston → Cloud Logging
- **Testing**: Jest + Supertest

### 🎨 Frontend (Next.js on Cloud Run)

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **HTTP Client**: Fetch API
- **State Management**: React Hooks
- **PDF Generation**: jsPDF + jsPDF-autotable
- **Date Handling**: date-fns

## ☁️ Google Cloud Infrastructure

### Service Configuration

| Service                  | Configuration                                                                   | Purpose                      |
| ------------------------ | ------------------------------------------------------------------------------- | ---------------------------- |
| **Cloud Run (Frontend)** | 512Mi RAM, 1 vCPU<br>Min: 0, Max: 10 instances<br>Region: asia-southeast2       | Next.js SSR & Static Serving |
| **Cloud Run (Backend)**  | 512Mi-1Gi RAM, 1-2 vCPU<br>Min: 1, Max: 10 instances<br>Region: asia-southeast2 | REST API Server              |
| **Cloud SQL**            | PostgreSQL 14<br>db-f1-micro (0.6GB RAM)<br>10GB SSD, Private IP                | Primary Database             |
| **Memorystore Redis**    | Redis 7.0, Standard Tier<br>1GB Memory<br>Private IP, HA enabled                | Session & Cache Store        |
| **Cloud Storage**        | Standard class, Regional<br>Lifecycle: 90d → Nearline                           | File Storage (PDF/DOCX)      |
| **Cloud Load Balancer**  | External HTTPS<br>Global Anycast IP<br>SSL/TLS termination                      | Traffic Distribution         |
| **VPC Connector**        | 10.12.0.0/28<br>200-1000 Mbps                                                   | Private DB/Redis Connection  |

### Security Architecture

- **Network**: VPC with private IP for Cloud SQL
- **IAM**: Least-privilege service accounts
- **Secrets**: Secret Manager for credentials
- **Encryption**: TLS 1.3 in transit, AES-256 at rest
- **Auth**: Token-based with 24h expiration
- **DDoS**: Cloud Armor protection (optional)

## 🏗 Architecture Deep Dive

### Cloud-Native Request Flow

```
User Request
    │
    ▼
Cloud Load Balancer (Global Anycast IP)
    │ SSL/TLS Termination
    │ DDoS Protection
    ▼
Cloud CDN (Static Assets)
    │ Cache Hit? → Return cached
    │ Cache Miss? ▼
    │
    ├─────────────────────┬─────────────────────┐
    │                     │                     │
    ▼                     ▼                     ▼
Frontend Cloud Run   Backend Cloud Run   Backend Cloud Run
(Instance 1)         (Instance 1)        (Instance 2-10)
    │                     │                     │
    │                     │ VPC Connector       │
    │                     │ (Private IP)        │
    │                     ▼                     │
    │            Cloud SQL PostgreSQL           │
    │            (Private IP only)              │
    │                     │                     │
    │                     ▼                     │
    │            Cloud Storage Bucket           │
    │            (Regional - asia-se2)          │
    │                     │                     │
    └─────────────────────┴─────────────────────┘
                          │
                          ▼
              Cloud Monitoring & Logging
              (Metrics, Logs, Traces)
```

### Component Responsibilities

**Frontend (Cloud Run):**

- Server-Side Rendering (SSR)
- Static page generation
- Client-side routing
- API integration
- Session management

**Backend (Cloud Run):**

- REST API endpoints (21 routes)
- Business logic execution
- Authentication & authorization
- File upload orchestration
- Database operations via Prisma

**Cloud SQL:**

- User authentication data
- Letter metadata storage
- Transaction management
- Automated backups (daily)
- Point-in-time recovery

**Cloud Storage:**

- PDF/DOCX file storage
- Organized by date (YYYY/MM/)
- Lifecycle management
- Versioning enabled
- Regional redundancy

### Data Flow Patterns

**1. User Authentication:**

```
Browser → Backend Cloud Run → Cloud SQL
         ← Token (UUID) ←
         Store in cookie
```

**2. File Upload:**

```
Browser → Backend → /tmp → Cloud Storage
                 → Cloud SQL (metadata)
         ← File URL ←
```

**3. File Download:**

```
Browser → Backend → Cloud Storage (Signed URL)
         ← Stream file ←
```

## 📦 Installation

### Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm atau yarn

### Backend Setup

1. Navigate to backend directory

```bash
cd backend
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
cp .env.example .env
# Edit .env dengan konfigurasi database Anda
```

4. Run database migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

5. Initialize admin user (optional)

```bash
npm run init-users
```

6. Start development server

```bash
npm run build
npm start
```

Backend akan berjalan di `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory

```bash
cd frontend
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
cp .env.example .env
# Set NEXT_PUBLIC_API_URL ke backend URL
```

4. Start development server

```bash
npm run dev
# atau untuk production
npm run build
npm start
```

Frontend akan berjalan di `http://localhost:3000`

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/simas"

# Server
PORT=3001
WEB_ORIGIN="http://localhost:3000"

# Cloud SQL (Production)
INSTANCE_CONNECTION_NAME="project:region:instance"
```

### Frontend (.env)

```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Production
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
```

## 🚀 Cloud Deployment

### Prerequisites

1. **Google Cloud Account** dengan billing enabled
2. **gcloud CLI** installed dan authenticated
3. **Project GCP** sudah dibuat

### Initial Setup

```bash
# Login dan set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  sql-component.googleapis.com \
  sqladmin.googleapis.com \
  storage.googleapis.com \
  redis.googleapis.com \
  vpcaccess.googleapis.com

# Set default region
gcloud config set run/region asia-southeast1
```

### 1. Setup Cloud SQL

```bash
# Create PostgreSQL instance
gcloud sql instances create simas-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=asia-southeast1 \
  --network=default \
  --no-assign-ip

# Create database
gcloud sql databases create simas \
  --instance=simas-db

# Create user
gcloud sql users create simas_user \
  --instance=simas-db \
  --password=YOUR_SECURE_PASSWORD

# Get connection name
gcloud sql instances describe simas-db --format="value(connectionName)"
# Output: project-id:asia-southeast2:simas-db
```

### 2. Setup Cloud Storage

```bash
# Create bucket for file uploads
gsutil mb -c STANDARD -l asia-southeast1 gs://simas-files-YOUR_PROJECT_ID

# Set lifecycle policy
cat > lifecycle.json <<EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
        "condition": {"age": 90}
      }
    ]
  }
}
EOF

gsutil lifecycle set lifecycle.json gs://simas-files-YOUR_PROJECT_ID

# Set CORS for file access
cat > cors.json <<EOF
[
  {
    "origin": ["https://your-backend-url.run.app"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF

gsutil cors set cors.json gs://simas-files-YOUR_PROJECT_ID
```

### 3. Setup Memorystore for Redis

```bash
# Create Redis instance (Basic tier)
gcloud redis instances create simas-redis \
  --size=1 \
  --region=asia-southeast1 \
  --redis-version=redis_7_0 \
  --tier=basic \
  --network=default

# Get Redis connection info
gcloud redis instances describe simas-redis \
  --region=asia-southeast1 \
  --format="value(host,port)"
# Output: 10.11.x.x 6379 AUTH_STRING
# Save these values for deployment
```

### 4. Setup VPC Connector

```bash
# Create VPC Connector for Cloud SQL and Redis private IP
gcloud compute networks vpc-access connectors create simas-vpc-connector \
  --region=asia-southeast1 \
  --range=10.12.0.0/28
```

### 5. Deploy Backend

```bash
cd backend

# Build and deploy
gcloud run deploy simas-backend \
  --source . \
  --platform=managed \
  --region=asia-southeast1 \
  --allow-unauthenticated \
  --vpc-connector=simas-vpc-connector \
  --add-cloudsql-instances=YOUR_PROJECT_ID:asia-southeast1:simas-db \
  --set-env-vars="DATABASE_URL=postgresql://simas_user:YOUR_PASSWORD@/simas?host=/cloudsql/YOUR_PROJECT_ID:asia-southeast1:simas-db" \
  --set-env-vars="REDIS_HOST=10.11.x.x" \
  --set-env-vars="REDIS_PORT=6379" \
  --set-env-vars="WEB_ORIGIN=https://YOUR_FRONTEND_URL" \
  --set-env-vars="NODE_ENV=production" \
  --memory=512Mi \
  --cpu=1

# Run migrations
gcloud run jobs create simas-migrate \
  --image=gcr.io/YOUR_PROJECT/simas-backend \
  --region=asia-southeast2 \
  --vpc-connector=simas-vpc-connector \
  --add-cloudsql-instances=YOUR_PROJECT_ID:asia-southeast2:simas-db \
  --set-env-vars="DATABASE_URL=..." \
  --command="npx" \
  --args="prisma,migrate,deploy"

gcloud run jobs execute simas-migrate --region=asia-southeast2
```

### 6. Deploy Frontend

```bash
cd frontend

# Deploy
gcloud run deploy simas-frontend \
  --source . \
  --platform=managed \
  --region=asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=https://simas-backend-xxx.run.app" \
  --memory=512Mi \
  --cpu=1

# Get URL
gcloud run services describe simas-frontend \
  --region=asia-southeast1 \
  --format="value(status.url)"
```

### 7. Setup Custom Domain (Optional)

```bash
# Map domain to Cloud Run
gcloud run domain-mappings create \
  --service=simas-frontend \
  --domain=simas.yourdomain.com \
  --region=asia-southeast1

# Follow DNS instructions to verify domain
```

### 8. Setup Monitoring (Optional)

```bash
# Create notification channel (Email)
gcloud alpha monitoring channels create \
  --display-name="DevOps Team" \
  --type=email \
  --channel-labels=email_address=devops@yourdomain.com

# Create alert for high error rate
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="SIMAS High Error Rate" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=0.05 \
  --condition-threshold-duration=300s
```

### CI/CD Setup (Optional)

**Manual deployment:**

```bash
# Build and deploy backend
cd backend
gcloud run deploy simas-backend --source .

# Build and deploy frontend
cd frontend
gcloud run deploy simas-frontend --source .
```

**Automatic deployment via GitHub:**

```bash
# Connect GitHub repository to Cloud Run
gcloud run deploy simas-backend \
  --source=https://github.com/YOUR_USER/YOUR_REPO \
  --branch=main
```

## 📚 Documentation

# Build and deploy frontend

cd frontend
gcloud run deploy simas-frontend --source .

````

**Automatic deployment via GitHub:**
```bash
# Connect GitHub repository to Cloud Run
gcloud run deploy simas-backend \
  --source=https://github.com/YOUR_USER/YOUR_REPO \
  --branch=main
````

## 📚 Documentation

Dokumentasi lengkap tersedia di folder `docs/`:

### 📖 Primary Documentation

- **[Cloud Architecture](./docs/ARCHITECTURE.md)** ⭐ **NEW!** - Google Cloud deployment architecture, networking, security, scaling, disaster recovery
- **[Technical Documentation](./docs/TECHNICAL.md)** - System architecture, code structure, implementation details
- **[API Documentation](./docs/API.md)** - Complete REST API endpoints documentation
- **[User Manual](./docs/USER_MANUAL.md)** - End-user guide and tutorials
- **[Cost Analysis](./docs/COST_ANALYSIS.md)** - GCP cost breakdown and optimization

### 🔧 API Documentation

- **[OpenAPI Specification](./docs/openapi.yaml)** - OpenAPI 3.0 spec
- **[Swagger UI](./docs/swagger.html)** - Interactive API explorer
- **[API Quick Guide](./docs/API_README.md)** - How to use API documentation

### 🔥 Quick Access

```bash
# Open Interactive API Documentation
cd docs
python -m http.server 8080
# Visit: http://localhost:8080/swagger.html

# Import to Postman/Insomnia
# File: docs/openapi.yaml
```

## 📊 Monitoring & Operations

### Cloud Monitoring Dashboard

Access via GCP Console: **Monitoring → Dashboards → SIMAS**

**Key Metrics:**

- Request rate & latency (p50, p95, p99)
- Error rate & success rate
- Instance count & CPU/Memory usage
- Database connections & QPS
- Storage usage & bandwidth

### Cloud Logging

**View logs:**

```bash
# Backend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=simas-backend" --limit 50

# Frontend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=simas-frontend" --limit 50

# Error logs only
gcloud logging read "severity>=ERROR" --limit 20
```

### Health Checks

**Endpoints:**

- Frontend: `https://your-frontend-url.run.app/_next/health`
- Backend: `https://your-backend-url.run.app/health`

**Check from CLI:**

```bash
# Backend health
curl -i https://simas-backend-xxx.run.app/health

# Expected: 200 OK
# Response: {"status":"ok","timestamp":"..."}
```

### Alerting

**Configured Alerts:**

- Error rate > 5% for 5 minutes → PagerDuty
- P99 latency > 2 seconds → Email
- Database connections > 80 → Slack
- CPU utilization > 80% for 15 min → Email

## 💰 Cost Optimization

### Current Estimated Costs

**Monthly Cost (Medium Traffic - 100k requests):**

```
Service                      Cost/Month
─────────────────────────────────────────
Cloud Run - Backend          Rp 1,016,550
Cloud Run - Frontend         Rp     24,800
Cloud SQL (db-f1-micro)      Rp    217,750
Memorystore Redis (1GB)      Rp    678,900
Cloud Storage                Rp     27,450
Load Balancer                Rp    282,875
VPC Connector                Rp    310,000
Networking                   Rp     46,500
─────────────────────────────────────────
Total                        Rp 2,604,825
                            (~$168 USD)
```

**Cost Breakdown by Traffic Level:**

- **Startup** (10k req/mo): ~Rp 2.1M/month
- **Small** (50k req/mo): ~Rp 2.4M/month
- **Medium** (100k req/mo): ~Rp 2.6M/month
- **Large** (500k req/mo): ~Rp 11.2M/month

See [COST_ANALYSIS.md](./docs/COST_ANALYSIS.md) for detailed breakdown.

### Optimization Tips

**1. Scale Backend to Zero (if tolerable):**

```bash
gcloud run services update simas-backend \
  --min-instances=0  # Save ~Rp 950k/month
  # Trade-off: 2-3s cold start
```

**2. Use Committed Use Discounts:**

- 1-year: 25% discount (~Rp 170k saved on Redis)
- 3-year: 52% discount
- Best for: Cloud SQL, Memorystore Redis, VPC Connector

**3. Redis Cache-First Strategy:**

```javascript
// Reduce database load by caching frequently accessed data
// Hit rate > 95% = fewer Cloud SQL queries
// Potential savings: 20-30% on database costs
```

**4. Enable Cloud CDN:**

```bash
# Cache static assets, reduce Cloud Run costs
# Potential savings: 30-40% on frontend costs
```

**5. Storage Lifecycle:**

```bash
# Already configured:
# 90 days → Nearline (50% cheaper)
# 365 days → Coldline (70% cheaper)
```

**6. Optimize Images:**

- Use distroless or alpine base images
- Multi-stage builds
- Layer caching in Cloud Build

## 📄 License

This project is licensed under the ISC License.
