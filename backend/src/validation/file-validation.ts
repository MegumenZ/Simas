import multer from "multer";
import path from "path";
import fs from "fs"; // <--- Kita butuh library ini

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "uploads");

    // --- BAGIAN PENTING ---
    // Cek apakah folder ada. Jika tidak, buat folder secara otomatis.
    if (!fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`Created upload directory at: ${uploadDir}`);
      } catch (err) {
        console.error(`Failed to create upload directory:`, err);
      }
    }
    // ----------------------

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const parsedFile = path.parse(file.originalname);
    const originalName = parsedFile.name; // Nama asli tanpa ekstensi
    const ext = parsedFile.ext; // Ekstensi (.pdf, .docx)

    // Tambahkan timestamp agar nama file unik
    const uniqueName = `${originalName}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Error handling khusus untuk tipe file salah
    const error = new multer.MulterError("LIMIT_UNEXPECTED_FILE");
    error.message = "Only PDF and DOCX files are allowed";
    cb(error);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit 10 MB
  },
});