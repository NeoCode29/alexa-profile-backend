import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Ambil semua pengguna admin beserta role-nya
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        roles: {
          include: { role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar admin.'
    });
  }
};

// Ambil detail satu pengguna admin berdasarkan ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna admin tidak ditemukan.'
      });
    }

    // Hindari mengembalikan hash password
    const { password, ...userData } = user;

    return res.json({
      success: true,
      data: {
        ...userData,
        roleIds: user.roles.map((ur) => ur.roleId)
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data admin.'
    });
  }
};

// Buat akun Admin baru
export const createUser = async (req, res) => {
  try {
    const { name, email, password, roleIds, isActive } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan password wajib diisi.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal harus 6 karakter.'
      });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.trim() } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    // Hubungkan role jika ada
    if (Array.isArray(roleIds) && roleIds.length > 0) {
      const userRolesData = roleIds.map((roleId) => ({
        userId: user.id,
        roleId
      }));
      await prisma.userRole.createMany({ data: userRolesData });
    }

    return res.status(201).json({
      success: true,
      message: 'Akun admin berhasil dibuat.',
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal membuat akun admin.'
    });
  }
};

// Update akun admin & role
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, roleIds, isActive } = req.body;

    // Cegah penonaktifan akun sendiri
    if (req.user && req.user.id === id && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'Anda tidak dapat menonaktifkan akun Anda sendiri yang sedang aktif.'
      });
    }

    // Cek duplikasi email jika email diubah
    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: email.trim(),
          NOT: { id }
        }
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email sudah terdaftar pada akun lain.'
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim();
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password baru minimal harus 6 karakter.'
        });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    });

    // Update roles jika disediakan
    if (Array.isArray(roleIds)) {
      await prisma.userRole.deleteMany({ where: { userId: id } });
      if (roleIds.length > 0) {
        const userRolesData = roleIds.map((roleId) => ({
          userId: id,
          roleId
        }));
        await prisma.userRole.createMany({ data: userRolesData });
      }
    }

    return res.json({
      success: true,
      message: 'Akun admin berhasil diperbarui.',
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui akun admin.'
    });
  }
};

// Hapus akun admin
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Cegah menghapus diri sendiri
    if (req.user && req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.'
      });
    }

    await prisma.user.delete({ where: { id } });

    return res.json({
      success: true,
      message: 'Akun admin berhasil dihapus.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus akun admin.'
    });
  }
};
