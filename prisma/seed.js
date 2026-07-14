import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Mulai seeder database CMS & RBAC...');

  // 1. Buat Permissions
  const permissionsData = [
    { name: 'articles.manage', module: 'Articles', description: 'Kelola penuh Artikel Blog' },
    { name: 'services.manage', module: 'Services', description: 'Kelola Layanan, Paket Harga & Portfolio' },
    { name: 'frontend.manage', module: 'Frontend', description: 'Kelola Halaman & Konten Frontend' },
    { name: 'careers.manage', module: 'Careers', description: 'Kelola Lowongan Kerja' },
    { name: 'inquiries.manage', module: 'Inquiries', description: 'Lihat dan proses pesan masuk' },
    { name: 'users.manage', module: 'Users', description: 'Kelola akun pengguna admin' },
    { name: 'roles.manage', module: 'Roles', description: 'Kelola Role dan Permission RBAC' }
  ];

  const createdPermissions = [];
  for (const perm of permissionsData) {
    const p = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm
    });
    createdPermissions.push(p);
  }

  // 2. Buat Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      description: 'Akses penuh ke seluruh sistem dan konfigurasi admin'
    }
  });

  const contentEditorRole = await prisma.role.upsert({
    where: { name: 'Content Editor' },
    update: {},
    create: {
      name: 'Content Editor',
      description: 'Khusus mengelola konten website (Artikel, Layanan, Portofolio)'
    }
  });

  // 3. Hubungkan Permissions ke Super Admin (semua)
  for (const p of createdPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: p.id
        }
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: p.id
      }
    });
  }

  // Hubungkan Content Editor ke permissions konten
  const editorPermNames = ['articles.manage', 'services.manage', 'frontend.manage'];
  for (const name of editorPermNames) {
    const perm = createdPermissions.find(p => p.name === name);
    if (perm) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: contentEditorRole.id,
            permissionId: perm.id
          }
        },
        update: {},
        create: {
          roleId: contentEditorRole.id,
          permissionId: perm.id
        }
      });
    }
  }

  // 4. Buat Akun Super Admin default
  const hashedPw = await bcrypt.hash('admin123', 10);
  const superAdminUser = await prisma.user.upsert({
    where: { email: 'admin@alexagroup.co.id' },
    update: {},
    create: {
      name: 'Super Admin Alexa',
      email: 'admin@alexagroup.co.id',
      password: hashedPw,
      isActive: true
    }
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: superAdminUser.id,
        roleId: superAdminRole.id
      }
    },
    update: {},
    create: {
      userId: superAdminUser.id,
      roleId: superAdminRole.id
    }
  });

  // 5. Seeding Data Konten dari mockData.js Frontend
  console.log('📚 Seeding data awal konten website...');

  // Services
  const servicesData = [
    {
      id: 'mediakampung',
      title: 'MediaKampung',
      subtitle: 'Media Massa Digital',
      description: 'Platform media massa digital terdepan yang menyajikan berita terkini, aktual, dan terpercaya untuk masyarakat luas.',
      icon: 'FaRegNewspaper',
      color: '#3BAE7C'
    },
    {
      id: 'inetmedia',
      title: 'InetMedia',
      subtitle: 'Internet Service Provider',
      description: 'Layanan penyedia internet super cepat dan stabil untuk kebutuhan rumah tangga maupun korporasi bisnis Anda.',
      icon: 'FaWifi',
      color: '#3BAE7C'
    },
    {
      id: 'webmedia',
      title: 'WebMedia',
      subtitle: 'Website & Software',
      description: 'Solusi pembuatan website profesional dan pengembangan perangkat lunak custom untuk digitalisasi bisnis Anda.',
      icon: 'FaLaptopCode',
      color: '#3BAE7C'
    }
  ];

  for (const svc of servicesData) {
    await prisma.service.upsert({
      where: { id: svc.id },
      update: svc,
      create: svc
    });
  }

  // Clients
  const clientsData = [
    { name: 'Kodinger', image: 'https://www.google.com/s2/favicons?domain=kodinger.com&sz=128', order: 1 },
    { name: 'Awwwards', image: 'https://www.google.com/s2/favicons?domain=awwwards.com&sz=128', order: 2 },
    { name: 'Niagahoster', image: 'https://www.google.com/s2/favicons?domain=niagahoster.co.id&sz=128', order: 3 },
    { name: 'Dicoding', image: 'https://www.google.com/s2/favicons?domain=dicoding.com&sz=128', order: 4 },
    { name: 'Petani Kode', image: 'https://www.google.com/s2/favicons?domain=petanikode.com&sz=128', order: 5 },
    { name: 'W3Schools', image: 'https://www.google.com/s2/favicons?domain=w3schools.com&sz=128', order: 6 }
  ];

  for (const client of clientsData) {
    const existing = await prisma.client.findFirst({ where: { name: client.name } });
    if (!existing) {
      await prisma.client.create({ data: client });
    }
  }

  // Articles
  const sampleArticles = [
    {
      title: 'Pentingnya Transformasi Digital Bagi UMKM di Era Modern',
      slug: 'pentingnya-transformasi-digital-bagi-umkm',
      category: 'Teknologi',
      author: 'Tim Editorial MediaKampung',
      views: 4102,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
      excerpt: 'Transformasi digital bukan lagi sekadar pilihan, melainkan keharusan bagi UMKM untuk bertahan dan berkembang...',
      content: 'Transformasi digital telah mengubah lanskap bisnis global secara fundamental...'
    },
    {
      title: 'Memilih Layanan Internet Provider yang Tepat untuk Kantor',
      slug: 'memilih-layanan-internet-provider-kantor',
      category: 'Tips Jaringan',
      author: 'Network Engineer InetMedia',
      views: 8421,
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
      excerpt: 'Koneksi internet yang stabil adalah urat nadi operasional kantor modern...',
      content: 'Koneksi internet yang stabil adalah urat nadi operasional kantor modern...'
    }
  ];

  for (const art of sampleArticles) {
    await prisma.article.upsert({
      where: { slug: art.slug },
      update: {},
      create: art
    });
  }

  console.log('✅ Seeding selesai! Super Admin ready: admin@alexagroup.co.id / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
