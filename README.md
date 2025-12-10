# SIMAS - Sistem Manajemen Surat

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

Sistem Manajemen Surat dan Dokumen Instansi berbasis web yang memungkinkan pengelolaan surat masuk secara digital, dilengkapi dengan role-based access control dan dashboard monitoring.

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/MegumenZ/Simas.git
cd Simas

# Setup Backend
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

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

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

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1
- **Database**: PostgreSQL
- **ORM**: Prisma 6.9
- **Authentication**: Token-based (UUID)
- **Validation**: Zod
- **File Upload**: Multer
- **Logging**: Winston
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **HTTP Client**: Fetch API
- **State Management**: React Hooks
- **PDF Generation**: jsPDF + jsPDF-autotable
- **Date Handling**: date-fns

### Infrastructure (GCP)
- **Compute**: Cloud Run (Frontend & Backend)
- **Database**: Cloud SQL (PostgreSQL)
- **Storage**: Cloud Storage (File uploads)
- **Networking**: Cloud Load Balancer
- **Monitoring**: Cloud Monitoring & Logging

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Frontend (Next.js on Cloud Run)                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Pages     │  │  Components  │  │   Services   │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────┬────────────────────────────────────┘
                         │ API Calls (X-API-TOKEN)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│             Backend (Express.js on Cloud Run)                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Middleware Layer                        │    │
│  │  CORS → JSON Parser → Auth → Admin → Error         │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Controllers │→ │   Services   │→ │   Prisma     │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 Cloud SQL (PostgreSQL)                       │
│              Users Table │ Letters Table                     │
└─────────────────────────────────────────────────────────────┘
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

## 🚀 Deployment

### Cloud Run Deployment (GCP)

#### Backend Deployment
```bash
cd backend

# Build Docker image
gcloud builds submit --tag gcr.io/PROJECT_ID/simas-backend

# Deploy to Cloud Run
gcloud run deploy simas-backend \
  --image gcr.io/PROJECT_ID/simas-backend \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --add-cloudsql-instances PROJECT_ID:REGION:INSTANCE_NAME \
  --set-env-vars DATABASE_URL="postgresql://..." \
  --memory 512Mi \
  --cpu 1
```

#### Frontend Deployment
```bash
cd frontend

# Build Docker image
gcloud builds submit --tag gcr.io/PROJECT_ID/simas-frontend

# Deploy to Cloud Run
gcloud run deploy simas-frontend \
  --image gcr.io/PROJECT_ID/simas-frontend \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_URL="https://backend-url" \
  --memory 512Mi \
  --cpu 1
```

## 📚 Documentation

Dokumentasi lengkap tersedia di folder `docs/`:

- **[Technical Documentation](./docs/TECHNICAL.md)** - Arsitektur sistem dan implementasi teknis
- **[API Documentation](./docs/API.md)** - Dokumentasi lengkap REST API endpoints
- **[OpenAPI Specification](./docs/openapi.yaml)** - OpenAPI 3.0 spec untuk Swagger/Postman
- **[Swagger UI](./docs/swagger.html)** - Interactive API documentation (buka dengan HTTP server)
- **[User Manual](./docs/USER_MANUAL.md)** - Panduan penggunaan untuk end-user
- **[Cost Analysis](./docs/COST_ANALYSIS.md)** - Analisis biaya deployment GCP

### 🔥 Quick API Documentation Access

```bash
# Buka Swagger UI (Interactive API Docs)
cd docs
python -m http.server 8080
# Kemudian buka http://localhost:8080/swagger.html di browser
```

Atau gunakan Postman/Insomnia dengan import file `docs/openapi.yaml`

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

Test coverage includes:
- User authentication & authorization
- Letter CRUD operations
- Dashboard statistics
- File upload/download

### Frontend Tests
```bash
cd frontend
npm test
```

## 📄 License

This project is licensed under the ISC License.
