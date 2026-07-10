import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

// Public: Ambil semua artikel
export const getAllArticles = async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = { isPublished: true };

    if (category && category !== 'Semua') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } }
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar artikel.'
    });
  }
};

// Public: Ambil detail artikel by slug
export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await prisma.article.findUnique({
      where: { slug }
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan.'
      });
    }

    // Tambah views counter
    await prisma.article.update({
      where: { slug },
      data: { views: { increment: 1 } }
    });

    return res.json({
      success: true,
      data: article
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil artikel.'
    });
  }
};

// Admin (RBAC: articles.manage): Buat Artikel Baru
export const createArticle = async (req, res) => {
  try {
    const { title, category, excerpt, content, image } = req.body;

    if (!title || !category || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: 'Semua kolom utama wajib diisi.'
      });
    }

    let slug = slugify(title, { lower: true, strict: true });
    // Cek duplikasi slug
    const exists = await prisma.article.findUnique({ where: { slug } });
    if (exists) {
      slug = `${slug}-${Date.now()}`;
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        category,
        excerpt,
        content,
        image: image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
        author: req.user.name || 'Tim Editorial Alexa'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Artikel berhasil dibuat.',
      data: article
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal membuat artikel.'
    });
  }
};

// Admin (RBAC: articles.manage): Update Artikel
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, excerpt, content, image, isPublished } = req.body;

    const data = { title, category, excerpt, content, image, isPublished };

    if (title) {
      data.slug = slugify(title, { lower: true, strict: true });
    }

    const article = await prisma.article.update({
      where: { id },
      data
    });

    return res.json({
      success: true,
      message: 'Artikel berhasil diperbarui.',
      data: article
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui artikel.'
    });
  }
};

// Admin (RBAC: articles.manage): Hapus Artikel
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({ where: { id } });

    return res.json({
      success: true,
      message: 'Artikel berhasil dihapus.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus artikel.'
    });
  }
};
