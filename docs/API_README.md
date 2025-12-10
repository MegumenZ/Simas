# SIMAS API Documentation

Dokumentasi API SIMAS tersedia dalam beberapa format:

## 📄 Format Dokumentasi

### 1. OpenAPI Specification (openapi.yaml)
File spesifikasi OpenAPI 3.0 yang dapat digunakan dengan berbagai tools:
- Swagger UI
- Postman
- Insomnia
- API testing tools lainnya

**File:** [`openapi.yaml`](./openapi.yaml)

### 2. Swagger UI (Interactive)
Dokumentasi interaktif dengan Swagger UI untuk testing API langsung dari browser.

**File:** [`swagger.html`](./swagger.html)

### 3. Markdown Documentation
Dokumentasi lengkap dalam format Markdown dengan contoh request/response.

**File:** [`API.md`](./API.md)

---

## 🚀 Cara Menggunakan

### Opsi 1: Buka Swagger UI di Browser (Recommended)

#### Menggunakan Python HTTP Server
```bash
cd docs
python -m http.server 8080
```

Kemudian buka di browser:
```
http://localhost:8080/swagger.html
```

#### Menggunakan Node.js HTTP Server
```bash
cd docs
npx http-server -p 8080
```

Kemudian buka di browser:
```
http://localhost:8080/swagger.html
```

#### Menggunakan VS Code Live Server
1. Install ekstensi "Live Server" di VS Code
2. Klik kanan pada file `swagger.html`
3. Pilih "Open with Live Server"

### Opsi 2: Import ke Postman

1. Buka Postman
2. Klik "Import" di pojok kiri atas
3. Pilih "File"
4. Pilih file `openapi.yaml`
5. Semua endpoint akan otomatis ter-import ke collection

### Opsi 3: Import ke Insomnia

1. Buka Insomnia
2. Klik "Create" → "Import from File"
3. Pilih file `openapi.yaml`
4. Collection akan otomatis dibuat

### Opsi 4: Online Swagger Editor

1. Buka https://editor.swagger.io/
2. Copy-paste isi file `openapi.yaml`
3. Dokumentasi akan langsung tampil

---

## 🔑 Authentication

API menggunakan **Token-based Authentication**:

1. **Login** terlebih dahulu untuk mendapatkan token:
   ```bash
   POST /api/users/login
   {
     "email_instansi": "admin@kominfo.go.id",
     "password": "password123"
   }
   ```

2. **Gunakan token** di header setiap request:
   ```
   X-API-TOKEN: <your-token-here>
   ```

### Cara Set Authorization di Swagger UI

1. Klik tombol **"Authorize"** (🔒) di pojok kanan atas
2. Masukkan token Anda di field "Value"
3. Klik "Authorize"
4. Klik "Close"
5. Sekarang semua request akan otomatis menyertakan token

---

## 📊 Endpoint Overview

### Public Endpoints (No Auth)
- `POST /api/users/login` - Login user

### User Management
- `GET /api/users/current` - Get current user info
- `PATCH /api/users/current` - Update current user
- `DELETE /api/users/current` - Logout
- `POST /api/users` - Register user (Admin only)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PATCH /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Letter Management
- `POST /api/surat` - Create letter (Admin only)
- `GET /api/surat` - Get all letters (Admin only)
- `GET /api/surat/me` - Get my letters
- `GET /api/surat/user/:userId` - Get letters by user (Admin only)
- `GET /api/surat/:nomor_registrasi` - Get letter details
- `PUT /api/surat/:nomor_registrasi` - Update letter (Admin only)
- `DELETE /api/surat/:nomor_registrasi` - Delete letter (Admin only)
- `PATCH /api/surat/:nomor_registrasi/status` - Update status
- `GET /api/surat/:nomor_registrasi/file` - Download file
- `GET /api/surat/laporan-bulanan` - Monthly report (Admin only)

### Dashboard
- `GET /api/dashboard/admin` - Admin dashboard stats (Admin only)
- `GET /api/dashboard/user` - User dashboard stats

---

## 🧪 Testing API dengan Swagger UI

### 1. Test Login
1. Buka endpoint `POST /api/users/login`
2. Klik "Try it out"
3. Edit request body dengan kredensial Anda
4. Klik "Execute"
5. Copy token dari response

### 2. Set Authorization
1. Klik tombol "Authorize" di atas
2. Paste token yang sudah di-copy
3. Klik "Authorize" dan "Close"

### 3. Test Protected Endpoints
1. Pilih endpoint yang ingin di-test
2. Klik "Try it out"
3. Isi parameters/body jika diperlukan
4. Klik "Execute"
5. Lihat response di bawah

### 4. Upload File
Untuk endpoint dengan file upload (create/update letter):
1. Klik "Try it out"
2. Isi field lainnya
3. Klik "Choose File" untuk field `file`
4. Pilih file PDF atau DOCX (max 10MB)
5. Klik "Execute"

---

## 💡 Tips Penggunaan

### Filter & Pagination
Banyak endpoint mendukung query parameters:
```
GET /api/surat?page=1&limit=20&bulan=12&tahun=2025
```

### Error Handling
API mengembalikan error dalam format:
```json
{
  "errors": "Error message"
}
```

Atau untuk validation errors:
```json
{
  "errors": [
    {
      "path": "email_instansi",
      "message": "Invalid email format"
    }
  ]
}
```

### HTTP Status Codes
- `200 OK` - Request berhasil
- `201 Created` - Resource berhasil dibuat
- `400 Bad Request` - Request tidak valid
- `401 Unauthorized` - Token tidak valid/tidak ada
- `403 Forbidden` - Tidak punya permission
- `404 Not Found` - Resource tidak ditemukan
- `500 Internal Server Error` - Server error

---

## 📝 Example Requests

### Login
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email_instansi": "admin@kominfo.go.id",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:3001/api/users/current \
  -H "X-API-TOKEN: your-token-here"
```

### Create Letter
```bash
curl -X POST http://localhost:3001/api/surat \
  -H "X-API-TOKEN: your-token-here" \
  -F "pengirim=Dinas Pendidikan" \
  -F "nomor_surat=001/DP/2025" \
  -F "tanggal_masuk=2025-12-10" \
  -F "tanggal_surat=2025-12-09" \
  -F "perihal=Permohonan Kerjasama" \
  -F "user_id=2" \
  -F "file=@/path/to/document.pdf"
```

### Update Letter Status
```bash
curl -X PATCH http://localhost:3001/api/surat/1/status \
  -H "X-API-TOKEN: your-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "diterima"
  }'
```

---

## 🔗 Related Documentation

- [Technical Documentation](./TECHNICAL.md) - Arsitektur dan implementasi teknis
- [User Manual](./USER_MANUAL.md) - Panduan penggunaan untuk end-user
- [Cost Analysis](./COST_ANALYSIS.md) - Analisis biaya deployment GCP

---

## 🐛 Troubleshooting

### Swagger UI tidak muncul
- Pastikan file `openapi.yaml` dan `swagger.html` ada di folder yang sama
- Pastikan Anda membuka via HTTP server, bukan file:// protocol
- Cek console browser untuk error

### CORS Error saat testing
- Jika test dari Swagger UI ke server lokal, pastikan backend sudah set CORS
- Atau gunakan Postman/Insomnia untuk testing

### Token expired
- Login ulang untuk mendapatkan token baru
- Token berlaku selama 24 jam

---

## 📧 Support

Jika ada pertanyaan atau menemukan bug:
- Email: support@simas.id
- GitHub Issues: https://github.com/MegumenZ/Simas/issues

---

**Last Updated:** 10 Desember 2025
