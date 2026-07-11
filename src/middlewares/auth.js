import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper internal untuk mengekstrak dan memverifikasi token
const verifyTokenAndLoadUser = async (req) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.split(' ')[1]) || req.cookies?.token;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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

    if (!user || !user.isActive) return null;

    const roleNames = user.roles.map((ur) => ur.role.name);
    const permissionNames = new Set();

    user.roles.forEach((ur) => {
      ur.role.permissions.forEach((rp) => {
        permissionNames.add(rp.permission.name);
      });
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: roleNames,
      permissions: Array.from(permissionNames)
    };
  } catch (error) {
    return null;
  }
};

// Middleware untuk endpoint API JSON (Mengembalikan 401 Unauthorized jika gagal)
export const authenticateJWT = async (req, res, next) => {
  const user = await verifyTokenAndLoadUser(req);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token autentikasi tidak valid atau tidak ditemukan.'
    });
  }

  req.user = user;
  res.locals.user = user;
  next();
};

// Middleware untuk Halaman Web UI Admin (Mengarahkan ke /admin/login jika belum login)
export const requireAdminAuth = async (req, res, next) => {
  const user = await verifyTokenAndLoadUser(req);

  if (!user) {
    return res.redirect('/admin/login');
  }

  req.user = user;
  res.locals.user = user;
  next();
};
