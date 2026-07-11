export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Tidak ada file gambar yang diunggah.'
    });
  }

  return res.json({
    success: true,
    message: 'Gambar berhasil diunggah dan dioptimasi ke WebP.',
    url: req.file.url
  });
};
