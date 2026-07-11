import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Pastikan folder public/uploads ada
const uploadDir = path.resolve('public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Gunakan memori storage agar bisa langsung dioptimasi dengan Sharp
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Maksimal 5 MB
});

// Middleware untuk memproses dan mengoptimasi gambar ke format WebP
export const processImageUpload = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filename = `img-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const outputPath = path.join(uploadDir, filename);

    await sharp(req.file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    req.file.filename = filename;
    req.file.url = `/uploads/${filename}`;
    next();
  } catch (error) {
    console.error('Error proses gambar Sharp:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memproses gambar yang diunggah.'
    });
  }
};
