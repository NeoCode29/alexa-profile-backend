import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper internal untuk mengekstrak dan memverifikasi token (JWT atau API Token Integrasi)
const verifyTokenAndLoadUser = async (req) => {
  const apiKeyHeader = req.headers['x-api-key'] || req.headers['x-api-token'];
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.split(' ')[1]) || req.cookies?.token;
  const queryApiKey = req.query.api_key;

  // 1. Pengecekan API Integration Token statis (X-API-KEY, X-API-TOKEN, Authorization Bearer, atau ?api_key=)
  const configuredApiToken = process.env.API_TOKEN || process.env.API_KEY || 'alexa_live_secret_api_token_2026';
  const providedApiToken = apiKeyHeader || queryApiKey || (token === configuredApiToken ? token : null);

  if (configuredApiToken && providedApiToken && providedApiToken === configuredApiToken) {
    return {
      id: 0,
      name: 'System API Integration',
      email: 'integration@alexagroup.co.id',
      roles: ['Super Admin', 'API Integration'],
      permissions: [
        'articles.manage',
        'services.manage',
        'inquiries.manage',
        'roles.manage',
        'users.manage',
        'clients.manage',
        'pages.manage'
      ],
      isApiToken: true
    };
  }

  // 2. Pengecekan JWT Token (pengguna login via UI/Endpoint login)
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

// Helper untuk mencegah cache browser (agar tombol Back tidak memuat halaman dari cache)
const setNoCacheHeaders = (res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
};

// Middleware untuk Halaman Login Admin (Mengarahkan ke /admin jika sudah login)
export const redirectIfAuthenticated = async (req, res, next) => {
  setNoCacheHeaders(res);
  const user = await verifyTokenAndLoadUser(req);

  if (user) {
    return res.redirect('/admin');
  }

  next();
};

// Middleware untuk Halaman Web UI Admin (Mengarahkan ke /admin/login jika belum login)
export const requireAdminAuth = async (req, res, next) => {
  setNoCacheHeaders(res);
  const user = await verifyTokenAndLoadUser(req);

  if (!user) {
    return res.redirect('/admin/login');
  }

  req.user = user;
  res.locals.user = user;
  next();
};

// Middleware khusus untuk memvalidasi integrasi API Token eksternal
export const requireApiToken = (req, res, next) => {
  const apiKeyHeader = req.headers['x-api-key'] || req.headers['x-api-token'];
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const providedToken = apiKeyHeader || bearerToken || req.query.api_key;

  const validApiToken = process.env.API_TOKEN || process.env.API_KEY || 'alexa_live_secret_api_token_2026';

  if (!providedToken || providedToken !== validApiToken) {
    return res.status(401).json({
      success: false,
      message: 'Autentikasi API Token gagal. Sertakan header X-API-KEY atau Authorization Bearer token yang valid untuk integrasi.'
    });
  }

  req.apiIntegration = true;
  req.user = {
    id: 0,
    name: 'System API Integration',
    email: 'integration@alexagroup.co.id',
    roles: ['Super Admin', 'API Integration'],
    permissions: ['*'],
    isApiToken: true
  };

  next();
};

// Middleware API Gateway Guard: Wajibkan API Token untuk koneksi Frontend/Eksternal ke backend REST API
export const apiGatewayGuard = async (req, res, next) => {
  // Pengecualian untuk health check & autentikasi Admin UI
  if (
    req.path === '/health' ||
    req.path.startsWith('/auth/login') ||
    req.path.startsWith('/auth/logout') ||
    req.path.startsWith('/auth/verify-api-token')
  ) {
    return next();
  }

  // 1. Cek API Token (X-API-KEY, X-API-TOKEN, Authorization Bearer, atau parameter query ?api_key=)
  const apiKeyHeader = req.headers['x-api-key'] || req.headers['x-api-token'];
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const providedToken = apiKeyHeader || bearerToken || req.query.api_key;

  const validApiToken = process.env.API_TOKEN || process.env.API_KEY || 'alexa_live_secret_api_token_2026';

  // Jika token disertakan tetapi tidak cocok, tolak langsung 401
  if (providedToken) {
    if (providedToken === validApiToken) {
      return next();
    } else {
      return res.status(401).json({
        success: false,
        message: 'Akses API Ditolak. API Token (X-API-KEY) yang diberikan tidak valid.'
      });
    }
  }

  // 2. Jika tidak ada API Token, cek apakah ada sesi Admin JWT yang valid (misalnya Admin sedang mengoperasikan UI)
  const user = await verifyTokenAndLoadUser(req);
  if (user) {
    req.user = user;
    res.locals.user = user;
    return next();
  }

  // 3. Tolak jika tidak menyertakan API Token
  return res.status(401).json({
    success: false,
    message: 'Akses API Ditolak. Aplikasi Frontend wajib menyertakan API Token (header X-API-KEY) yang valid untuk terhubung ke backend ini.'
  });
};
