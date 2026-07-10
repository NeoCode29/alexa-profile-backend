import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCareers = async (req, res) => {
  try {
    const careers = await prisma.career.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, data: careers });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil daftar lowongan.' });
  }
};

export const createCareer = async (req, res) => {
  try {
    const { title, department, location, type, description, isActive } = req.body;
    if (!title || !department || !description) {
      return res.status(400).json({ success: false, message: 'Posisi, divisi, dan deskripsi wajib diisi.' });
    }

    const career = await prisma.career.create({
      data: {
        title,
        department,
        location: location || 'Jakarta, Hybrid',
        type: type || 'Full-time',
        description,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return res.status(201).json({ success: true, message: 'Lowongan berhasil dibuka.', data: career });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal membuka lowongan.' });
  }
};

export const deleteCareer = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.career.delete({ where: { id } });
    return res.json({ success: true, message: 'Lowongan berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus lowongan.' });
  }
};
