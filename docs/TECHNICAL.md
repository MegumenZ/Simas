# SIMAS - Technical Documentation

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Database Design](#database-design)
5. [Security Implementation](#security-implementation)
6. [Infrastructure & Deployment](#infrastructure--deployment)
7. [Performance Optimization](#performance-optimization)
8. [Monitoring & Logging](#monitoring--logging)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Internet Users                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   GCP Cloud Load Balancer                        │
│                    (HTTPS/SSL Termination)                       │
└────────────┬───────────────────────────────────┬────────────────┘
             │                                   │
             ▼                                   ▼
┌──────────────────────────┐        ┌──────────────────────────┐
│  Frontend Cloud Run      │        │  Backend Cloud Run       │
│  (Next.js 15)            │◄──────►│  (Express.js)            │
│  - SSR/Static Pages      │  API   │  - REST API              │
│  - Client Components     │  Calls │  - File Upload           │
│  - Authentication UI     │        │  - Business Logic        │
└──────────────────────────┘        └───────────┬──────────────┘
                                                 │
                                                 ▼
                                    ┌──────────────────────────┐
                                    │  Cloud SQL (PostgreSQL)  │
                                    │  - Users Table           │
                                    │  - Letters Table         │
                                    │  - Automated Backups     │
                                    └──────────────────────────┘
                                                 │
                                                 ▼
                                    ┌──────────────────────────┐
                                    │   Cloud Storage          │
                                    │   (File Storage)         │
                                    │   - PDF/DOCX Files       │
                                    └──────────────────────────┘
```

### 1.2 Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend Framework | Next.js | 15.3.3 | SSR, Routing, Optimization |
| UI Library | React | 19.0.0 | Component-based UI |
| Styling | Tailwind CSS | 4.x | Utility-first styling |
| Animation | Framer Motion | 12.18.1 | UI animations |
| Backend Framework | Express.js | 5.1.0 | REST API server |
| Runtime | Node.js | 18+ | JavaScript runtime |
| Database | PostgreSQL | 14+ | Relational database |
| ORM | Prisma | 6.9.0 | Type-safe database access |
| Authentication | UUID Tokens | - | Session management |
| Validation | Zod | 3.25.64 | Schema validation |
| File Upload | Multer | 2.0.1 | Multipart form handling |
| Logging | Winston | 3.17.0 | Application logging |
| Testing | Jest | 30.0.0 | Unit & integration tests |

---

## 2. Backend Architecture

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
  data: { token }
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
  where: { token }
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
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
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
      errors: error.errors.map(e => ({
        path: e.path.join("."),
        message: e.message
      }))
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
  post: (endpoint, body) => this.request(endpoint, { 
    method: "POST", 
    body: JSON.stringify(body) 
  }),
  put: (endpoint, body) => this.request(endpoint, { 
    method: "PUT", 
    body: body instanceof FormData ? body : JSON.stringify(body)
  }),
  patch: (endpoint, body) => this.request(endpoint, { 
    method: "PATCH", 
    body: JSON.stringify(body) 
  }),
  delete: (endpoint) => this.request(endpoint, { method: "DELETE" }),
  upload: (endpoint, formData) => { /* Special handling for file uploads */ }
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
      password
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
  matcher: ["/login", "/dashboard/:path*"]
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
  }
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
    orderBy: { created_at: "desc" }
  }),
  prismaClient.letter.count({ where: { user_id: userId } })
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
    role: z.enum(["admin", "user"])
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
web.use(cors({
  origin: process.env.WEB_ORIGIN || "http://localhost:3000",
  credentials: true,
  exposedHeaders: ["Content-Disposition"],
  allowedHeaders: ["X-API-TOKEN", "Content-Type"]
}));
```

### 5.6 SQL Injection Prevention

Prisma ORM automatically prevents SQL injection through:
- Parameterized queries
- Type-safe query builder
- No raw SQL in application code

---

## 6. Infrastructure & Deployment

### 6.1 GCP Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      Cloud Load Balancer                    │
│                    (SSL/TLS Termination)                    │
└──────────────┬─────────────────────────┬───────────────────┘
               │                         │
               ▼                         ▼
┌──────────────────────┐      ┌──────────────────────┐
│ Frontend Cloud Run   │      │ Backend Cloud Run    │
│ Region: asia-se2     │      │ Region: asia-se2     │
│ Memory: 512Mi        │      │ Memory: 512Mi        │
│ CPU: 1               │      │ CPU: 1               │
│ Min: 0               │      │ Min: 1               │
│ Max: 10              │      │ Max: 10              │
│ Concurrency: 80      │      │ Concurrency: 80      │
└──────────────────────┘      └────────┬─────────────┘
                                       │
                                       │ Cloud SQL Connector
                                       ▼
                              ┌──────────────────────┐
                              │  Cloud SQL (PostgreSQL)
                              │  Instance: db-f1-micro
                              │  Region: asia-se2     │
                              │  Storage: 10GB SSD    │
                              │  Backup: Automated    │
                              └──────────────────────┘
                                       │
                                       ▼
                              ┌──────────────────────┐
                              │  Cloud Storage       │
                              │  Bucket: simas-files │
                              │  Region: asia-se2    │
                              │  Storage Class: Std  │
                              └──────────────────────┘
```

### 6.2 Docker Configuration

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

### 6.3 Environment Configuration

**Backend Environment Variables:**
```env
# Database
DATABASE_URL=postgresql://user:pass@/dbname?host=/cloudsql/project:region:instance
INSTANCE_CONNECTION_NAME=project:region:instance

# Server
PORT=3001
WEB_ORIGIN=https://frontend-url.run.app

# Node
NODE_ENV=production
```

**Frontend Environment Variables:**
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
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/simas-backend', './backend']
  
  # Push Backend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/simas-backend']
  
  # Deploy Backend
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'simas-backend'
      - '--image=gcr.io/$PROJECT_ID/simas-backend'
      - '--region=asia-southeast2'
      - '--platform=managed'
  
  # Build Frontend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/simas-frontend', './frontend']
  
  # Push Frontend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/simas-frontend']
  
  # Deploy Frontend
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'simas-frontend'
      - '--image=gcr.io/$PROJECT_ID/simas-frontend'
      - '--region=asia-southeast2'
      - '--platform=managed'

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
  ]
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
        role: "user"
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
