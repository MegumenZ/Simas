# SIMAS - User Manual

## Panduan Pengguna Sistem Manajemen Surat

## Daftar Isi
1. [Pengenalan SIMAS](#pengenalan-simas)
2. [Cara Login](#cara-login)
3. [Dashboard](#dashboard)
4. [Manajemen Surat](#manajemen-surat)
5. [Manajemen Pengguna (Admin)](#manajemen-pengguna-admin)
6. [Profil Pengguna](#profil-pengguna)
7. [Logout](#logout)
8. [FAQ](#faq)
9. [Troubleshooting](#troubleshooting)

## Pengenalan SIMAS

### Apa itu SIMAS?

SIMAS (Sistem Manajemen Surat) adalah aplikasi berbasis web yang dirancang untuk membantu instansi pemerintah dalam mengelola surat masuk secara digital. Dengan SIMAS, Anda dapat:

- ✅ Menyimpan dan mengelola surat masuk secara digital
- ✅ Melacak status surat (Pending/Diterima)
- ✅ Mengunduh file surat dalam format PDF/DOCX
- ✅ Melihat statistik dan laporan surat
- ✅ Mengelola pengguna (khusus admin)

### Jenis Pengguna

SIMAS memiliki dua jenis pengguna:

1. **Admin**
   - Dapat membuat, melihat, mengubah, dan menghapus semua surat
   - Dapat mengelola pengguna (tambah, edit, hapus)
   - Dapat melihat semua statistik sistem
   - Dapat mengunduh laporan bulanan

2. **User (Pengguna Biasa)**
   - Dapat melihat surat yang ditugaskan kepada instansinya
   - Dapat mengubah status surat (pending → diterima)
   - Dapat mengunduh file surat
   - Dapat melihat statistik surat miliknya

---

## Cara Login

### Langkah-langkah Login

1. **Buka Browser**
   - Buka browser favorit Anda (Chrome, Firefox, Edge, dll)
   - Ketik alamat SIMAS: `https://simas.example.com`

2. **Halaman Login**
   - Anda akan melihat halaman login dengan logo SIMAS
   
   ![Login Page Example]
   
   ```
   ┌────────────────────────────────┐
   │      [Logo KOMINFO]            │
   │          SIMAS                 │
   │  Sistem Manajemen Surat        │
   │                                │
   │  Email Instansi:               │
   │  [___________________]         │
   │                                │
   │  Password:                     │
   │  [___________________]         │
   │                                │
   │      [  LOGIN  ]               │
   └────────────────────────────────┘
   ```

3. **Masukkan Kredensial**
   - **Email Instansi**: Masukkan email instansi Anda (contoh: `admin@kominfo.go.id`)
   - **Password**: Masukkan password Anda

4. **Klik Tombol Login**
   - Klik tombol "LOGIN"
   - Tunggu beberapa saat
   - Jika berhasil, Anda akan diarahkan ke Dashboard

### Troubleshooting Login

**❌ Email atau password salah**
- Pastikan email dan password yang Anda masukkan benar
- Perhatikan huruf besar/kecil (case-sensitive)
- Jika lupa password, hubungi administrator

**❌ Tidak bisa login**
- Pastikan koneksi internet Anda stabil
- Refresh halaman dan coba lagi
- Hapus cache browser Anda
- Hubungi administrator jika masalah berlanjut

---

## Dashboard

Setelah login berhasil, Anda akan melihat halaman Dashboard.

### Dashboard Admin

Dashboard admin menampilkan:

```
┌─────────────────────────────────────────────────────────┐
│  Selamat Datang, [Nama Instansi]                        │
│  Sistem Manajemen Surat dan Dokumen Instansi            │
└─────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│  📄 Total Surat      │  │  👥 Total Pengguna   │
│      150             │  │      25              │
└──────────────────────┘  └──────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  📬 Surat Terbaru                                       │
├─────────────────────────────────────────────────────────┤
│  001/DP/2025 - Permohonan Kerjasama                    │
│  Status: Pending | Tanggal: 10 Des 2025                │
├─────────────────────────────────────────────────────────┤
│  002/DK/2025 - Laporan Kegiatan                        │
│  Status: Diterima | Tanggal: 09 Des 2025               │
└─────────────────────────────────────────────────────────┘
```

### Dashboard User

Dashboard user menampilkan:

```
┌─────────────────────────────────────────────────────────┐
│  Selamat Datang, [Nama Instansi]                        │
│  Sistem Manajemen Surat dan Dokumen Instansi            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  📬 Surat Terbaru Anda                                  │
├─────────────────────────────────────────────────────────┤
│  001/DP/2025 - Permohonan Kerjasama                    │
│  Status: Pending | Tanggal: 10 Des 2025                │
├─────────────────────────────────────────────────────────┤
│  003/DP/2025 - Surat Undangan                          │
│  Status: Diterima | Tanggal: 07 Des 2025               │
└─────────────────────────────────────────────────────────┘
```

---

## Manajemen Surat

### Melihat Daftar Surat

1. **Klik menu "Surat"** di sidebar kiri
2. Anda akan melihat tabel daftar surat dengan informasi:
   - Nomor Registrasi
   - Nomor Surat
   - Pengirim
   - Perihal
   - Tanggal Masuk
   - Tanggal Surat
   - Status
   - Instansi Penerima
   - Aksi

3. **Fitur Filter**
   - Filter berdasarkan bulan
   - Filter berdasarkan tahun
   - Pagination (10/20/50 surat per halaman)

### Melihat Detail Surat

1. Klik tombol **"Detail"** (ikon mata 👁) pada surat yang ingin dilihat
2. Anda akan melihat informasi lengkap surat:
   ```
   ┌────────────────────────────────────────────┐
   │  Detail Surat                              │
   ├────────────────────────────────────────────┤
   │  Nomor Registrasi: 1                       │
   │  Nomor Surat: 001/DP/2025                  │
   │  Pengirim: Dinas Pendidikan                │
   │  Perihal: Permohonan Kerjasama             │
   │  Tanggal Masuk: 10 Desember 2025           │
   │  Tanggal Surat: 09 Desember 2025           │
   │  Status: Pending                           │
   │  Instansi Penerima: Instansi ABC           │
   │                                            │
   │  [Unduh File] [Ubah Status] [Kembali]     │
   └────────────────────────────────────────────┘
   ```

### Mengunduh File Surat

1. Pada halaman detail surat, klik tombol **"Unduh File"** atau ikon download 📥
2. File akan otomatis terunduh ke komputer Anda
3. Buka file dengan aplikasi PDF reader atau Word

### Mengubah Status Surat

**Untuk User:**
1. Buka detail surat
2. Klik tombol **"Terima"**
3. Status surat akan berubah

### Membuat Surat Baru (Admin Only)

1. Klik menu **"Surat"** di sidebar
2. Klik tombol **"+ Tambah Surat"** di pojok kanan atas
3. Isi formulir:
   ```
   ┌────────────────────────────────────────────┐
   │  Tambah Surat Baru                         │
   ├────────────────────────────────────────────┤
   │  Pengirim:                                 │
   │  [_______________________________]         │
   │                                            │
   │  Nomor Surat:                              │
   │  [_______________________________]         │
   │                                            │
   │  Tanggal Masuk:                            │
   │  [DD/MM/YYYY]                              │
   │                                            │
   │  Tanggal Surat:                            │
   │  [DD/MM/YYYY]                              │
   │                                            │
   │  Perihal:                                  │
   │  [_______________________________]         │
   │  [_______________________________]         │
   │                                            │
   │  Instansi Penerima:                        │
   │  [Pilih Instansi ▼]                        │
   │                                            │
   │  Upload File (PDF/DOCX, max 10MB):         │
   │  [Pilih File]                              │
   │                                            │
   │  [Batal]  [Simpan]                         │
   └────────────────────────────────────────────┘
   ```

4. **Isi Field yang Diperlukan:**
   - **Pengirim**: Nama instansi/organisasi pengirim
   - **Nomor Surat**: Nomor surat resmi (contoh: 001/DP/2025)
   - **Tanggal Masuk**: Tanggal surat diterima
   - **Tanggal Surat**: Tanggal pada surat
   - **Perihal**: Isi singkat surat
   - **Instansi Penerima**: Pilih instansi yang menerima surat
   - **File**: Upload file surat (PDF atau DOCX, maksimal 10MB)

5. Klik tombol **"Simpan"**
6. Surat baru akan muncul di daftar surat

### Mengedit Surat (Admin Only)

1. Pada halaman daftar surat, klik tombol **"Edit"** (ikon pensil ✏️)
2. Formulir edit akan muncul dengan data surat yang sudah terisi
3. Ubah data yang diperlukan
4. Upload file baru jika ingin mengganti file (opsional)
5. Klik **"Simpan"**
6. Data surat akan diperbarui

### Menghapus Surat (Admin Only)

1. Pada halaman daftar surat, klik tombol **"Hapus"** (ikon tempat sampah 🗑️)
2. Konfirmasi penghapusan akan muncul:
   ```
   ┌────────────────────────────────────────────┐
   │  ⚠️ Konfirmasi Penghapusan                 │
   ├────────────────────────────────────────────┤
   │  Apakah Anda yakin ingin menghapus surat   │
   │  dengan nomor registrasi 1?                │
   │                                            │
   │  Surat: 001/DP/2025                        │
   │  Perihal: Permohonan Kerjasama             │
   │                                            │
   │  Tindakan ini tidak dapat dibatalkan!      │
   │                                            │
   │  [Batal]  [Ya, Hapus]                      │
   └────────────────────────────────────────────┘
   ```
3. Klik **"Ya, Hapus"** untuk menghapus
4. Surat dan file akan dihapus secara permanen

### Laporan Bulanan (Admin Only)

1. Klik menu **"Surat"** di sidebar
2. Klik tombol **"Laporan Bulanan"**
3. Pilih bulan dan tahun
4. Klik **"Lihat Laporan"**
5. Laporan akan ditampilkan dengan statistik:
   - Total surat bulan tersebut
   - Jumlah surat pending
   - Jumlah surat diterima
   - Daftar detail surat
6. Klik **"Export PDF"** untuk mengunduh laporan dalam format PDF

---

## Manajemen Pengguna (Admin)

### Melihat Daftar Pengguna

1. Klik menu **"Pengguna"** di sidebar kiri (hanya tampil untuk admin)
2. Anda akan melihat tabel daftar pengguna dengan informasi:
   - ID
   - Email Instansi
   - Nama Instansi
   - Role (Admin/User)
   - Total Surat
   - Tanggal Dibuat
   - Aksi

### Menambah Pengguna Baru

1. Klik tombol **"+ Tambah Pengguna"**
2. Isi formulir:
   ```
   ┌────────────────────────────────────────────┐
   │  Tambah Pengguna Baru                      │
   ├────────────────────────────────────────────┤
   │  Email Instansi:                           │
   │  [_______________________________]         │
   │                                            │
   │  Nama Instansi:                            │
   │  [_______________________________]         │
   │                                            │
   │  Password:                                 │
   │  [_______________________________]         │
   │                                            │
   │  Role:                                     │
   │  ⚪ Admin  ⚪ User                          │
   │                                            │
   │  [Batal]  [Simpan]                         │
   └────────────────────────────────────────────┘
   ```

3. **Isi Field:**
   - **Email Instansi**: Email unik untuk login (contoh: `user@instansi.go.id`)
   - **Nama Instansi**: Nama lengkap instansi/organisasi
   - **Password**: Password minimal 6 karakter
   - **Role**: Pilih Admin atau User

4. Klik **"Simpan"**
5. Pengguna baru dapat langsung login dengan email dan password yang dibuat

### Mengedit Pengguna

1. Klik tombol **"Edit"** pada pengguna yang ingin diubah
2. Formulir edit akan muncul
3. Ubah data yang diperlukan:
   - Email Instansi
   - Nama Instansi
   - Password (opsional, kosongkan jika tidak ingin mengubah)
   - Role
4. Klik **"Simpan"**

### Menghapus Pengguna

1. Klik tombol **"Hapus"** pada pengguna yang ingin dihapus
2. Konfirmasi penghapusan akan muncul
3. Klik **"Ya, Hapus"** untuk menghapus
4. **⚠️ Perhatian**: Semua surat yang terkait dengan pengguna ini akan tetap ada, tetapi pengguna tidak dapat login lagi

### Melihat Detail Pengguna

1. Klik tombol **"Detail"** pada pengguna
2. Anda akan melihat:
   - Informasi lengkap pengguna
   - Daftar surat yang dimiliki pengguna tersebut
   - Statistik surat pengguna

---

## Profil Pengguna

### Melihat Profil

1. Klik ikon profil di pojok kanan atas
2. Pilih **"Profil"** dari dropdown menu
3. Anda akan melihat informasi profil Anda:
   ```
   ┌────────────────────────────────────────────┐
   │  Profil Saya                               │
   ├────────────────────────────────────────────┤
   │  Email Instansi:                           │
   │  admin@kominfo.go.id                       │
   │                                            │
   │  Nama Instansi:                            │
   │  Kementerian Kominfo                       │
   │                                            │
   │  Role:                                     │
   │  Admin                                     │
   │                                            │
   │  Bergabung Sejak:                          │
   │  01 Januari 2025                           │
   │                                            │
   │  [Edit Profil]                             │
   └────────────────────────────────────────────┘
   ```

### Mengedit Profil

1. Klik tombol **"Edit Profil"**
2. Formulir edit akan muncul:
   ```
   ┌────────────────────────────────────────────┐
   │  Edit Profil                               │
   ├────────────────────────────────────────────┤
   │  Nama Instansi:                            │
   │  [Kementerian Kominfo______________]       │
   │                                            │
   │  Password Baru (Opsional):                 │
   │  [_______________________________]         │
   │                                            │
   │  Konfirmasi Password Baru:                 │
   │  [_______________________________]         │
   │                                            │
   │  [Batal]  [Simpan]                         │
   └────────────────────────────────────────────┘
   ```

3. **Yang Dapat Diubah:**
   - Nama Instansi
   - Password (opsional)

4. **Tidak Dapat Diubah:**
   - Email Instansi (digunakan untuk login)
   - Role (hanya admin yang dapat mengubah role)

5. Klik **"Simpan"** untuk menyimpan perubahan

### Mengubah Password

**Cara Aman Mengubah Password:**
1. Masuk ke menu Edit Profil
2. Isi field "Password Baru" dengan password yang kuat:
   - Minimal 6 karakter
   - Kombinasi huruf, angka, dan simbol (disarankan)
   - Contoh: `Pass123!@#`
3. Isi field "Konfirmasi Password Baru" dengan password yang sama
4. Klik **"Simpan"**
5. Password Anda akan berubah
6. **⚠️ Penting**: Catat password baru Anda di tempat yang aman

---

## Logout

### Cara Logout

1. Klik ikon profil di pojok kanan atas
2. Pilih **"Logout"** dari dropdown menu
3. Konfirmasi logout akan muncul:
   ```
   ┌────────────────────────────────────────────┐
   │  Konfirmasi Logout                         │
   ├────────────────────────────────────────────┤
   │  Apakah Anda yakin ingin keluar?           │
   │                                            │
   │  [Batal]  [Ya, Logout]                     │
   └────────────────────────────────────────────┘
   ```
4. Klik **"Ya, Logout"**
5. Anda akan diarahkan kembali ke halaman login

**💡 Tips Keamanan:**
- Selalu logout setelah selesai menggunakan SIMAS
- Jangan biarkan browser tetap login jika menggunakan komputer umum
- Tutup semua tab browser setelah logout

---

## FAQ

### Umum

**Q: Apa perbedaan antara Admin dan User?**
A: Admin memiliki akses penuh ke sistem (kelola surat dan pengguna), sedangkan User hanya dapat melihat dan mengelola surat yang ditugaskan kepada instansinya.

**Q: Apakah SIMAS dapat diakses dari HP?**
A: Ya, SIMAS responsive dan dapat diakses dari HP, tablet, atau komputer.

**Q: Berapa lama sesi login bertahan?**
A: Sesi login bertahan selama 24 jam. Setelah itu, Anda perlu login ulang.

### Surat

**Q: Format file apa yang didukung untuk upload surat?**
A: SIMAS mendukung file PDF dan DOCX dengan ukuran maksimal 10MB per file.

**Q: Bagaimana cara mengubah file surat yang sudah diupload?**
A: Admin dapat mengedit surat dan mengupload file baru. File lama akan otomatis tergantikan.

**Q: Apakah nomor registrasi dapat diubah?**
A: Tidak. Nomor registrasi dibuat otomatis oleh sistem dan tidak dapat diubah untuk menjaga integritas data.

**Q: Apa arti status Pending dan Diterima?**
A: 
- **Pending**: Surat baru masuk dan belum diproses
- **Diterima**: Surat sudah diterima dan sedang/sudah diproses

### Pengguna

**Q: Bagaimana cara mereset password jika lupa?**
A: Hubungi administrator untuk mereset password Anda.

**Q: Bisakah user biasa melihat semua surat?**
A: Tidak. User biasa hanya dapat melihat surat yang ditugaskan kepada instansinya.

**Q: Berapa banyak pengguna yang dapat dibuat?**
A: Tidak ada batasan jumlah pengguna yang dapat dibuat.

---

## Troubleshooting

### Masalah Login

**❌ Tidak bisa login**
- **Solusi 1**: Periksa email dan password, pastikan tidak ada typo
- **Solusi 2**: Hapus cache dan cookies browser
- **Solusi 3**: Coba gunakan browser lain
- **Solusi 4**: Hubungi administrator

**❌ Lupa password**
- **Solusi**: Hubungi administrator untuk mereset password Anda

### Masalah Upload File

**❌ File tidak bisa diupload**
- **Penyebab 1**: File terlalu besar (max 10MB)
  - **Solusi**: Kompres file atau pisahkan menjadi beberapa bagian
- **Penyebab 2**: Format file tidak didukung
  - **Solusi**: Konversi file ke format PDF atau DOCX
- **Penyebab 3**: Koneksi internet lambat
  - **Solusi**: Coba lagi dengan koneksi yang lebih stabil

**❌ File tidak bisa diunduh**
- **Solusi 1**: Coba refresh halaman
- **Solusi 2**: Periksa koneksi internet
- **Solusi 3**: Coba browser lain
- **Solusi 4**: Hubungi administrator jika file corrupt

### Masalah Tampilan

**❌ Tampilan tidak muncul dengan benar**
- **Solusi 1**: Refresh halaman (F5 atau Ctrl+R)
- **Solusi 2**: Hapus cache browser
- **Solusi 3**: Update browser ke versi terbaru
- **Solusi 4**: Coba gunakan browser berbeda (disarankan Chrome, Firefox, Edge)

**❌ Halaman loading terus menerus**
- **Solusi 1**: Refresh halaman
- **Solusi 2**: Periksa koneksi internet
- **Solusi 3**: Logout dan login kembali
- **Solusi 4**: Hubungi administrator

### Masalah Performa

**❌ Aplikasi lambat**
- **Solusi 1**: Periksa koneksi internet
- **Solusi 2**: Tutup tab browser lain yang tidak digunakan
- **Solusi 3**: Restart browser
- **Solusi 4**: Clear cache browser

---

## Kontak Support

Jika Anda mengalami masalah yang tidak tercantum di manual ini, silakan hubungi:

**Tim Support SIMAS**
- 📧 Email: support@simas.id
- 📞 Telepon: (021) 1234-5678
- 🕐 Jam Operasional: Senin - Jumat, 08:00 - 17:00 WIB

**Administrator Sistem**
- Hubungi administrator IT instansi Anda untuk bantuan teknis

---

## Tips & Best Practices

### Manajemen Surat

1. ✅ **Upload file berkualitas baik**
   - Gunakan file yang sudah di-scan dengan jelas
   - Pastikan file tidak corrupt

2. ✅ **Isi data dengan lengkap dan akurat**
   - Data yang lengkap memudahkan pencarian
   - Double-check sebelum menyimpan

3. ✅ **Update status surat secara rutin**
   - Ubah status ke "Diterima" setelah surat diproses
   - Membantu monitoring progress

4. ✅ **Gunakan fitur filter dan search**
   - Memudahkan pencarian surat
   - Hemat waktu

### Performa

1. ✅ **Gunakan browser modern**
   - Chrome, Firefox, atau Edge versi terbaru
   - Update browser secara berkala

2. ✅ **Koneksi internet stabil**
   - Minimal 2 Mbps untuk pengalaman optimal

3. ✅ **Hapus cache secara berkala**
   - Meningkatkan performa aplikasi

## Changelog

### Version 1.0.0 (Desember 2025)
- ✅ Fitur login dan logout
- ✅ Dashboard statistik
- ✅ Manajemen surat (CRUD)
- ✅ Upload dan download file
- ✅ Manajemen pengguna (admin)
- ✅ Profil pengguna
- ✅ Filter dan pagination
- ✅ Laporan bulanan

---

**User Manual Last Updated:** 10 Desember 2025
