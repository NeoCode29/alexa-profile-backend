import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Default data 100% presisi sesuai frontend React ./alexa-profile/frontend
export const defaultPages = {
  home: {
    heroTitleLine1: "Membangun Infrastruktur",
    heroTitleHighlight: "Digital Masa Depan",
    heroDesc: "PT. Alexa Computindo Group menyediakan solusi Media Digital, ISP Berkecepatan Tinggi, dan Arsitektur Perangkat Lunak untuk skala Enterprise.",
    ctaPrimaryText: "Eksplorasi Layanan",
    ctaPrimaryLink: "/services",
    ctaSecondaryText: "Pelajari Lebih Lanjut",
    ctaSecondaryLink: "/about",
    introTitle: "Fundamen Solid. Inovasi Tanpa Henti.",
    introDesc: "Didirikan sejak tahun 2018, kami telah bertransformasi dari pengembang perangkat lunak independen menjadi raksasa teknologi dengan tiga pilar utama. Kami tidak sekadar beradaptasi dengan perubahan digital; kami yang menciptakannya.",
    stat1Number: "8+",
    stat1Label: "Tahun Pengalaman",
    stat2Number: "99.9%",
    stat2Label: "Uptime Server",
    stat3Number: "200+",
    stat3Label: "Klien Enterprise",
    servicesSectionTitle: "Divisi Utama Kami",
    servicesSectionSubtitle: "Tiga pilar strategis yang menggerakkan ekosistem digital kami."
  },
  about: {
    heroTitle: "TENTANG KAMI",
    heroDesc: "PT. Alexa Computindo Group adalah entitas teknologi terintegrasi yang berfokus pada pembangunan infrastruktur digital korporat, penyediaan layanan internet berskala besar, dan media massa digital.",
    historyTitle: "Sejarah Perusahaan",
    historyPar1: "Berdiri pada tahun 2018, kami memulai langkah sebagai perusahaan pengembangan perangkat lunak yang melayani sektor korporat (B2B). Melihat kebutuhan infrastruktur yang terintegrasi, kami berekspansi secara agresif.",
    historyPar2: "Hingga kini, struktur grup kami menaungi tiga divisi utama yang beroperasi secara sinergis: MediaKampung (Media), InetMedia (ISP), dan WebMedia (Pengembangan Perangkat Lunak).",
    timelineList: [
      { year: '2018', title: 'PENDIRIAN WEBMEDIA', desc: 'Fokus awal pada arsitektur sistem informasi enterprise.' },
      { year: '2020', title: 'EKSPANSI INETMEDIA', desc: 'Memperoleh lisensi ISP nasional untuk infrastruktur jaringan.' },
      { year: '2023', title: 'AKUISISI MEDIAKAMPUNG', desc: 'Membentuk pilar media digital yang kuat.' }
    ],
    visionText: "Menjadi perusahaan teknologi dan media terdepan di Asia Tenggara yang memberikan dampak nyata melalui keandalan infrastruktur, inovasi perangkat lunak, dan jurnalisme berintegritas.",
    missionList: [
      "Menyediakan akses internet korporat berkecepatan tinggi dengan jaminan uptime 99.9%.",
      "Mengembangkan arsitektur perangkat lunak berskala enterprise yang aman dan efisien.",
      "Menyajikan informasi publik yang independen, edukatif, dan terpercaya melalui jaringan media."
    ]
  },
  services: {
    heroTitle: "Divisi & Layanan Kami",
    heroSubtitle: "Tiga pilar utama yang mendukung transformasi digital menyeluruh bagi perusahaan Anda.",
    sectionTitle: "Eksplorasi Divisi AG Group",
    sectionSubtitle: "Pilih divisi layanan di bawah ini untuk melihat deskripsi mendalam, spesifikasi paket harga, dan portofolio proyek.",
    testiSectionTitle: "Kata Klien Kami"
  },
  contact: {
    heroTitle: "HUBUNGI KAMI",
    heroSubtitle: "Jadwalkan konsultasi untuk kebutuhan transformasi digital perusahaan Anda.",
    addressTitle: "Kantor Pusat",
    addressText: "Jl. Teknologi No. 45\nJakarta Selatan, 12345, ID",
    phoneTitle: "Telepon",
    phoneText: "(021) 555-0198\n+62 811 2233 4455",
    emailTitle: "Email",
    emailText: "info@alexagroup.com\nsupport@alexagroup.com",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24040909062!2d106.75924765!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%20Selatan%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1689230504746!5m2!1sid!2sid"
  }
};

// GET /api/pages
export const getAllPagesContent = async (req, res) => {
  try {
    const rows = await prisma.pageContent.findMany();
    const result = { ...defaultPages };

    rows.forEach(row => {
      try {
        result[row.pageName] = { ...defaultPages[row.pageName], ...JSON.parse(row.content) };
      } catch (e) {}
    });

    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error getAllPagesContent:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data konten halaman'
    });
  }
};

// GET /api/pages/:pageName
export const getPageContent = async (req, res) => {
  try {
    const { pageName } = req.params;
    if (!defaultPages[pageName]) {
      return res.status(404).json({ success: false, message: 'Halaman tidak ditemukan' });
    }

    const row = await prisma.pageContent.findUnique({
      where: { pageName }
    });

    const contentData = row ? { ...defaultPages[pageName], ...JSON.parse(row.content) } : defaultPages[pageName];

    return res.json({
      success: true,
      data: contentData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil konten halaman'
    });
  }
};

// PUT /api/pages/:pageName (Admin only)
export const updatePageContent = async (req, res) => {
  try {
    const { pageName } = req.params;
    const { content } = req.body;

    if (!defaultPages[pageName]) {
      return res.status(404).json({ success: false, message: 'Halaman tidak ditemukan' });
    }

    const saved = await prisma.pageContent.upsert({
      where: { pageName },
      update: {
        content: typeof content === 'string' ? content : JSON.stringify(content)
      },
      create: {
        pageName,
        content: typeof content === 'string' ? content : JSON.stringify(content)
      }
    });

    return res.json({
      success: true,
      message: `Konten halaman ${pageName.toUpperCase()} berhasil diperbarui.`,
      data: JSON.parse(saved.content)
    });
  } catch (error) {
    console.error('Error updatePageContent:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui konten halaman'
    });
  }
};
