import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Ambil semua Role beserta Permission-nya
export const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    });

    return res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar role.'
    });
  }
};

// Ambil semua Permissions
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: { module: 'asc' }
    });

    return res.json({
      success: true,
      data: permissions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar permission.'
    });
  }
};

// Update Permission pada Role
export const assignPermissionsToRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissionIds } = req.body; // Array of permission ID

    // Hapus relasi lama
    await prisma.rolePermission.deleteMany({
      where: { roleId }
    });

    // Tambah relasi baru
    if (Array.isArray(permissionIds) && permissionIds.length > 0) {
      const data = permissionIds.map((permId) => ({
        roleId,
        permissionId: permId
      }));
      await prisma.rolePermission.createMany({ data });
    }

    return res.json({
      success: true,
      message: 'Daftar permission pada role berhasil diperbarui.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui permission role.'
    });
  }
};

// Tambah Role Baru
export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama role wajib diisi.' });
    }

    const role = await prisma.role.create({
      data: { name, description }
    });

    return res.status(201).json({
      success: true,
      message: 'Role berhasil ditambahkan.',
      data: role
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menambahkan role.' });
  }
};

// Hapus Role
export const deleteRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    // Cegah penghapusan Super Admin
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role || role.name === 'Super Admin') {
      return res.status(400).json({ success: false, message: 'Role Super Admin tidak dapat dihapus.' });
    }

    await prisma.role.delete({ where: { id: roleId } });

    return res.json({
      success: true,
      message: 'Role berhasil dihapus.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus role.' });
  }
};
