import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi.'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Kredensial tidak valid atau akun tidak aktif.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Kredensial tidak valid.'
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const roles = user.roles.map((ur) => ur.role.name);
    const permissions = new Set();
    user.roles.forEach((ur) => {
      ur.role.permissions.forEach((rp) => {
        permissions.add(rp.permission.name);
      });
    });

    // Set cookie HTTP-only agar antarmuka web Admin Panel otomatis terautentikasi
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
    });

    return res.json({
      success: true,
      message: 'Login berhasil.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles,
        permissions: Array.from(permissions)
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login.'
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  return res.json({
    success: true,
    message: 'Logout berhasil.'
  });
};

export const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
};

// Memperbarui profil akun mandiri (Nama, Email)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan email wajib diisi.'
      });
    }

    // Cek apakah email sudah digunakan akun lain
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email.trim(),
        NOT: { id: userId }
      }
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar pada akun lain.'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        email: email.trim()
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true }
                }
              }
            }
          }
        }
      }
    });

    const roles = updatedUser.roles.map((ur) => ur.role.name);
    const permissions = new Set();
    updatedUser.roles.forEach((ur) => {
      ur.role.permissions.forEach((rp) => {
        permissions.add(rp.permission.name);
      });
    });

    return res.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        roles,
        permissions: Array.from(permissions)
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui profil akun.'
    });
  }
};

// Mengubah password akun mandiri
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password saat ini dan password baru wajib diisi.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password baru minimal harus 6 karakter.'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan.'
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Password saat ini tidak cocok.'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return res.json({
      success: true,
      message: 'Password berhasil diubah.'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengubah password.'
    });
  }
};

// Mendapatkan informasi Token API integrasi aktif (untuk Administrator)
export const getApiTokenInfo = (req, res) => {
  const apiToken = process.env.API_TOKEN || process.env.API_KEY || 'alexa_live_secret_api_token_2026';
  return res.json({
    success: true,
    apiToken,
    headerName: 'X-API-KEY',
    exampleCurl: `curl -H "X-API-KEY: ${apiToken}" http://localhost:${process.env.PORT || 4000}/api/articles`
  });
};

// Pengujian dan verifikasi validitas API Token dari eksternal/frontend
export const verifyApiToken = (req, res) => {
  const { apiToken } = req.body;
  const headerToken = req.headers['x-api-key'] || req.headers['x-api-token'];
  const tokenToTest = apiToken || headerToken;

  const validToken = process.env.API_TOKEN || process.env.API_KEY || 'alexa_live_secret_api_token_2026';

  if (tokenToTest && tokenToTest === validToken) {
    return res.json({
      success: true,
      valid: true,
      message: 'Koneksi API Token Valid! Anda memiliki hak akses integrasi penuh (Super Admin Integration).',
      identity: {
        name: 'System API Integration',
        role: 'Super Admin',
        access: 'Full REST API Permissions'
      }
    });
  }

  return res.status(401).json({
    success: false,
    valid: false,
    message: 'API Token tidak valid. Periksa kembali token Anda.'
  });
};

