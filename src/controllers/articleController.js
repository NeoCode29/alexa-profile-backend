import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

// Public: Ambil semua artikel (atau semua termasuk draf jika all=true)
export const getAllArticles = async (req, res) => {
  try {
    const { category, search, all } = req.query;
    const where = {};

    if (all !== 'true' && all !== true) {
      where.isPublished = true;
    }

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

// Public & Admin: Ambil detail artikel by slug atau ID
export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let article = await prisma.article.findUnique({
      where: { slug }
    });

    if (!article) {
      article = await prisma.article.findUnique({
        where: { id: slug }
      });
    }

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan.'
      });
    }

    // View counter dipindah ke endpoint terpisah (POST) agar tidak double-count
    // karena React StrictMode atau refresh berulang.

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

// Public: Tambah view counter artikel
export const incrementArticleView = async (req, res) => {
  try {
    const { slug } = req.params;
    let article = await prisma.article.findUnique({ where: { slug } });
    if (!article) {
      article = await prisma.article.findUnique({ where: { id: slug } });
    }
    
    if (article) {
      await prisma.article.update({
        where: { id: article.id },
        data: { views: { increment: 1 } }
      });
    }
    
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

// Admin (RBAC: articles.manage): Buat Artikel Baru
export const createArticle = async (req, res) => {
  try {
    const { title, category, excerpt, content, image, author, metaTitle, metaDescription, metaKeywords } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({
        success: false,
        message: 'Judul, Kategori, dan Isi Artikel wajib diisi.'
      });
    }

    const textContent = content.replace(/<[^>]*>?/gm, '').trim();
    const finalExcerpt = excerpt || (textContent.length > 180 ? textContent.substring(0, 177) + '...' : textContent);

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
        excerpt: finalExcerpt,
        content,
        image: image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
        author: author || req.user.name || 'Tim Editorial Alexa',
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        metaKeywords: metaKeywords || null
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
    const { title, slug, category, author, excerpt, content, image, isPublished, views, metaTitle, metaDescription, metaKeywords } = req.body;

    const data = {};
    if (title !== undefined) data.title = title;
    if (category !== undefined) data.category = category;
    if (author !== undefined) data.author = author;
    if (content !== undefined) {
      data.content = content;
      if (excerpt !== undefined && excerpt.trim() !== '') {
        data.excerpt = excerpt;
      } else {
        const textContent = content.replace(/<[^>]*>?/gm, '').trim();
        data.excerpt = textContent.length > 180 ? textContent.substring(0, 177) + '...' : textContent;
      }
    } else if (excerpt !== undefined) {
      data.excerpt = excerpt;
    }
    if (image !== undefined) data.image = image;
    if (isPublished !== undefined) data.isPublished = Boolean(isPublished);
    if (views !== undefined) data.views = Number(views);
    if (metaTitle !== undefined) data.metaTitle = metaTitle;
    if (metaDescription !== undefined) data.metaDescription = metaDescription;
    if (metaKeywords !== undefined) data.metaKeywords = metaKeywords;

    if (slug) {
      let targetSlug = slugify(slug, { lower: true, strict: true });
      const existingSlug = await prisma.article.findFirst({
        where: {
          slug: targetSlug,
          NOT: { id }
        }
      });
      if (existingSlug) {
        targetSlug = `${targetSlug}-${Date.now()}`;
      }
      data.slug = targetSlug;
    } else if (title) {
      let targetSlug = slugify(title, { lower: true, strict: true });
      const existingSlug = await prisma.article.findFirst({
        where: {
          slug: targetSlug,
          NOT: { id }
        }
      });
      if (existingSlug) {
        targetSlug = `${targetSlug}-${Date.now()}`;
      }
      data.slug = targetSlug;
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
