# SIMAS - API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL](#base-url)
4. [Error Handling](#error-handling)
5. [Public Endpoints](#public-endpoints)
6. [User Endpoints](#user-endpoints)
7. [Letter Endpoints](#letter-endpoints)
8. [Dashboard Endpoints](#dashboard-endpoints)

---

## Overview

SIMAS API adalah RESTful API yang digunakan untuk mengelola sistem manajemen surat. API ini menggunakan JSON untuk request dan response body, serta token-based authentication untuk secured endpoints.

### API Specifications
- **Protocol**: HTTPS
- **Content-Type**: `application/json` (untuk JSON data), `multipart/form-data` (untuk file upload)
- **Authentication**: Token-based via `X-API-TOKEN` header
- **Response Format**: JSON

---

## Authentication

### Token-Based Authentication

Setelah login berhasil, client akan menerima token yang harus disertakan di setiap request ke protected endpoints.

**Header Format:**
```
X-API-TOKEN: <your-token-here>
```

**Example Request:**
```bash
curl -X GET https://api.example.com/api/users/current \
  -H "X-API-TOKEN: 550e8400-e29b-41d4-a716-446655440000"
```

### Authentication Flow
```
1. POST /api/users/login → Receive token
2. Store token securely (cookie/localStorage)
3. Include token in X-API-TOKEN header for subsequent requests
4. DELETE /api/users/current → Logout (invalidate token)
```

---

## Base URL

### Development
```
http://localhost:3001
```

### Production (GCP Cloud Run)
```
https://simas-backend-xxxx-an.a.run.app
```

---

## Error Handling

### Standard Error Response

```json
{
  "errors": "Error message here"
}
```

### Error Response with Validation Details (Zod)

```json
{
  "errors": [
    {
      "path": "email_instansi",
      "message": "Invalid email format"
    },
    {
      "path": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### HTTP Status Codes

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data (validation error) |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions (not admin) |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## Public Endpoints

### 1. Login

Login user dan dapatkan authentication token.

**Endpoint:** `POST /api/users/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email_instansi": "admin@kominfo.go.id",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "data": {
    "token": "550e8400-e29b-41d4-a716-446655440000",
    "user": {
      "id": 1,
      "email_instansi": "admin@kominfo.go.id",
      "nama_instansi": "Kementerian Kominfo",
      "role": "admin"
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "errors": "Invalid credentials"
}
```

**Error Response (400 Bad Request):**
```json
{
  "errors": [
    {
      "path": "email_instansi",
      "message": "Invalid email"
    }
  ]
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email_instansi": "admin@kominfo.go.id",
    "password": "password123"
  }'
```

---

## User Endpoints

### 2. Get Current User

Mendapatkan informasi user yang sedang login.

**Endpoint:** `GET /api/users/current`

**Authentication:** Required

**Headers:**
```
X-API-TOKEN: <token>
```

**Success Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "email_instansi": "admin@kominfo.go.id",
    "nama_instansi": "Kementerian Kominfo",
    "role": "admin",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "errors": "Unauthorized"
}
```

---

### 3. Update Current User

Update profile user yang sedang login.

**Endpoint:** `PATCH /api/users/current`

**Authentication:** Required

**Request Body:**
```json
{
  "nama_instansi": "Kementerian Kominfo RI",
  "password": "newpassword123"
}
```

**Note:** Semua field optional. Hanya kirim field yang ingin diubah.

**Success Response (200 OK):**
```json
{
  "data": {
    "email_instansi": "admin@kominfo.go.id",
    "nama_instansi": "Kementerian Kominfo RI"
  }
}
```

---

### 4. Logout

Logout user dan invalidate token.

**Endpoint:** `DELETE /api/users/current`

**Authentication:** Required

**Success Response (200 OK):**
```json
{
  "data": "OK"
}
```

---

### 5. Register User (Admin Only)

Membuat user baru. Hanya bisa dilakukan oleh admin.

**Endpoint:** `POST /api/users`

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "email_instansi": "user@example.com",
  "password": "password123",
  "nama_instansi": "Instansi ABC",
  "role": "user"
}
```

**Validation Rules:**
- `email_instansi`: Valid email, max 255 chars, must be unique
- `password`: Min 6 chars, max 100 chars
- `nama_instansi`: Min 1 char, max 255 chars
- `role`: Must be "admin" or "user"

**Success Response (201 Created):**
```json
{
  "data": {
    "id": 5,
    "email_instansi": "user@example.com",
    "nama_instansi": "Instansi ABC",
    "role": "user",
    "created_at": "2025-12-10T10:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "errors": "Email already registered"
}
```

**Error Response (403 Forbidden):**
```json
{
  "errors": "Forbidden: Admin access required"
}
```

---

### 6. Get All Users (Admin Only)

Mendapatkan daftar semua user dengan pagination.

**Endpoint:** `GET /api/users`

**Authentication:** Required (Admin only)

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `pageSize` (optional): Items per page, default: 10

**Example:** `GET /api/users?page=1&pageSize=20`

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "email_instansi": "admin@kominfo.go.id",
      "nama_instansi": "Kementerian Kominfo",
      "role": "admin",
      "total_surat": 15,
      "created_at": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "email_instansi": "user@example.com",
      "nama_instansi": "Instansi ABC",
      "role": "user",
      "total_surat": 5,
      "created_at": "2025-01-02T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3
  }
}
```

---

### 7. Get User by ID (Admin Only)

Mendapatkan detail user berdasarkan ID.

**Endpoint:** `GET /api/users/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id`: User ID

**Success Response (200 OK):**
```json
{
  "data": {
    "id": 2,
    "email_instansi": "user@example.com",
    "nama_instansi": "Instansi ABC",
    "role": "user",
    "created_at": "2025-01-02T00:00:00.000Z",
    "total_surat": 5
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "errors": "User not found"
}
```

---

### 8. Update User by ID (Admin Only)

Update data user berdasarkan ID.

**Endpoint:** `PATCH /api/users/:id`

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "nama_instansi": "Instansi XYZ Updated",
  "email_instansi": "newemail@example.com",
  "password": "newpassword",
  "role": "admin"
}
```

**Note:** Semua field optional.

**Success Response (200 OK):**
```json
{
  "data": {
    "id": 2,
    "email_instansi": "newemail@example.com",
    "nama_instansi": "Instansi XYZ Updated",
    "role": "admin"
  }
}
```

---

### 9. Delete User (Admin Only)

Menghapus user berdasarkan ID.

**Endpoint:** `DELETE /api/users/:id`

**Authentication:** Required (Admin only)

**Success Response (200 OK):**
```json
{
  "data": "OK"
}
```

**Error Response (404 Not Found):**
```json
{
  "errors": "User not found"
}
```

---

## Letter Endpoints

### 10. Create Letter (Admin Only)

Membuat surat baru dengan file upload.

**Endpoint:** `POST /api/surat`

**Authentication:** Required (Admin only)

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `pengirim` (string, required): Nama pengirim
- `nomor_surat` (string, required): Nomor surat
- `tanggal_masuk` (date, required): Format: YYYY-MM-DD
- `tanggal_surat` (date, required): Format: YYYY-MM-DD
- `perihal` (string, required): Perihal surat
- `user_id` (number, required): ID user pemilik surat
- `file` (file, required): File surat (PDF/DOCX, max 10MB)

**Success Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "nomor_registrasi": 1,
    "pengirim": "Dinas Pendidikan",
    "nomor_surat": "001/DP/2025",
    "tanggal_masuk": "2025-12-10",
    "tanggal_surat": "2025-12-09",
    "perihal": "Permohonan Kerjasama",
    "file_url": "uploads/surat-001-1733856000000.pdf",
    "status": "pending",
    "user_id": 2,
    "user": {
      "id": 2,
      "email_instansi": "user@example.com",
      "nama_instansi": "Instansi ABC"
    },
    "created_at": "2025-12-10T10:00:00.000Z",
    "updated_at": "2025-12-10T10:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "errors": "File is required"
}
```

```json
{
  "errors": "Only PDF and DOCX files are allowed"
}
```

```json
{
  "errors": "File size exceeds 10MB limit"
}
```

**Example (curl):**
```bash
curl -X POST http://localhost:3001/api/surat \
  -H "X-API-TOKEN: <token>" \
  -F "pengirim=Dinas Pendidikan" \
  -F "nomor_surat=001/DP/2025" \
  -F "tanggal_masuk=2025-12-10" \
  -F "tanggal_surat=2025-12-09" \
  -F "perihal=Permohonan Kerjasama" \
  -F "user_id=2" \
  -F "file=@/path/to/document.pdf"
```

---

### 11. Get Letter by Nomor Registrasi

Mendapatkan detail surat berdasarkan nomor registrasi.

**Endpoint:** `GET /api/surat/:nomor_registrasi`

**Authentication:** Required

**URL Parameters:**
- `nomor_registrasi`: Nomor registrasi surat

**Success Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "nomor_registrasi": 1,
    "pengirim": "Dinas Pendidikan",
    "nomor_surat": "001/DP/2025",
    "tanggal_masuk": "2025-12-10",
    "tanggal_surat": "2025-12-09",
    "perihal": "Permohonan Kerjasama",
    "file_url": "uploads/surat-001-1733856000000.pdf",
    "status": "pending",
    "user_id": 2,
    "user": {
      "id": 2,
      "email_instansi": "user@example.com",
      "nama_instansi": "Instansi ABC"
    },
    "created_at": "2025-12-10T10:00:00.000Z",
    "updated_at": "2025-12-10T10:00:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "errors": "Letter not found"
}
```

---

### 12. Update Letter (Admin Only)

Update data surat dan/atau file.

**Endpoint:** `PUT /api/surat/:nomor_registrasi`

**Authentication:** Required (Admin only)

**Content-Type:** `multipart/form-data`

**Form Fields (all optional):**
- `pengirim` (string)
- `nomor_surat` (string)
- `tanggal_masuk` (date)
- `tanggal_surat` (date)
- `perihal` (string)
- `user_id` (number)
- `file` (file): New file to replace existing (PDF/DOCX, max 10MB)

**Success Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "nomor_registrasi": 1,
    "pengirim": "Dinas Pendidikan Updated",
    "nomor_surat": "001/DP/2025",
    "tanggal_masuk": "2025-12-10",
    "tanggal_surat": "2025-12-09",
    "perihal": "Permohonan Kerjasama Updated",
    "file_url": "uploads/surat-001-1733856000000.pdf",
    "status": "pending",
    "user_id": 2,
    "user": {
      "id": 2,
      "email_instansi": "user@example.com",
      "nama_instansi": "Instansi ABC"
    },
    "created_at": "2025-12-10T10:00:00.000Z",
    "updated_at": "2025-12-10T10:30:00.000Z"
  }
}
```

**Note:** Jika file baru di-upload, file lama akan dihapus.

---

### 13. Delete Letter (Admin Only)

Menghapus surat dan filenya.

**Endpoint:** `DELETE /api/surat/:nomor_registrasi`

**Authentication:** Required (Admin only)

**Success Response (200 OK):**
```json
{
  "data": "OK"
}
```

**Error Response (404 Not Found):**
```json
{
  "errors": "Letter not found"
}
```

---

### 14. Get All Letters (Admin Only)

Mendapatkan daftar semua surat dengan pagination dan filter.

**Endpoint:** `GET /api/surat`

**Authentication:** Required (Admin only)

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10
- `bulan` (optional): Filter by month (1-12)
- `tahun` (optional): Filter by year (e.g., 2025)

**Example:** `GET /api/surat?page=1&limit=20&bulan=12&tahun=2025`

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "nomor_registrasi": 1,
      "pengirim": "Dinas Pendidikan",
      "nomor_surat": "001/DP/2025",
      "tanggal_masuk": "2025-12-10",
      "tanggal_surat": "2025-12-09",
      "perihal": "Permohonan Kerjasama",
      "file_url": "uploads/surat-001.pdf",
      "status": "pending",
      "user_id": 2,
      "user": {
        "id": 2,
        "email_instansi": "user@example.com",
        "nama_instansi": "Instansi ABC"
      },
      "created_at": "2025-12-10T10:00:00.000Z",
      "updated_at": "2025-12-10T10:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 3
}
```

---

### 15. Get My Letters

Mendapatkan daftar surat milik user yang sedang login.

**Endpoint:** `GET /api/surat/me`

**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "nomor_registrasi": 1,
      "pengirim": "Dinas Pendidikan",
      "nomor_surat": "001/DP/2025",
      "tanggal_masuk": "2025-12-10",
      "tanggal_surat": "2025-12-09",
      "perihal": "Permohonan Kerjasama",
      "file_url": "uploads/surat-001.pdf",
      "status": "pending",
      "user_id": 2,
      "created_at": "2025-12-10T10:00:00.000Z",
      "updated_at": "2025-12-10T10:00:00.000Z"
    }
  ],
  "total": 5,
  "page": 1,
  "totalPages": 1
}
```

---

### 16. Get Letters by User ID (Admin Only)

Mendapatkan daftar surat berdasarkan user ID.

**Endpoint:** `GET /api/surat/user/:userId`

**Authentication:** Required (Admin only)

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "nomor_registrasi": 1,
      "pengirim": "Dinas Pendidikan",
      "nomor_surat": "001/DP/2025",
      "tanggal_masuk": "2025-12-10",
      "tanggal_surat": "2025-12-09",
      "perihal": "Permohonan Kerjasama",
      "file_url": "uploads/surat-001.pdf",
      "status": "pending",
      "user_id": 2,
      "user": {
        "id": 2,
        "email_instansi": "user@example.com",
        "nama_instansi": "Instansi ABC"
      },
      "created_at": "2025-12-10T10:00:00.000Z",
      "updated_at": "2025-12-10T10:00:00.000Z"
    }
  ],
  "total": 5,
  "page": 1,
  "totalPages": 1
}
```

---

### 17. Update Letter Status

Update status surat (pending → diterima).

**Endpoint:** `PATCH /api/surat/:nomor_registrasi/status`

**Authentication:** Required

**Request Body:**
```json
{
  "status": "diterima"
}
```

**Validation:**
- `status`: Must be "pending" or "diterima"

**Success Response (200 OK):**
```json
{
  "data": {
    "nomor_registrasi": 1,
    "status": "diterima",
    "updated_at": "2025-12-10T11:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "errors": "Status must be either 'pending' or 'diterima'"
}
```

---

### 18. Download Letter File

Download file surat.

**Endpoint:** `GET /api/surat/:nomor_registrasi/file`

**Authentication:** Required

**Success Response (200 OK):**
- Content-Type: `application/pdf` or `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Content-Disposition: `attachment; filename="surat-001.pdf"`
- Body: Binary file data

**Error Response (404 Not Found):**
```json
{
  "errors": "File not found"
}
```

**Example:**
```bash
curl -X GET http://localhost:3001/api/surat/1/file \
  -H "X-API-TOKEN: <token>" \
  --output surat-001.pdf
```

---

### 19. Get Monthly Report (Admin Only)

Mendapatkan laporan surat bulanan.

**Endpoint:** `GET /api/surat/laporan-bulanan`

**Authentication:** Required (Admin only)

**Query Parameters:**
- `bulan` (required): Month (1-12)
- `tahun` (required): Year (e.g., 2025)

**Example:** `GET /api/surat/laporan-bulanan?bulan=12&tahun=2025`

**Success Response (200 OK):**
```json
{
  "data": {
    "bulan": 12,
    "tahun": 2025,
    "total_surat": 25,
    "surat_pending": 5,
    "surat_diterima": 20,
    "letters": [
      {
        "nomor_registrasi": 1,
        "pengirim": "Dinas Pendidikan",
        "nomor_surat": "001/DP/2025",
        "tanggal_masuk": "2025-12-10",
        "tanggal_surat": "2025-12-09",
        "perihal": "Permohonan Kerjasama",
        "status": "diterima",
        "nama_instansi": "Instansi ABC"
      }
    ]
  }
}
```

---

## Dashboard Endpoints

### 20. Get Admin Dashboard Stats

Mendapatkan statistik dashboard untuk admin.

**Endpoint:** `GET /api/dashboard/admin`

**Authentication:** Required (Admin only)

**Success Response (200 OK):**
```json
{
  "data": {
    "totalSurat": 150,
    "totalUsers": 25,
    "recentLetters": [
      {
        "id": 1,
        "nomor_surat": "001/DP/2025",
        "perihal": "Permohonan Kerjasama",
        "tanggal_surat": "2025-12-09",
        "status": "pending",
        "nama_instansi": "Instansi ABC"
      },
      {
        "id": 2,
        "nomor_surat": "002/DK/2025",
        "perihal": "Laporan Kegiatan",
        "tanggal_surat": "2025-12-08",
        "status": "diterima",
        "nama_instansi": "Instansi XYZ"
      }
    ]
  }
}
```

---

### 21. Get User Dashboard Stats

Mendapatkan statistik dashboard untuk user biasa.

**Endpoint:** `GET /api/dashboard/user`

**Authentication:** Required

**Success Response (200 OK):**
```json
{
  "data": {
    "totalSurat": 15,
    "recentLetters": [
      {
        "id": 1,
        "nomor_surat": "001/DP/2025",
        "perihal": "Permohonan Kerjasama",
        "tanggal_surat": "2025-12-09",
        "status": "pending",
        "nama_instansi": "Instansi ABC"
      },
      {
        "id": 3,
        "nomor_surat": "003/DP/2025",
        "perihal": "Surat Undangan",
        "tanggal_surat": "2025-12-07",
        "status": "diterima",
        "nama_instansi": "Instansi ABC"
      }
    ]
  }
}
```

---

## Rate Limiting

Currently, there are no rate limits implemented. However, GCP Cloud Run has built-in concurrency limits:
- Max concurrent requests per instance: 80
- Auto-scaling based on load

---

## Changelog

### Version 1.0.0 (December 2025)
- Initial API release
- User management endpoints
- Letter management endpoints
- Dashboard statistics endpoints
- Token-based authentication
- File upload support
- Role-based access control

---

## Support

For API support or bug reports, please contact:
- Email: support@simas.id
- GitHub Issues: https://github.com/MegumenZ/Simas/issues

---

**API Documentation Last Updated:** December 10, 2025
