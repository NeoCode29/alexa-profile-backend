import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        packages: true
      }
    });

    return res.json({
      success: true,
      data: services
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar layanan.'
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        packages: true
      }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Layanan tidak ditemukan.'
      });
    }

    return res.json({
      success: true,
      data: service
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail layanan.'
    });
  }
};

export const createService = async (req, res) => {
  try {
    const { id, title, subtitle, description, icon, features, heroDesc, fullDesc, portfolios, testimonials } = req.body;
    if (!id || !title || !description) {
      return res.status(400).json({ success: false, message: 'ID (slug), Judul, dan Deskripsi wajib diisi.' });
    }

    const created = await prisma.service.create({
      data: {
        id: id.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
        title,
        subtitle: subtitle || '',
        description,
        icon: icon || 'FaLaptopCode',
        color: '#3BAE7C',
        features: typeof features === 'object' ? JSON.stringify(features) : (features || '[]'),
        portfolios: typeof portfolios === 'object' ? JSON.stringify(portfolios) : (portfolios || '[]'),
        testimonials: typeof testimonials === 'object' ? JSON.stringify(testimonials) : (testimonials || '[]'),
        heroDesc: heroDesc || description,
        fullDesc: fullDesc || description
      }
    });

    return res.status(201).json({ success: true, message: 'Divisi layanan berhasil ditambahkan.', data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menambahkan layanan. ID mungkin sudah digunakan.' });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, heroDesc, fullDesc, icon, features, portfolios, testimonials } = req.body;

    const updated = await prisma.service.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        heroDesc,
        fullDesc,
        icon: icon || undefined,
        features: typeof features === 'object' ? JSON.stringify(features) : features,
        portfolios: typeof portfolios === 'object' ? JSON.stringify(portfolios) : portfolios,
        testimonials: typeof testimonials === 'object' ? JSON.stringify(testimonials) : testimonials
      }
    });

    return res.json({
      success: true,
      message: 'Layanan berhasil diperbarui.',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui layanan.'
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    return res.json({ success: true, message: 'Divisi layanan berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus divisi layanan.' });
  }
};

export const createPackage = async (req, res) => {
  try {
    const { serviceId, name, price, isPopular, features } = req.body;

    if (!serviceId || !name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Divisi layanan, nama paket, dan harga wajib diisi.'
      });
    }

    const pkg = await prisma.pricingPackage.create({
      data: {
        serviceId,
        name,
        price,
        isPopular: !!isPopular,
        features: typeof features === 'object' ? JSON.stringify(features) : (features || '[]')
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Paket harga berhasil ditambahkan.',
      data: pkg
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menambahkan paket harga.'
    });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, isPopular, features } = req.body;

    const pkg = await prisma.pricingPackage.update({
      where: { id },
      data: {
        name,
        price,
        isPopular: !!isPopular,
        features: typeof features === 'object' ? JSON.stringify(features) : features
      }
    });

    return res.json({ success: true, message: 'Paket harga berhasil diperbarui.', data: pkg });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui paket harga.' });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pricingPackage.delete({ where: { id } });

    return res.json({
      success: true,
      message: 'Paket harga berhasil dihapus.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus paket harga.'
    });
  }
};

// ========================
// PORTFOLIOS INTERACTIVE CRUD
// ========================
export const addPortfolio = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { title, category, image, desc } = req.body;
    const svc = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!svc) return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan' });

    let arr = [];
    try { arr = JSON.parse(svc.portfolios || '[]'); } catch (e) {}
    const newItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      title, category, image, desc
    };
    arr.push(newItem);

    await prisma.service.update({
      where: { id: serviceId },
      data: { portfolios: JSON.stringify(arr) }
    });

    return res.json({ success: true, message: 'Showcase proyek berhasil ditambahkan.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menambahkan proyek.' });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const { serviceId, itemId } = req.params;
    const { title, category, image, desc } = req.body;
    const svc = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!svc) return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan' });

    let arr = [];
    try { arr = JSON.parse(svc.portfolios || '[]'); } catch (e) {}
    const index = arr.findIndex(p => p.id === itemId || String(arr.indexOf(p)) === itemId);
    if (index === -1) return res.status(404).json({ success: false, message: 'Proyek tidak ditemukan' });

    arr[index] = { ...arr[index], title, category, image, desc };

    await prisma.service.update({
      where: { id: serviceId },
      data: { portfolios: JSON.stringify(arr) }
    });

    return res.json({ success: true, message: 'Showcase proyek berhasil diperbarui.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui proyek.' });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const { serviceId, itemId } = req.params;
    const svc = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!svc) return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan' });

    let arr = [];
    try { arr = JSON.parse(svc.portfolios || '[]'); } catch (e) {}
    const filtered = arr.filter((p, idx) => p.id !== itemId && String(idx) !== itemId);

    await prisma.service.update({
      where: { id: serviceId },
      data: { portfolios: JSON.stringify(filtered) }
    });

    return res.json({ success: true, message: 'Showcase proyek berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus proyek.' });
  }
};

// ========================
// TESTIMONIALS INTERACTIVE CRUD
// ========================
export const addTestimonial = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { name, company, quote } = req.body;
    const svc = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!svc) return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan' });

    let arr = [];
    try { arr = JSON.parse(svc.testimonials || '[]'); } catch (e) {}
    const newItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name, company, quote
    };
    arr.push(newItem);

    await prisma.service.update({
      where: { id: serviceId },
      data: { testimonials: JSON.stringify(arr) }
    });

    return res.json({ success: true, message: 'Testimoni klien berhasil ditambahkan.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menambahkan testimoni.' });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const { serviceId, itemId } = req.params;
    const { name, company, quote } = req.body;
    const svc = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!svc) return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan' });

    let arr = [];
    try { arr = JSON.parse(svc.testimonials || '[]'); } catch (e) {}
    const index = arr.findIndex(t => t.id === itemId || String(arr.indexOf(t)) === itemId);
    if (index === -1) return res.status(404).json({ success: false, message: 'Testimoni tidak ditemukan' });

    arr[index] = { ...arr[index], name, company, quote };

    await prisma.service.update({
      where: { id: serviceId },
      data: { testimonials: JSON.stringify(arr) }
    });

    return res.json({ success: true, message: 'Testimoni klien berhasil diperbarui.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui testimoni.' });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const { serviceId, itemId } = req.params;
    const svc = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!svc) return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan' });

    let arr = [];
    try { arr = JSON.parse(svc.testimonials || '[]'); } catch (e) {}
    const filtered = arr.filter((t, idx) => t.id !== itemId && String(idx) !== itemId);

    await prisma.service.update({
      where: { id: serviceId },
      data: { testimonials: JSON.stringify(filtered) }
    });

    return res.json({ success: true, message: 'Testimoni klien berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus testimoni.' });
  }
};
