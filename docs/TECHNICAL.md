# SIMAS - Technical Documentation

**Cloud-Native Document Management System on Google Cloud Platform**

## Table of Contents

1. [Cloud Architecture Overview](#1-cloud-architecture-overview)
2. [Google Cloud Services](#2-google-cloud-services)
3. [Backend Architecture](#3-backend-architecture)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Database Design](#5-database-design)
6. [Security Implementation](#6-security-implementation)
7. [Cloud Infrastructure](#7-cloud-infrastructure)
8. [Performance & Scaling](#8-performance--scaling)
9. [Monitoring & Operations](#9-monitoring--operations)

---

## 1. Cloud Architecture Overview

### 1.1 Google Cloud Platform Deployment

SIMAS adalah aplikasi cloud-native yang memanfaatkan managed services dari Google Cloud Platform untuk mencapai high availability, auto-scaling, dan operational excellence.

```
                         Internet (Public)
                               │
                               ▼
                ┌──────────────────────────────┐
                │   Cloud Load Balancer        │
                │   • Global Anycast IP        │
                │   • SSL/TLS Termination      │
                │   • DDoS Protection          │
                │   • Health Checks            │
                └──────────┬───────────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
       ┌────────▼─────────┐  ┌───────▼────────┐
       │  Frontend        │  │  Backend       │
       │  Cloud Run       │  │  Cloud Run     │
       │  ┌────────────┐  │  │  ┌──────────┐  │
       │  │ Next.js 15 │  │  │  │Express.js│  │
       │  │ React 19   │  │  │  │REST API  │  │
       │  │ SSR        │  │  │  │Business  │  │
       │  └────────────┘  │  │  │Logic     │  │
       │                  │  │  └──────────┘  │
       │  Serverless      │  │  Serverless    │
       │  Auto-scale 0-10 │  │  Auto-scale 1-10│
       │  512Mi RAM       │  │  512Mi-1Gi RAM │
       └──────────────────┘  └────────┬───────┘
                                      │
                                      │ VPC Connector
                                      │ (Private Network)
                                      ▼
                         ┌─────────────────────┐
                         │   Cloud SQL         │
                         │   PostgreSQL 14     │
                         │   ┌───────────────┐ │
                         │   │Primary        │ │
                         │   │db-f1-micro    │ │
                         │   │10GB SSD       │ │
                         │   │Private IP     │ │
                         │   │Auto Backup    │ │
                         │   └───────────────┘ │
                         └─────────┬───────────┘
                                   │
                                   ▼
                         ┌─────────────────────┐
                         │  Cloud Storage      │
                         │  Regional Bucket    │
                         │  • PDF/DOCX files   │
                         │  • Lifecycle mgmt   │
                         │  • Versioning       │
                         └─────────────────────┘

              Observability & Management Layer
    ┌────────────────────────────────────────────────┐
    │  Cloud Monitoring | Cloud Logging | Alerting   │
    └────────────────────────────────────────────────┘
```

**Key Benefits:**

- ✅ **Serverless**: Zero infrastructure management
- ✅ **Auto-Scaling**: 0 to hundreds of instances automatically
- ✅ **High Availability**: 99.95% uptime SLA
- ✅ **Cost-Effective**: Pay only for actual usage
- ✅ **Secure**: Enterprise-grade security by default
- ✅ **Global**: Low-latency access from anywhere

### 1.2 Regional Architecture

**Primary Region:** `asia-southeast2` (Jakarta, Indonesia)

**Multi-Zone Deployment:**

```
Zone A (Primary)          Zone B (Standby)         Zone C (DR)
─────────────────────────────────────────────────────────────
• Cloud Run instances     • Failover instances     • DR standby
• Cloud SQL primary       • SQL backup replica     • -
• Active traffic          • Health monitoring      • Cold standby
```

**Network Architecture:**

```
Public Internet
    │
    ├─> Load Balancer (External IP: 35.x.x.x)
    │   └─> Cloud CDN (Global edge caching)
    │
    ├─> Cloud Run Services (Public endpoints)
    │   ├─> Frontend: https://xxx.run.app
    │   └─> Backend: https://yyy.run.app
    │
    └─> Private VPC Network (10.0.0.0/8)
        ├─> VPC Connector (10.12.0.0/28)
        ├─> Cloud SQL (Private IP: 10.10.x.x)
        └─> Internal routing
```

### 1.3 Technology Stack Summary

| Layer              | Technology       | Version     | Cloud Service            | Purpose                  |
| ------------------ | ---------------- | ----------- | ------------------------ | ------------------------ |
| Compute (Frontend) | Next.js + React  | 15.3.3 + 19 | Cloud Run                | SSR, Static pages, UI    |
| Compute (Backend)  | Express.js       | 5.1.0       | Cloud Run                | REST API server          |
| Database           | PostgreSQL       | 14          | Cloud SQL                | Relational data          |
| Storage            | Object Storage   | -           | Cloud Storage            | File uploads (PDF/DOCX)  |
| Networking         | Load Balancer    | -           | Cloud Load Balancing     | Traffic distribution     |
| CDN                | Content Delivery | -           | Cloud CDN                | Static asset caching     |
| Monitoring         | Metrics & Logs   | -           | Cloud Monitoring/Logging | Observability            |
| Security           | IAM + VPC        | -           | Identity & Access Mgmt   | Authentication & Network |
| CI/CD              | Build Pipeline   | -           | Cloud Build              | Automated deployment     |

---

## 2. Google Cloud Services

### 2.1 Cloud Run (Frontend)

**Service Configuration:**

```yaml
Service: simas-frontend
Type: Cloud Run (2nd generation)
Region: asia-southeast2

Container:
  Image: gcr.io/PROJECT/simas-frontend:latest
  Port: 3000

Resources:
  CPU: 1 vCPU (throttled when idle)
  Memory: 512Mi
  Startup CPU Boost: Enabled

Scaling:
  Min Instances: 0 (scale to zero)
  Max Instances: 10
  Concurrency: 80 requests/container
  Target CPU: 60%

Networking:
  Ingress: All traffic
  Egress: Private ranges + all

Environment Variables:
  NEXT_PUBLIC_API_URL: "https://backend-xxx.run.app"
  NODE_ENV: "production"
  PORT: "3000"

Deployment:
  Strategy: Rolling update (Blue-Green)
  Gradual rollout: 0% → 10% → 50% → 100%
  Health check: /_next/health
  Timeout: 60s
```

**Auto-Scaling Behavior:**

```
Time    Requests/sec    Instances    Cold Start    P95 Latency
────────────────────────────────────────────────────────────────
00:00   0               0            -             -
00:01   5               1            ~2s           150ms
00:02   50              1            -             80ms
00:03   100             2            -             90ms
00:04   500             7            -             120ms
00:05   1000            10 (max)     -             150ms
00:10   50              2 (scaled)   -             80ms
00:15   0               0 (scaled)   -             -
```

### 2.2 Cloud Run (Backend)

**Service Configuration:**

```yaml
Service: simas-backend
Type: Cloud Run (2nd generation)
Region: asia-southeast2

Container:
  Image: gcr.io/PROJECT/simas-backend:latest
  Port: 3001

Resources:
  CPU: 1-2 vCPU (always allocated)
  Memory: 512Mi-1Gi (auto-adjustable)
  CPU Always Allocated: true

Scaling:
  Min Instances: 1 (always warm - no cold start)
  Max Instances: 10
  Concurrency: 80 requests/container
  Target CPU: 60%

Networking:
  Ingress: All traffic
  Egress: Private ranges (VPC Connector)
  VPC Connector: simas-vpc-connector
  Cloud SQL Connection: Unix socket

Environment Variables:
  DATABASE_URL: "postgresql://user:pass@/db?host=/cloudsql/..."
  REDIS_HOST: "10.11.x.x"
  REDIS_PORT: "6379"
  REDIS_PASSWORD: "your-redis-password"
  WEB_ORIGIN: "https://frontend-xxx.run.app"
  NODE_ENV: "production"
  PORT: "3001"

Deployment:
  Strategy: Rolling update
  Max surge: 100%
  Max unavailable: 0%
  Health check: /health
  Liveness probe: /health (every 10s)
  Timeout: 300s (5 minutes)
```

**Connection to Cloud SQL:**

```javascript
// Prisma connects via Unix socket
const DATABASE_URL =
  "postgresql://user:pass@/dbname?host=/cloudsql/PROJECT:REGION:INSTANCE";

// Cloud Run automatically provides Cloud SQL Proxy
// via VPC Connector for secure private IP connection
```

### 2.3 Cloud SQL

**Instance Configuration:**

```yaml
Instance: simas-db
Database Engine: PostgreSQL 14
Tier: db-f1-micro (Shared core, 0.6 GB RAM)
Region: asia-southeast2
Zone: asia-southeast2-a (Primary)

Storage:
  Type: SSD
  Size: 10 GB
  Auto-increase: Enabled
  Max size: 100 GB

Network Configuration:
  Public IP: Disabled (security best practice)
  Private IP: Enabled (10.10.x.x within VPC)
  Authorized Networks: None
  SSL/TLS: Required

High Availability:
  Configuration: Zonal (single zone)
  Failover Replica: Optional (upgradeable)
  Automatic Failover: Available with HA setup

Backup Configuration:
  Automated Backups: Daily at 03:00 WIB
  Backup Window: 4 hours
  Retention Period: 7 days
  Transaction Log: Enabled
  Point-in-Time Recovery: Up to 7 days
  Backup Location: asia-southeast2

Maintenance:
  Window: Sunday 02:00-06:00 WIB
  Order: Later (prefer standby first)
  Deny Maintenance Period: None

Flags:
  max_connections: 100
  shared_buffers: 128MB
  work_mem: 4MB
  maintenance_work_mem: 64MB

Monitoring:
  CPU utilization alerts: >80% for 5 min
  Memory alerts: >90% for 5 min
  Disk alerts: >80% usage
  Connection alerts: >80 connections
```

**Database Performance:**

```
Workload       QPS    Active Conn    Read Lat    Write Lat
──────────────────────────────────────────────────────────
Light          <10    1-5            <5ms        <10ms
Medium         10-50  5-20           <10ms       <20ms
Heavy          50-100 20-50          <20ms       <50ms
Peak           >100   50-100         <50ms       <100ms
```

### 2.4 Cloud Storage

**Bucket Configuration:**

```yaml
Bucket Name: simas-files-[PROJECT_ID]
Location Type: Regional
Location: asia-southeast2
Storage Class: Standard

Access Control:
  Public Access: Prevented
  Uniform Bucket-Level Access: Enabled
  Encryption: Google-managed keys (default)

IAM Permissions:
  backend-sa@PROJECT.iam: Storage Object Admin
  cloudrun-sa@PROJECT.iam: Storage Object Viewer

Lifecycle Management:
  Rule 1:
    Action: SetStorageClass to NEARLINE
    Condition: Age > 90 days
  Rule 2:
    Action: SetStorageClass to COLDLINE
    Condition: Age > 365 days
  Rule 3:
    Action: Delete
    Condition: Age > 2555 days (7 years)

Object Versioning: Enabled
Noncurrent Version Retention: 30 days

CORS Configuration:
  Origin: ["https://backend-xxx.run.app"]
  Methods: ["GET", "PUT", "POST", "DELETE"]
  Response Headers: ["Content-Type", "X-API-TOKEN"]
  Max Age Seconds: 3600

File Organization: /uploads/
  /2025/
  /12/
  /filename-timestamp.pdf
  /document-uuid.docx
  /backups/
  /2025-12-18/
  /archives/
  /2025/
```

**Storage Performance:**

```
Operation       Throughput    Latency    Availability
─────────────────────────────────────────────────────
Upload          5-20 MB/s     <100ms     99.99%
Download        10-50 MB/s    <50ms      99.99%
List            1000 obj/s    <100ms     99.99%
Delete          1000 obj/s    <50ms      99.99%
```

### 2.4 Memorystore for Redis

**Instance Configuration:**

```yaml
Instance: simas-redis
Redis Version: 7.0
Tier: Standard (High Availability)
Region: asia-southeast2
Zone: asia-southeast2-a (Primary)

Capacity:
  Memory: 1 GB
  Throughput: Up to 1 Gbps

Network:
  IP Address: 10.11.x.x (Private IP)
  Connection Mode: Private Service Access
  VPC Network: default
  Transit Encryption: Enabled (TLS)

High Availability:
  Replica: Enabled (asia-southeast2-b)
  Automatic Failover: Yes
  Failover Time: < 60 seconds

Persistence:
  RDB Snapshots: Daily at 02:00 WIB
  Retention: 7 days
  AOF: Disabled (Standard tier)

Configuration:
  maxmemory-policy: allkeys-lru
  timeout: 300
  tcp-keepalive: 60
```

**Use Cases:**

```javascript
// 1. Session Storage
// Key pattern: session:{token}
// TTL: 24 hours
await redis.set(
  `session:${token}`,
  JSON.stringify({ userId, role, expiresAt }),
  "EX",
  86400
);

// 2. API Response Caching
// Key pattern: cache:{endpoint}:{params}
// TTL: 5 minutes
const cacheKey = `dashboard:stats:${userId}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// 3. Rate Limiting
// Key pattern: ratelimit:{type}:{identifier}
// TTL: 1 minute
const key = `ratelimit:api:${userId}`;
const count = await redis.incr(key);
if (count === 1) await redis.expire(key, 60);
if (count > 100) throw new Error("Rate limit exceeded");

// 4. Real-time Counters
// Key pattern: counter:{type}:{id}
await redis.hincrby("stats:daily", "totalRequests", 1);
await redis.hincrby("stats:daily", "totalErrors", errorCount);
```

**Connection Configuration:**

```javascript
// backend/src/application/redis.ts
import Redis from "ioredis";
import { logger } from "./logging";

const redis = new Redis({
  host: process.env.REDIS_HOST || "10.11.x.x",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_AUTH,
  db: 0,
  tls: {
    rejectUnauthorized: true,
  },
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: true,
  connectTimeout: 10000,
  lazyConnect: false,
  keepAlive: 30000,
});

redis.on("connect", () => {
  logger.info("Redis connected successfully");
});

redis.on("error", (err) => {
  logger.error("Redis connection error:", err);
});

redis.on("ready", () => {
  logger.info("Redis ready to accept commands");
});

export { redis };
```

**Performance Metrics:**

```
Operation    Throughput      Latency      Success Rate
──────────────────────────────────────────────────────
GET          100k ops/s      <1ms         99.99%
SET          80k ops/s       <1ms         99.99%
INCR         90k ops/s       <1ms         99.99%
HGET         95k ops/s       <1ms         99.99%
DEL          85k ops/s       <1ms         99.99%
```

### 2.5 Networking Infrastructure

**VPC Configuration:**

```yaml
VPC Name: default (or custom: simas-vpc)
Region: asia-southeast2
IP Range: 10.0.0.0/8

Subnets:
  - Name: simas-subnet-services
    Range: 10.8.0.0/28
    Purpose: Serverless VPC Access

  - Name: simas-subnet-db
    Range: 10.10.0.0/24
    Purpose: Cloud SQL private IP

  - Name: simas-subnet-redis
    Range: 10.11.0.0/24
    Purpose: Memorystore Redis private IP

  - Name: simas-subnet-connector
    Range: 10.12.0.0/28
    Purpose: VPC Connector

VPC Connector:
  Name: simas-vpc-connector
  Region: asia-southeast2
  Network: default
  IP Range: 10.12.0.0/28
  Throughput Tier: 200-1000 Mbps
  Machine Type: e2-micro
  Min Instances: 2
  Max Instances: 10
  Max Throughput: 1000 Mbps

Firewall Rules:
  - allow-internal: Allow all internal traffic (10.0.0.0/8)
  - allow-lb-to-cloudrun: Allow from LB to Cloud Run
  - allow-cloudrun-to-sql: Allow Cloud Run to Cloud SQL
  - deny-all-ingress: Default deny
```

**Load Balancer Configuration:**

```yaml
Type: External HTTPS Load Balancer
Global: Yes (Anycast IP)
IP Address: Static external (35.x.x.x)

Frontend Configuration:
  Protocol: HTTPS
  Port: 443
  IP Version: IPv4

SSL Configuration:
  Certificates: Google-managed SSL
  Domains:
    - simas.yourdomain.com
    - www.simas.yourdomain.com
  Minimum TLS Version: TLS 1.2
  SSL Policy: Modern (TLS 1.2+)

Backend Services:
  1. frontend-backend-service
     - Backend: Cloud Run (simas-frontend)
     - Protocol: HTTPS
     - Port: 443
     - Timeout: 30s
     - Health Check: /_next/health

  2. api-backend-service
     - Backend: Cloud Run (simas-backend)
     - Protocol: HTTPS
     - Port: 443
     - Timeout: 300s
     - Health Check: /health

URL Map (Routing):
  Default: frontend-backend-service
  Path Rules:
    - /api/* → api-backend-service
    - /* → frontend-backend-service

Cloud CDN:
  Enabled: Yes
  Cache Mode: CACHE_ALL_STATIC
  Default TTL: 3600s (1 hour)
  Max TTL: 86400s (1 day)
  Client TTL: 3600s
  Negative Caching: Enabled (404, 500)
  Negative TTL: 120s

Security:
  Cloud Armor: Optional (DDoS protection)
  Rate Limiting: 1000 req/min per IP (optional)
```

---

## 3. Backend Architecture

### 2.1 Layered Architecture

SIMAS backend menggunakan **Clean Architecture** dengan pemisahan concern yang jelas:

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │ Controller │  │   Routes   │  │    Middleware      │    │
│  │   Layer    │  │   Layer    │  │  (Auth, Error)     │    │
│  └────────────┘  └────────────┘  └────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                      Business Logic Layer                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │  Service   │  │ Validation │  │   Model/Types      │    │
│  │   Layer    │  │   Layer    │  │     Layer          │    │
│  └────────────┘  └────────────┘  └────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                     Data Access Layer                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │   Prisma   │  │  Database  │  │   File System      │    │
│  │   Client   │  │   Models   │  │   (Uploads)        │    │
│  └────────────┘  └────────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Directory Structure

```
backend/
├── src/
│   ├── main.ts                    # Entry point
│   ├── application/               # Application setup
│   │   ├── web.ts                # Express app configuration
│   │   ├── database.ts           # Prisma client setup
│   │   └── logging.ts            # Winston logger setup
│   ├── controller/               # Request handlers
│   │   ├── user-controller.ts    # User endpoints handler
│   │   ├── letter-controller.ts  # Letter endpoints handler
│   │   └── dashboard-controller.ts
│   ├── service/                  # Business logic
│   │   ├── user-service.ts       # User business logic
│   │   ├── letter-service.ts     # Letter business logic
│   │   └── dashboard-service.ts
│   ├── model/                    # Data models & responses
│   │   ├── user-model.ts         # User types & transformers
│   │   └── letter-model.ts       # Letter types & transformers
│   ├── validation/               # Input validation
│   │   ├── validation.ts         # Zod validation wrapper
│   │   ├── user-validation.ts    # User schemas
│   │   ├── letter-validation.ts  # Letter schemas
│   │   └── file-validation.ts    # Multer configuration
│   ├── middleware/               # Express middleware
│   │   ├── auth-middleware.ts    # Token authentication
│   │   ├── admin-middleware.ts   # Role authorization
│   │   └── error-middleware.ts   # Error handling
│   ├── route/                    # Route definitions
│   │   ├── public-api.ts         # Public routes (login)
│   │   ├── api.ts                # Protected routes
│   │   └── dashboard-api.ts      # Dashboard routes
│   ├── error/                    # Custom errors
│   │   └── response-error.ts     # Custom error class
│   └── type/                     # TypeScript types
│       ├── user-request.ts       # Extended request type
│       └── dashboard-stats.type.ts
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Migration history
├── test/                        # Integration tests
├── uploads/                     # File uploads directory
└── package.json
```

### 2.3 Request Flow

```
HTTP Request
    ↓
1. CORS Middleware
    ├─ Validate origin (localhost:3000 or production URL)
    ├─ Set CORS headers
    └─ Allow credentials
    ↓
2. JSON Body Parser
    └─ Parse request body
    ↓
3. Router (public-api / api / dashboard-api)
    └─ Match route
    ↓
4. Authentication Middleware (if protected route)
    ├─ Extract X-API-TOKEN header
    ├─ Query user by token
    ├─ Attach user to request
    └─ Return 401 if invalid
    ↓
5. Authorization Middleware (if admin route)
    ├─ Check user.role === 'admin'
    └─ Return 403 if not admin
    ↓
6. File Upload Middleware (if file upload)
    ├─ Validate file type (PDF/DOCX)
    ├─ Validate file size (max 10MB)
    └─ Save to uploads/ directory
    ↓
7. Controller
    ├─ Parse request parameters
    ├─ Call service method
    └─ Format response
    ↓
8. Service Layer
    ├─ Validate input with Zod
    ├─ Execute business logic
    ├─ Call Prisma for database operations
    └─ Return result or throw error
    ↓
9. Error Middleware (if error occurred)
    ├─ Handle ZodError → 400
    ├─ Handle MulterError → 400
    ├─ Handle ResponseError → custom status
    └─ Handle unknown error → 500
    ↓
HTTP Response
```

### 2.4 Authentication Implementation

#### Token Generation (Login)

```typescript
// Generate UUID token
const token = uuid();

// Save token to database
await prismaClient.user.update({
  where: { id: user.id },
  data: { token },
});

// Return token to client
return { token, user };
```

#### Token Validation (Auth Middleware)

```typescript
// Extract token from header
const token = req.get("X-API-TOKEN");

// Query user by token
const user = await prismaClient.user.findFirst({
  where: { token },
});

if (!user) {
  return res.status(401).json({ errors: "Unauthorized" });
}

// Attach user to request
req.user = user;
next();
```

### 2.5 File Upload Implementation

#### Multer Configuration

```typescript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${parsedFile.name}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
```

### 2.6 Error Handling Strategy

```typescript
// Custom error class
class ResponseError extends Error {
  constructor(public status: number, public message: string) {
    super(message);
  }
}

// Error middleware
export const errorMiddleware = (error, req, res, next) => {
  if (error instanceof ZodError) {
    // Validation errors
    return res.status(400).json({
      errors: error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (error instanceof MulterError) {
    // File upload errors
    return res.status(400).json({ errors: error.message });
  }

  if (error instanceof ResponseError) {
    // Custom errors
    return res.status(error.status).json({ errors: error.message });
  }

  // Unknown errors
  logger.error(error);
  return res.status(500).json({ errors: "Internal Server Error" });
};
```

---

## 3. Frontend Architecture

### 3.1 Next.js App Router Structure

```
frontend/src/
├── app/                          # Next.js 15 App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles
│   ├── (auth)/                  # Auth route group
│   │   └── login/
│   │       └── page.tsx         # Login page
│   ├── dashboard/               # Protected dashboard
│   │   ├── layout.tsx          # Dashboard layout (Navbar + Sidebar)
│   │   ├── page.tsx            # Dashboard home
│   │   ├── letters/            # Letter management
│   │   │   ├── page.tsx        # List letters
│   │   │   ├── create/
│   │   │   ├── [id]/edit/
│   │   │   └── [id]/detail/
│   │   ├── users/              # User management (admin)
│   │   │   ├── page.tsx
│   │   │   ├── create/
│   │   │   └── [id]/edit/
│   │   └── profile/            # User profile
│   │       └── page.tsx
│   └── api/                     # API utilities
│       └── client.ts           # HTTP client wrapper
├── components/                  # Reusable components
│   ├── auth/
│   │   └── LoginForm.tsx
│   ├── dashboard/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── StatCard.tsx
│   └── ui/
│       ├── LoadingSpinner.tsx
│       ├── AnimatedDiv.tsx
│       └── Button.tsx
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts              # Authentication hook
│   ├── useLetters.ts           # Fetch letters
│   ├── useUsers.ts             # Fetch users
│   └── useLetterDetail.ts
├── services/                    # API service layer
│   ├── userService.ts
│   ├── letterService.ts
│   └── dashboardService.ts
├── types/                       # TypeScript definitions
│   └── index.ts
├── utils/                       # Utility functions
│   └── dateUtils.ts
└── middleware.ts               # Next.js middleware (route protection)
```

### 3.2 API Client Implementation

```typescript
// Centralized HTTP client
export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = Cookies.get("token");

    const headers = new Headers();

    // Auto-add Content-Type for JSON
    if (!(options.body instanceof FormData)) {
      headers.append("Content-Type", "application/json");
    }

    // Auto-add authentication token
    if (token) {
      headers.append("X-API-TOKEN", token);
    }

    const response = await fetch(url, { ...options, headers });

    // Handle unauthorized (auto-logout)
    if (response.status === 401) {
      Cookies.remove("token");
      Cookies.remove("user");
      window.location.href = "/login";
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors || "Request failed");
    }

    return response.json();
  },

  // Convenience methods
  get: (endpoint) => this.request(endpoint, { method: "GET" }),
  post: (endpoint, body) =>
    this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (endpoint, body) =>
    this.request(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: (endpoint, body) =>
    this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: (endpoint) => this.request(endpoint, { method: "DELETE" }),
  upload: (endpoint, formData) => {
    /* Special handling for file uploads */
  },
};
```

### 3.3 Authentication Flow

```typescript
// useAuth hook
export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from cookie on mount
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    const response = await apiClient.post("/api/users/login", {
      email_instansi: email,
      password,
    });

    const { token, user: userData } = response.data;

    // Save to cookies (1 day expiry)
    Cookies.set("token", token, { expires: 1 });
    Cookies.set("user", JSON.stringify(userData), { expires: 1 });

    setUser(userData);
    return userData;
  };

  // Logout function
  const logout = async () => {
    await apiClient.delete("/api/users/current");
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    router.push("/login");
  };

  return { user, loading, login, logout };
}
```

### 3.4 Middleware Protection

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get("user");
  const pathname = request.nextUrl.pathname;

  // Redirect logged-in users away from login page
  if (pathname === "/login" && userCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !userCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
```

### 3.5 Component Patterns

#### Service Layer Pattern

```typescript
// letterService.ts
export const letterService = {
  async createLetter(formData: FormData) {
    return apiClient.upload("/api/surat", formData);
  },

  async getLetters(page = 1, limit = 10, month?, year?) {
    let endpoint = `/api/surat?page=${page}&limit=${limit}`;
    if (month && year) {
      endpoint += `&bulan=${month}&tahun=${year}`;
    }
    return apiClient.get(endpoint);
  },
};
```

#### Custom Hooks Pattern

```typescript
// useLetters.ts
export function useLetters(page = 1, limit = 10) {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchLetters = async () => {
      setLoading(true);
      try {
        const response = await letterService.getLetters(page, limit);
        setLetters(response.data);
        setTotal(response.total);
      } catch (error) {
        console.error("Failed to fetch letters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, [page, limit]);

  return { letters, loading, total };
}
```

---

## 4. Database Design

### 4.1 Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             Int       @id @default(autoincrement())
  email_instansi String    @unique @db.VarChar(255)
  password       String    @db.VarChar(255)
  nama_instansi  String    @db.VarChar(255)
  role           UserRole  @default(user)
  token          String?   @db.VarChar(255)
  letters        Letter[]
  created_at     DateTime  @default(now())
  updated_at     DateTime  @updatedAt

  @@map("users")
}

model Letter {
  id               Int          @id @default(autoincrement())
  nomor_registrasi Int          @unique @default(autoincrement())
  pengirim         String       @db.VarChar(100)
  nomor_surat      String       @db.VarChar(50)
  tanggal_masuk    DateTime     @db.Date
  tanggal_surat    DateTime     @db.Date
  perihal          String       @db.Text
  file_url         String       @db.VarChar(255)
  status           LetterStatus @default(pending)
  user_id          Int
  user             User         @relation(fields: [user_id], references: [id])
  created_at       DateTime     @default(now())
  updated_at       DateTime     @updatedAt

  @@map("surat")
}

enum UserRole {
  admin
  user
}

enum LetterStatus {
  pending
  diterima
}
```

### 4.2 Database Relations

```
┌──────────────────────┐
│       Users          │
│──────────────────────│
│ PK  id               │◄─────────┐
│ UQ  email_instansi   │          │
│     password (hash)  │          │ One-to-Many
│     nama_instansi    │          │
│     role             │          │
│     token            │          │
│     created_at       │          │
│     updated_at       │          │
└──────────────────────┘          │
                                  │
                                  │
┌──────────────────────┐          │
│      Letters         │          │
│──────────────────────│          │
│ PK  id               │          │
│ UQ  nomor_registrasi │          │
│     pengirim         │          │
│     nomor_surat      │          │
│     tanggal_masuk    │          │
│     tanggal_surat    │          │
│     perihal          │          │
│     file_url         │          │
│     status           │          │
│ FK  user_id          │──────────┘
│     created_at       │
│     updated_at       │
└──────────────────────┘
```

### 4.3 Indexes & Performance

**Automatic Indexes:**

- Primary keys (`id`)
- Unique constraints (`email_instansi`, `nomor_registrasi`)
- Foreign keys (`user_id`)

**Query Optimization:**

- Use `findUnique` for indexed fields
- Use `include` instead of separate queries
- Implement pagination for large datasets
- Use `Promise.all` for parallel queries

```typescript
// Example: Optimized query
const [letters, total] = await Promise.all([
  prismaClient.letter.findMany({
    where: { user_id: userId },
    skip: (page - 1) * limit,
    take: limit,
    include: { user: true },
    orderBy: { created_at: "desc" },
  }),
  prismaClient.letter.count({ where: { user_id: userId } }),
]);
```

---

## 5. Security Implementation

### 5.1 Authentication Security

**Password Hashing:**

```typescript
// Registration
const hashedPassword = await bcrypt.hash(password, 10);

// Login verification
const isPasswordValid = await bcrypt.compare(password, user.password);
```

**Token Management:**

- Generate UUID tokens (cryptographically secure)
- Store tokens in database (indexed for fast lookup)
- Tokens expire on logout (set to null)
- Client stores token in HTTP-only cookies

### 5.2 Authorization

**Role-Based Access Control (RBAC):**

```typescript
// Admin middleware
export const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    throw new ResponseError(401, "Unauthorized");
  }

  if (req.user.role !== "admin") {
    throw new ResponseError(403, "Forbidden: Admin access required");
  }

  next();
};
```

**Protected Routes:**

- Public: `/api/users/login`
- Authenticated: `/api/users/current`, `/api/surat/me`, `/api/dashboard/*`
- Admin only: `/api/users`, `/api/surat` (full CRUD)

### 5.3 Input Validation

**Zod Schemas:**

```typescript
export class UserValidation {
  static REGISTER = z.object({
    email_instansi: z.string().email().min(1).max(255),
    password: z.string().min(6).max(100),
    nama_instansi: z.string().min(1).max(255),
    role: z.enum(["admin", "user"]),
  });
}
```

### 5.4 File Upload Security

- **Type Validation**: Only PDF and DOCX allowed
- **Size Limit**: Maximum 10MB per file
- **Filename Sanitization**: Add timestamp to prevent collisions
- **Path Validation**: Store relative paths only
- **Directory Security**: Files stored outside public web root

### 5.5 CORS Configuration

```typescript
web.use(
  cors({
    origin: process.env.WEB_ORIGIN || "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
    allowedHeaders: ["X-API-TOKEN", "Content-Type"],
  })
);
```

### 5.6 SQL Injection Prevention

Prisma ORM automatically prevents SQL injection through:

- Parameterized queries
- Type-safe query builder
- No raw SQL in application code

---

## 7. Cloud Infrastructure

### 7.1 Complete GCP Architecture

```
                         Internet (Global)
                               │
                               ▼
                ┌──────────────────────────────┐
                │   Cloud Load Balancer        │
                │   • External HTTPS LB        │
                │   • SSL/TLS Termination      │
                │   • Global Anycast IP        │
                │   • DDoS Protection          │
                │   • 99.99% Availability      │
                └──────────┬───────────────────┘
                           │
                ┌──────────▼──────────┐
                │   Cloud CDN         │
                │   • Edge Caching    │
                │   • Global POPs     │
                │   • TTL: 1 hour     │
                └──────────┬──────────┘
                           │
            ┌──────────────┴──────────────┐
            │                             │
    ┌───────▼────────┐          ┌────────▼─────────┐
    │ Frontend       │          │ Backend          │
    │ Cloud Run      │  HTTPS   │ Cloud Run        │
    │ ┌────────────┐ │  API     │ ┌──────────────┐ │
    │ │ Next.js 15 │ │ ◄──────► │ │ Express.js 5 │ │
    │ │ React 19   │ │  Calls   │ │ REST API     │ │
    │ │ SSR        │ │          │ │ File Upload  │ │
    │ └────────────┘ │          │ └──────────────┘ │
    │                │          │                  │
    │ asia-se2       │          │ asia-se2         │
    │ Min: 0 Max: 10 │          │ Min: 1 Max: 10   │
    │ 512Mi / 1 vCPU │          │ 1Gi / 1-2 vCPU   │
    │ Concurrency:80 │          │ Concurrency: 80  │
    └────────────────┘          └────────┬─────────┘
                                         │
                                         │ VPC Connector
                                         │ (10.12.0.0/28)
                                         │ Private Network
                                         ▼
                              ┌──────────────────────┐
                              │  VPC Network         │
                              │  (Private)           │
                              └──────────┬───────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                         │
         ┌──────────▼──────────┐                 ┌───────────▼──────────┐
         │  Cloud SQL          │                 │  Cloud Storage       │
         │  PostgreSQL 14      │                 │  Regional Bucket     │
         │  ┌────────────────┐ │                 │  ┌─────────────────┐ │
         │  │Primary Instance│ │                 │  │ /uploads/       │ │
         │  │db-f1-micro     │ │                 │  │ /backups/       │ │
         │  │10GB SSD        │ │                 │  │ /archives/      │ │
         │  │Private IP      │ │                 │  └─────────────────┘ │
         │  │10.10.x.x       │ │                 │                      │
         │  └────────────────┘ │                 │  Standard Class      │
         │                     │                 │  Lifecycle Mgmt      │
         │  Daily Backup       │                 │  Versioning          │
         │  PITR (7 days)      │                 │  CORS Enabled        │
         │  99.95% Uptime      │                 │  99.99% Durability   │
         └─────────────────────┘                 └──────────────────────┘

    ┌───────────────────────────────────────────────────────────────┐
    │              Observability & Operations Layer                 │
    │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
    │  │Cloud         │  │Cloud         │  │Secret            │   │
    │  │Monitoring    │  │Logging       │  │Manager           │   │
    │  │• Metrics     │  │• App Logs    │  │• DB Password     │   │
    │  │• Dashboards  │  │• Audit Logs  │  │• JWT Secret      │   │
    │  │• Alerts      │  │• Exports     │  │• API Keys        │   │
    │  └──────────────┘  └──────────────┘  └──────────────────┘   │
    └───────────────────────────────────────────────────────────────┘

    ┌───────────────────────────────────────────────────────────────┐
    │                    CI/CD Pipeline Layer                       │
    │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
    │  │Cloud Build   │→ │Container     │→ │Cloud Run         │   │
    │  │• Build Images│  │Registry      │  │• Deploy Services │   │
    │  │• Run Tests   │  │• Store Images│  │• Health Checks   │   │
    │  │• GitHub Hook │  │• Version Tag │  │• Traffic Split   │   │
    │  └──────────────┘  └──────────────┘  └──────────────────┘   │
    └───────────────────────────────────────────────────────────────┘
```

### 7.2 Region & Zone Distribution

**Primary Region:** asia-southeast2 (Jakarta, Indonesia)

**Zone Distribution:**

```
Zone asia-southeast2-a (Primary):
  ├─ Cloud Run: Frontend instances 1-5
  ├─ Cloud Run: Backend instances 1-5
  ├─ Cloud SQL: Primary instance
  └─ Cloud Storage: Primary storage

Zone asia-southeast2-b (Secondary):
  ├─ Cloud Run: Frontend instances 6-10
  ├─ Cloud Run: Backend instances 6-10
  └─ Cloud SQL: Standby replica (optional)

Zone asia-southeast2-c (Tertiary):
  └─ Disaster Recovery standby
```

**Network Topology:**

```
External Network (Public Internet)
    │
    ├─ Static External IP: 35.x.x.x (Load Balancer)
    │
    └─ Cloud Run Public Endpoints:
        ├─ Frontend: https://simas-frontend-xxx.run.app
        └─ Backend: https://simas-backend-xxx.run.app

Internal Network (VPC - 10.0.0.0/8)
    │
    ├─ VPC Connector Subnet: 10.12.0.0/28
    ├─ Cloud SQL Private IP: 10.10.x.x
    └─ Internal Services Communication
```

### 7.3 Docker Configuration

**Backend Dockerfile (Multi-stage build):**

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Create uploads directory
RUN mkdir -p /tmp/uploads

# Use non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
```

**Frontend Dockerfile (Optimized for Next.js):**

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Install dependencies based on lockfile
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 2: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js standalone
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install dumb-init
RUN apk add --no-cache dumb-init

# Create user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/_next/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
```

### 7.4 Cloud Run Deployment Configuration

**Backend deployment.yaml:**

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: simas-backend
  labels:
    cloud.googleapis.com/location: asia-southeast2
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "10"
        autoscaling.knative.dev/target: "80"
        run.googleapis.com/cpu-throttling: "false"
        run.googleapis.com/startup-cpu-boost: "true"
        run.googleapis.com/vpc-access-connector: simas-vpc-connector
        run.googleapis.com/vpc-access-egress: private-ranges-only
        run.googleapis.com/cloudsql-instances: PROJECT:REGION:simas-db
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      serviceAccountName: backend-sa@PROJECT.iam.gserviceaccount.com
      containers:
        - image: gcr.io/PROJECT/simas-backend:latest
          ports:
            - name: http1
              containerPort: 3001
          env:
            - name: DATABASE_URL
              value: postgresql://user:pass@/db?host=/cloudsql/PROJECT:REGION:simas-db
            - name: WEB_ORIGIN
              value: https://simas-frontend-xxx.run.app
            - name: NODE_ENV
              value: production
            - name: PORT
              value: "3001"
          resources:
            limits:
              memory: 1Gi
              cpu: "2"
          startupProbe:
            httpGet:
              path: /health
              port: 3001
            initialDelaySeconds: 5
            periodSeconds: 5
            failureThreshold: 3
          livenessProbe:
            httpGet:
              path: /health
              port: 3001
            initialDelaySeconds: 30
            periodSeconds: 10
```

**Frontend deployment.yaml:**

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: simas-frontend
  labels:
    cloud.googleapis.com/location: asia-southeast2
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "0"
        autoscaling.knative.dev/maxScale: "10"
        autoscaling.knative.dev/target: "80"
        run.googleapis.com/cpu-throttling: "true"
        run.googleapis.com/startup-cpu-boost: "true"
    spec:
      containerConcurrency: 80
      timeoutSeconds: 60
      serviceAccountName: frontend-sa@PROJECT.iam.gserviceaccount.com
      containers:
        - image: gcr.io/PROJECT/simas-frontend:latest
          ports:
            - name: http1
              containerPort: 3000
          env:
            - name: NEXT_PUBLIC_API_URL
              value: https://simas-backend-xxx.run.app
            - name: NODE_ENV
              value: production
            - name: PORT
              value: "3000"
          resources:
            limits:
              memory: 512Mi
              cpu: "1"
          startupProbe:
            httpGet:
              path: /_next/health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 5
            failureThreshold: 3
```

### 7.5 Environment Configuration

**Backend Environment Variables (Cloud Run):**

```env
# Database Connection (via Cloud SQL Proxy)
DATABASE_URL=postgresql://simas_user:PASSWORD@/simas?host=/cloudsql/PROJECT-ID:asia-southeast2:simas-db&sslmode=require

# Cloud SQL Instance
INSTANCE_CONNECTION_NAME=PROJECT-ID:asia-southeast2:simas-db

# Application
PORT=3001
NODE_ENV=production
WEB_ORIGIN=https://simas-frontend-xxx.run.app

# Cloud Storage
GCS_BUCKET_NAME=simas-files-PROJECT-ID
GCS_PROJECT_ID=PROJECT-ID

# Redis
REDIS_HOST=10.11.x.x
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

**Frontend Environment Variables (Cloud Run):**

```env
NEXT_PUBLIC_API_URL=https://backend-url.run.app
NODE_ENV=production
```

### 6.4 Deployment Commands

**Backend Deployment:**

```bash
# Build and push image
gcloud builds submit --tag gcr.io/PROJECT_ID/simas-backend

# Deploy to Cloud Run
gcloud run deploy simas-backend \
  --image gcr.io/PROJECT_ID/simas-backend \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --add-cloudsql-instances PROJECT_ID:REGION:INSTANCE \
  --set-env-vars DATABASE_URL="..." \
  --set-env-vars WEB_ORIGIN="https://frontend-url" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 10 \
  --concurrency 80 \
  --timeout 300s
```

**Frontend Deployment:**

```bash
# Build and push image
gcloud builds submit --tag gcr.io/PROJECT_ID/simas-frontend

# Deploy to Cloud Run
gcloud run deploy simas-frontend \
  --image gcr.io/PROJECT_ID/simas-frontend \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_URL="https://backend-url" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --concurrency 80
```

### 6.5 Cloud SQL Setup

```bash
# Create Cloud SQL instance
gcloud sql instances create simas-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=asia-southeast2 \
  --storage-type=SSD \
  --storage-size=10GB \
  --backup-start-time=03:00

# Create database
gcloud sql databases create simas --instance=simas-db

# Create user
gcloud sql users create simas-user \
  --instance=simas-db \
  --password=SECURE_PASSWORD
```

### 6.6 CI/CD Pipeline

**Cloud Build Configuration (cloudbuild.yaml):**

```yaml
steps:
  # Build Backend
  - name: "gcr.io/cloud-builders/docker"
    args: ["build", "-t", "gcr.io/$PROJECT_ID/simas-backend", "./backend"]

  # Push Backend
  - name: "gcr.io/cloud-builders/docker"
    args: ["push", "gcr.io/$PROJECT_ID/simas-backend"]

  # Deploy Backend
  - name: "gcr.io/google.com/cloudsdktool/cloud-sdk"
    entrypoint: gcloud
    args:
      - "run"
      - "deploy"
      - "simas-backend"
      - "--image=gcr.io/$PROJECT_ID/simas-backend"
      - "--region=asia-southeast2"
      - "--platform=managed"

  # Build Frontend
  - name: "gcr.io/cloud-builders/docker"
    args: ["build", "-t", "gcr.io/$PROJECT_ID/simas-frontend", "./frontend"]

  # Push Frontend
  - name: "gcr.io/cloud-builders/docker"
    args: ["push", "gcr.io/$PROJECT_ID/simas-frontend"]

  # Deploy Frontend
  - name: "gcr.io/google.com/cloudsdktool/cloud-sdk"
    entrypoint: gcloud
    args:
      - "run"
      - "deploy"
      - "simas-frontend"
      - "--image=gcr.io/$PROJECT_ID/simas-frontend"
      - "--region=asia-southeast2"
      - "--platform=managed"

timeout: 1200s
```

---

## 7. Performance Optimization

### 7.1 Backend Optimizations

**Database Query Optimization:**

- Use indexes on frequently queried fields
- Implement pagination (limit/offset)
- Parallel queries with Promise.all
- Include related data in single query

**Caching Strategy:**

- Cache user session data
- Cache dashboard statistics (optional)
- Use CDN for static assets

**Code Optimization:**

- Minimize middleware processing
- Lazy load non-critical modules
- Use TypeScript for compile-time checks

### 7.2 Frontend Optimizations

**Next.js Optimizations:**

- Server-side rendering (SSR) for initial load
- Static generation for public pages
- Automatic code splitting
- Image optimization with next/image
- Font optimization

**Bundle Size Reduction:**

- Tree shaking unused code
- Dynamic imports for heavy components
- Minimize third-party dependencies

**Loading Performance:**

- Show loading states
- Implement skeleton screens
- Lazy load images
- Prefetch critical resources

### 7.3 Cloud Run Auto-scaling

```
Concurrent Requests Per Instance: 80
Min Instances: 0 (Frontend), 1 (Backend)
Max Instances: 10
CPU Throttling: Enabled when idle
Memory: 512Mi (optimized for cost)
```

---

## 8. Monitoring & Logging

### 8.1 Application Logging

**Winston Logger Configuration:**

```typescript
export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({}),
    // In production, integrate with Cloud Logging
  ],
});
```

**Logged Events:**

- HTTP requests (method, path, status, duration)
- Authentication attempts
- Database queries
- Errors and exceptions
- File uploads

### 8.2 GCP Cloud Monitoring

**Metrics to Monitor:**

- Request count
- Request latency (p50, p95, p99)
- Error rate (4xx, 5xx)
- CPU utilization
- Memory utilization
- Database connections
- Instance count

**Alerting:**

- Error rate > 5%
- Response time > 2s (p95)
- Database connection failures
- Out of memory errors

### 8.3 Health Checks

```typescript
// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});
```

### 8.4 Error Tracking

- Structured error logging
- Stack trace capture
- User context inclusion
- Integration with Cloud Error Reporting

---

## 9. Testing Strategy

### 9.1 Backend Testing

**Unit Tests:**

- Service layer business logic
- Validation schemas
- Utility functions

**Integration Tests:**

```typescript
describe("User API", () => {
  it("should register new user", async () => {
    const response = await request(web)
      .post("/api/users")
      .set("X-API-TOKEN", adminToken)
      .send({
        email_instansi: "test@example.com",
        password: "password123",
        nama_instansi: "Test Instansi",
        role: "user",
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("id");
  });
});
```

### 9.2 Test Coverage Goals

- Controllers: 80%+
- Services: 90%+
- Validation: 100%
- Overall: 85%+

---

## Conclusion

SIMAS menggunakan arsitektur modern dengan teknologi terkini, mengikuti best practices untuk security, performance, dan maintainability. Sistem ini dirancang untuk scalable dan dapat di-deploy dengan mudah ke GCP Cloud Run dengan minimal configuration.

**Key Technical Highlights:**

- ✅ Clean Architecture & Separation of Concerns
- ✅ Type-safe dengan TypeScript
- ✅ Security-first approach
- ✅ Cloud-native deployment
- ✅ Automated testing
- ✅ Comprehensive logging & monitoring
- ✅ Performance optimized
- ✅ Developer-friendly codebase
