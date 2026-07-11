import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Public: Submit form kontak
export const createInquiry = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan pesan wajib diisi.'
      });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        subject: subject || 'Pertanyaan Umum',
        message
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Pesan Anda berhasil dikirim. Tim kami akan segera menghubungi Anda.',
      data: inquiry
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengirim pesan.'
    });
  }
};

// Admin (RBAC: inquiries.manage): Ambil semua pesan masuk
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      data: inquiries
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil pesan masuk.'
    });
  }
};

// Admin: Update status pesan (READ / RESPONDED)
export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status }
    });

    return res.json({
      success: true,
      message: 'Status pesan berhasil diperbarui.',
      data: inquiry
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status pesan.'
    });
  }
};

// Admin: Delete inquiry
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.inquiry.delete({ where: { id } });
    return res.json({
      success: true,
      message: 'Pesan berhasil dihapus.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus pesan.'
    });
  }
};

