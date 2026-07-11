import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Render Login Page
export const renderLogin = (req, res) => {
  res.render('admin/login', { layout: false });
};

// Render Dashboard Page
export const renderDashboard = async (req, res) => {
  try {
    const totalArticles = await prisma.article.count();
    const totalServices = await prisma.service.count();
    const totalInquiries = await prisma.inquiry.count({ where: { status: 'NEW' } });
    const totalClients = await prisma.client.count();

    const recentArticles = await prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    const recentInquiries = await prisma.inquiry.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' }
    });

    res.render('admin/dashboard', {
      title: 'Dashboard',
      activeMenu: 'dashboard',
      stats: {
        totalArticles,
        totalServices,
        totalInquiries,
        totalClients
      },
      recentArticles,
      recentInquiries
    });
  } catch (error) {
    res.status(500).send('Gagal memuat dashboard');
  }
};

// Render Articles Page
export const renderArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.render('admin/articles', {
      title: 'Manajemen Artikel',
      activeMenu: 'articles',
      articles
    });
  } catch (error) {
    res.status(500).send('Gagal memuat halaman artikel');
  }
};

// Render Article Dedicated Detail Admin Page
export const renderArticleDetailAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    let article = await prisma.article.findUnique({
      where: { id }
    });

    if (!article) {
      article = await prisma.article.findUnique({
        where: { slug: id }
      });
    }

    if (!article) {
      return res.redirect('/admin/articles');
    }

    res.render('admin/articleDetail', {
      title: `Kelola Artikel: ${article.title}`,
      activeMenu: 'articles',
      article
    });
  } catch (error) {
    res.status(500).send('Gagal memuat halaman detail artikel');
  }
};

// Render Services Page
export const renderServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: { packages: true }
    });

    res.render('admin/services', {
      title: 'Manajemen Layanan',
      activeMenu: 'services',
      services
    });
  } catch (error) {
    res.status(500).send('Gagal memuat halaman layanan');
  }
};

// Render Service Dedicated Detail Admin Page
export const renderServiceDetailAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id },
      include: { packages: true }
    });

    if (!service) {
      return res.redirect('/admin/services');
    }

    let features = [];
    let portfolios = [];
    let testimonials = [];
    try { features = typeof service.features === 'string' ? JSON.parse(service.features) : (service.features || []); } catch (e) {}
    try { portfolios = typeof service.portfolios === 'string' ? JSON.parse(service.portfolios) : (service.portfolios || []); } catch (e) {}
    try { testimonials = typeof service.testimonials === 'string' ? JSON.parse(service.testimonials) : (service.testimonials || []); } catch (e) {}

    res.render('admin/serviceDetail', {
      title: `Kelola Divisi: ${service.title}`,
      activeMenu: 'services',
      service,
      features,
      portfolios,
      testimonials
    });
  } catch (error) {
    res.status(500).send('Gagal memuat halaman detail layanan');
  }
};

// Render Inquiries Page
export const renderInquiries = async (req, res) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.render('admin/inquiries', {
      title: 'Kotak Pesan Kontak',
      activeMenu: 'inquiries',
      inquiries
    });
  } catch (error) {
    res.status(500).send('Gagal memuat halaman pesan masuk');
  }
};

// Render Roles & Permission Page
export const renderRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: { include: { permission: true } }
      }
    });

    const permissions = await prisma.permission.findMany({
      orderBy: { module: 'asc' }
    });

    res.render('admin/roles', {
      title: 'Role & Permission (RBAC)',
      activeMenu: 'roles',
      roles,
      permissions
    });
  } catch (error) {
    res.status(500).send('Gagal memuat halaman role');
  }
};

// Render Users Page
export const renderUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        roles: { include: { role: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const roles = await prisma.role.findMany();

    res.render('admin/users', {
      title: 'Manajemen Pengguna Admin',
      activeMenu: 'users',
      users,
      roles
    });
  } catch (error) {
    res.status(500).send('Gagal memuat halaman pengguna admin');
  }
};

// Render Clients Page
export const renderClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { order: 'asc' }
    });
    res.render('admin/clients', {
      title: 'Manajemen Klien & Mitra',
      activeMenu: 'clients',
      clients
    });
  } catch (error) {
    res.status(500).send('Gagal memuat halaman klien');
  }
};

// Render Pages Content Manager
export const renderPages = async (req, res) => {
  try {
    const { getAllPagesMergedData } = await import('./pageContentController.js');
    const pagesData = await getAllPagesMergedData();

    res.render('admin/pages', {
      title: 'Pengaturan Halaman Frontend',
      activeMenu: 'pages',
      pagesData
    });
  } catch (error) {
    res.status(500).send('Gagal memuat halaman pengaturan konten');
  }
};

// Render Profile Page
export const renderProfile = async (req, res) => {
  try {
    const userDetail = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    res.render('admin/profile', {
      title: 'Profil Saya & Keamanan',
      activeMenu: 'profile',
      userDetail
    });
  } catch (error) {
    res.status(500).send('Gagal memuat halaman profil');
  }
};

