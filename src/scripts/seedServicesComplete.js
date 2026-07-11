import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultServices = [
  {
    id: 'webmedia',
    title: 'WebMedia',
    subtitle: 'Pengembangan Perangkat Lunak & Website Enterprise',
    description: 'Solusi pembuatan website profesional dan pengembangan perangkat lunak custom untuk digitalisasi bisnis Anda.',
    heroDesc: 'Kami merancang arsitektur sistem informasi, aplikasi web custom, dan platform digital berkecepatan tinggi dengan standar keamanan global untuk digitalisasi bisnis Anda.',
    fullDesc: 'Divisi WebMedia dari PT. Alexa Computindo Group berfokus pada rekayasa perangkat lunak skala enterprise. Kami tidak sekadar membuat website atau aplikasi template, melainkan membangun solusi digital custom dari nol yang dirancang khusus untuk alur kerja dan kebutuhan skalabilitas korporasi Anda.',
    icon: 'FaLaptopCode',
    color: '#3BAE7C',
    features: [
      'Custom Arsitektur Software Enterprise',
      'Keamanan Berlapis Anti-DDoS & ISO 27001',
      'SLA Support 99.9% & Monitoring 24/7',
      'Cloud & API Ready Integrasi ERP/CRM'
    ],
    portfolios: [
      { title: 'Sistem Informasi Akademik XYZ', category: 'WebMedia', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', desc: 'Portal akademik terintegrasi untuk 15.000+ mahasiswa aktif.' },
      { title: 'Website E-Commerce Fashion Korporat', category: 'WebMedia', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80', desc: 'Platform transaksi online dengan integrasi payment gateway real-time.' },
      { title: 'Dashboard ERP Manufaktur', category: 'WebMedia', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', desc: 'Sistem monitoring logistik dan produksi untuk pabrik multinasional.' }
    ],
    testimonials: [
      { name: 'Ahmad Faisal', company: 'Direktur PT. Maju Jaya', quote: 'Website dan sistem manajemen yang dibuat oleh tim WebMedia sangat profesional, mempercepat alur kerja internal kami hingga 40%.' },
      { name: 'Rina Setyawati', company: 'VP Digital Transformation', quote: 'Arsitektur sistem yang dibuat sangat stabil meskipun diakses ribuan pengguna secara bersamaan saat jam sibuk.' }
    ],
    packages: [
      { name: 'Standard', price: 'Rp 2.500.000', features: ['Custom Design UI/UX', 'Responsive Mobile & Tablet', 'Up to 5 Halaman', 'Free Domain & SSL 1 Thn', 'Support Teknis 3 Bulan'], isPopular: false },
      { name: 'Premium', price: 'Rp 5.500.000', features: ['Semua Fitur Standard', 'CMS Custom Enterprise', 'SEO & Core Web Vitals', 'Up to 15 Halaman', 'Support Teknis 1 Tahun'], isPopular: true },
      { name: 'Enterprise', price: 'Hubungi Kami', features: ['Aplikasi Web & Microservices', 'Integrasi API & Database', 'Sistem High-Availability', 'Server Dedicated / Cloud Setup', 'Prioritas SLA Support 24/7'], isPopular: false }
    ]
  },
  {
    id: 'inetmedia',
    title: 'InetMedia',
    subtitle: 'Internet Service Provider & Network Infrastructure',
    description: 'Layanan penyedia internet super cepat dan stabil untuk kebutuhan rumah tangga maupun korporasi bisnis Anda.',
    heroDesc: 'Layanan koneksi internet dedicated fiber optik super cepat, stabil, dan infrastruktur jaringan enterprise untuk menjamin produktivitas bisnis Anda tanpa henti.',
    fullDesc: 'InetMedia adalah penyedia layanan internet (ISP) berlisensi resmi yang menyediakan solusi konektivitas kelas bisnis. Kami memahami bahwa bagi korporasi modern, koneksi internet adalah urat nadi operasional. Oleh karena itu, kami menghadirkan infrastruktur fiber optik redundant dengan rasio bandwidth dedicated 1:1 serta jaminan Service Level Agreement (SLA) hingga 99.9%.',
    icon: 'FaWifi',
    color: '#3BAE7C',
    features: [
      'Bandwidth Dedicated 1:1 Simetris',
      'Infrastruktur Fiber Optik Redundant',
      'SLA Uptime Hingga 99.9%',
      'Dukungan On-Site Engineer 24/7'
    ],
    portfolios: [
      { title: 'Instalasi Jaringan Gedung Perkantoran', category: 'InetMedia', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80', desc: 'Pemasangan backbone fiber optik untuk gedung 25 lantai di Jakarta Selatan.' },
      { title: 'Infrastruktur Kawasan Industri', category: 'InetMedia', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80', desc: 'Konektivitas dedicated untuk 15 pabrik manufaktur di Jawa Barat.' },
      { title: 'Setup Server Room & Data Center', category: 'InetMedia', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80', desc: 'Perancangan rak server, cabling berstandar internasional, dan sistem power backup.' }
    ],
    testimonials: [
      { name: 'Budi Wibowo', company: 'IT Manager PT. Global Niaga', quote: 'Layanan internet dari InetMedia sangat stabil. Selama 3 tahun berlangganan, hampir tidak pernah mengalami gangguan berarti.' },
      { name: 'Hendra Gunawan', company: 'COO PT. Logistik Nusantara', quote: 'Bandwidth dedicated 1:1 benar-benar terasa saat kami harus sinkronisasi data gudang secara real-time ke server pusat.' }
    ],
    packages: [
      { name: 'SOHO Plan', price: 'Rp 350.000 / bln', features: ['Speed Up to 50 Mbps', 'Unlimited Quota FUP-Free', 'Router Wi-Fi 6 Gratis', 'Ideal untuk 5-10 Perangkat', 'Support Jam Kerja'], isPopular: false },
      { name: 'Business Pro', price: 'Rp 850.000 / bln', features: ['Speed Up to 150 Mbps', 'Unlimited Quota FUP-Free', '1 IP Public Statis Gratis', 'SLA Uptime 99.5%', 'Prioritas Support 24/7'], isPopular: true },
      { name: 'Corporate Dedicated', price: 'Mulai Rp 2.500.000', features: ['Bandwidth Dedicated 1:1 Simetris', 'Multiple IP Public Statis', 'MRTG Real-time Monitoring', 'SLA Uptime 99.9%', 'Dedicated Account Manager'], isPopular: false }
    ]
  },
  {
    id: 'mediakampung',
    title: 'MediaKampung',
    subtitle: 'Portal Media Massa Digital & Partnership Publikasi',
    description: 'Platform media massa digital terdepan yang menyajikan berita terkini, aktual, dan terpercaya untuk masyarakat luas.',
    heroDesc: 'Menyajikan berita terkini, investigasi mendalam, serta solusi advertorial dan kampanye komunikasi publik untuk membangun reputasi positif brand Anda.',
    fullDesc: 'MediaKampung adalah pilar media massa digital di bawah naungan PT. Alexa Computindo Group. Kami menjembatani arus informasi antara pusat perkotaan dan pelosok daerah dengan standar jurnalisme yang kredibel, faktual, dan berimbang.',
    icon: 'FaRegNewspaper',
    color: '#3BAE7C',
    features: [
      'Jurnalisme Faktual & Kredibel Berimbang',
      'Jangkauan Ratusan Ribu Audiens Daerah',
      'Layanan Advertorial & Liputan Bisnis',
      'Branding & Manajemen Reputasi Publik'
    ],
    portfolios: [
      { title: 'Portal Berita Daerah Berbasis AI', category: 'MediaKampung', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80', desc: 'Platform liputan daerah yang menjangkau 500.000 pembaca bulanan.' },
      { title: 'Kampanye Komunikasi Publik Pemkab', category: 'MediaKampung', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80', desc: 'Manajemen isu dan publikasi program pembangunan daerah.' },
      { title: 'Liputan Khusus & Advertorial Nasional', category: 'MediaKampung', image: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=600&q=80', desc: 'Branding korporat melalui artikel liputan dan wawancara direksi.' }
    ],
    testimonials: [
      { name: 'Drs. H. Santoso', company: 'Kepala Dinas Kominfo', quote: 'Publikasi melalui MediaKampung sangat efektif menjangkau masyarakat hingga ke tingkat desa secara transparan.' },
      { name: 'Maya Kartika', company: 'Brand Manager PT. Niaga', quote: 'Artikel liputan yang disusun sangat tajam dan berhasil mendongkrak citra positif brand kami.' }
    ],
    packages: [
      { name: 'Liputan Reguler', price: 'Rp 1.500.000', features: ['1 Artikel Berita Eksklusif', 'Penyuntingan Profesional', 'Tayang Permanen', 'Distribusi Media Sosial'], isPopular: false },
      { name: 'Corporate Campaign', price: 'Rp 4.500.000', features: ['3 Artikel Liputan Khusus', 'Wawancara Eksklusif Manajemen', 'Featured Headline 7 Hari', 'Laporan Analitik Jangkauan'], isPopular: true },
      { name: 'Tahunan & Media Partner', price: 'Hubungi Kami', features: ['Publikasi Kegiatan Rutin', 'Banner Ads Eksklusif', 'Dukungan Liputan Event', 'Dedicated Journalist Contact'], isPopular: false }
    ]
  }
];

async function main() {
  console.log('Seeding complete default services, portfolios & testimonials into database...');

  for (const svc of defaultServices) {
    await prisma.service.upsert({
      where: { id: svc.id },
      update: {
        title: svc.title,
        subtitle: svc.subtitle,
        description: svc.description,
        heroDesc: svc.heroDesc,
        fullDesc: svc.fullDesc,
        icon: svc.icon,
        color: svc.color,
        features: JSON.stringify(svc.features),
        portfolios: JSON.stringify(svc.portfolios),
        testimonials: JSON.stringify(svc.testimonials)
      },
      create: {
        id: svc.id,
        title: svc.title,
        subtitle: svc.subtitle,
        description: svc.description,
        heroDesc: svc.heroDesc,
        fullDesc: svc.fullDesc,
        icon: svc.icon,
        color: svc.color,
        features: JSON.stringify(svc.features),
        portfolios: JSON.stringify(svc.portfolios),
        testimonials: JSON.stringify(svc.testimonials)
      }
    });
  }

  console.log('Seeding portfolios & testimonials completed successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
