/**
 * Middleware untuk memastikan pengguna memiliki izin (Permission) tertentu untuk API.
 * Super Admin otomatis lolos pengecekan.
 */
export const requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Tidak terautentikasi.'
      });
    }

    // Super Admin selalu diperbolehkan
    if (req.user.roles.includes('Super Admin')) {
      return next();
    }

    if (!req.user.permissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Anda memerlukan izin: ${requiredPermission}`
      });
    }

    next();
  };
};

/**
 * Middleware untuk memastikan pengguna memiliki Role tertentu untuk API.
 */
export const requireRole = (requiredRoles = []) => {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Tidak terautentikasi.'
      });
    }

    // Super Admin selalu diperbolehkan
    if (req.user.roles.includes('Super Admin')) {
      return next();
    }

    const hasRole = roles.some((r) => req.user.roles.includes(r));
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Anda memerlukan peran: ${roles.join(' / ')}`
      });
    }

    next();
  };
};

/**
 * Middleware untuk memastikan pengguna memiliki izin (Permission) untuk halaman Web UI Admin.
 */
export const requireWebPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect('/admin/login');
    }

    if (req.user.roles.includes('Super Admin')) {
      return next();
    }

    if (!req.user.permissions.includes(requiredPermission)) {
      return res.status(403).send(`
        <div style="font-family: sans-serif; text-align: center; padding: 60px;">
          <h1 style="color: #dc3545;">403 - Akses Ditolak</h1>
          <p>Anda tidak memiliki izin (<strong>${requiredPermission}</strong>) untuk mengakses halaman ini.</p>
          <a href="/admin" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #0d6efd; color: #fff; text-decoration: none; border-radius: 6px;">Kembali ke Dashboard</a>
        </div>
      `);
    }

    next();
  };
};
