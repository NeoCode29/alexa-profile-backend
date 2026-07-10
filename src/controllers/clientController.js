import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { order: 'asc' }
    });

    return res.json({
      success: true,
      data: clients
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar klien.'
    });
  }
};

export const createClient = async (req, res) => {
  try {
    const { name, image, order } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        success: false,
        message: 'Nama klien dan logo wajib diisi.'
      });
    }

    const client = await prisma.client.create({
      data: {
        name,
        image,
        order: order ? parseInt(order) : 0
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Klien berhasil ditambahkan.',
      data: client
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menambahkan klien.'
    });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.client.delete({ where: { id } });

    return res.json({
      success: true,
      message: 'Klien berhasil dihapus.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus klien.'
    });
  }
};
