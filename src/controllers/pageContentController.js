import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Default data 100% presisi sesuai frontend React ./alexa-profile/frontend
export const defaultPages = {
  home: {
    seoTitle: "Beranda — PT. Alexa Computindo Group | Infrastruktur & Solusi Digital",
    seoDescription: "PT. Alexa Computindo Group menyediakan solusi Media Digital, ISP Berkecepatan Tinggi, dan Arsitektur Perangkat Lunak untuk skala Enterprise di Indonesia.",
    seoKeywords: "alexa computindo, solusi IT enterprise, ISP berkecepatan tinggi, pengembangan software, media digital indonesia",
    seoOgImage: "/assets/img/og-home.png",
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
    servicesSectionSubtitle: "Tiga pilar strategis yang menggerakkan ekosistem digital kami.",
    clientsSectionTitle: "DIPERCAYA OLEH PERUSAHAAN TERKEMUKA",
    articlesSectionTitle: "Berita & Insight"
  },
  about: {
    seoTitle: "Tentang Kami — PT. Alexa Computindo Group",
    seoDescription: "Pelajari sejarah, visi, misi, dan perjalanan transformasi PT. Alexa Computindo Group sebagai entitas teknologi terintegrasi di Asia Tenggara.",
    seoKeywords: "tentang alexa computindo, sejarah perusahaan IT, visi misi alexa group, profil korporat",
    seoOgImage: "/assets/img/og-about.png",
    heroTitle: "TENTANG KAMI",
    heroDesc: "PT. Alexa Computindo Group adalah entitas teknologi terintegrasi yang berfokus pada pembangunan infrastruktur digital korporat, penyediaan layanan internet berskala besar, dan media massa digital.",
    historyTitle: "Sejarah Perusahaan",
    historyContent: "<p>Berdiri pada tahun 2018, kami memulai langkah sebagai perusahaan pengembangan perangkat lunak yang melayani sektor korporat (B2B). Melihat kebutuhan infrastruktur yang terintegrasi, kami berekspansi secara agresif.</p><p>Hingga kini, struktur grup kami menaungi tiga divisi utama yang beroperasi secara sinergis: <strong>MediaKampung</strong> (Media), <strong>InetMedia</strong> (ISP), dan <strong>WebMedia</strong> (Pengembangan Perangkat Lunak).</p>",
    historyPar1: "Berdiri pada tahun 2018, kami memulai langkah sebagai perusahaan pengembangan perangkat lunak yang melayani sektor korporat (B2B). Melihat kebutuhan infrastruktur yang terintegrasi, kami berekspansi secara agresif.",
    historyPar2: "",
    timelineList: [
      { year: '2018', title: 'PENDIRIAN WEBMEDIA', desc: 'Fokus awal pada arsitektur sistem informasi enterprise.' },
      { year: '2020', title: 'EKSPANSI INETMEDIA', desc: 'Memperoleh lisensi ISP nasional untuk infrastruktur jaringan.' },
      { year: '2023', title: 'AKUISISI MEDIAKAMPUNG', desc: 'Membentuk pilar media digital yang kuat.' }
    ],
    teamSectionTitle: "MANAJEMEN INTI",
    teamList: [
      { name: 'Budi Santoso', role: 'Chief Executive Officer', bio: 'Berpengalaman 15 tahun di industri IT dan manajemen strategis.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
      { name: 'Siti Aminah', role: 'Chief Operating Officer', bio: 'Ahli dalam operasional bisnis dan pengembangan produk digital.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
      { name: 'Andi Pratama', role: 'CTO / Head of Engineering', bio: 'Pakar arsitektur cloud, keamanan siber, dan jaringan berskala besar.', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80' }
    ],
    visionText: "Menjadi perusahaan teknologi dan media terdepan di Asia Tenggara yang memberikan dampak nyata melalui keandalan infrastruktur, inovasi perangkat lunak, dan jurnalisme berintegritas.",
    missionList: [
      "Menyediakan akses internet korporat berkecepatan tinggi dengan jaminan uptime 99.9%.",
      "Mengembangkan arsitektur perangkat lunak berskala enterprise yang aman dan efisien.",
      "Menyajikan informasi publik yang independen, edukatif, dan terpercaya melalui jaringan media."
    ]
  },
  services: {
    seoTitle: "Layanan & Divisi — PT. Alexa Computindo Group",
    seoDescription: "Eksplorasi layanan lengkap dari tiga divisi utama: WebMedia (Software Development), InetMedia (ISP Network), dan MediaKampung (Media Digital).",
    seoKeywords: "layanan alexa computindo, webmedia software, inetmedia isp, mediakampung, solusi digital korporat",
    seoOgImage: "/assets/img/og-services.png",
    heroTitle: "Divisi & Layanan Kami",
    heroSubtitle: "Tiga pilar utama yang mendukung transformasi digital menyeluruh bagi perusahaan Anda.",
    sectionTitle: "Eksplorasi Divisi AG Group",
    sectionSubtitle: "Pilih divisi layanan di bawah ini untuk melihat deskripsi mendalam, spesifikasi paket harga, dan portofolio proyek.",
    testiSectionTitle: "Kata Klien Kami"
  },
  contact: {
    seoTitle: "Hubungi Kami — PT. Alexa Computindo Group",
    seoDescription: "Jadwalkan konsultasi atau hubungi tim PT. Alexa Computindo Group untuk solusi transformasi digital dan kebutuhan infrastruktur IT perusahaan Anda.",
    seoKeywords: "kontak alexa computindo, alamat alexa group, konsultasi IT, customer service alexa",
    seoOgImage: "/assets/img/og-contact.png",
    heroTitle: "HUBUNGI KAMI",
    heroSubtitle: "Jadwalkan konsultasi untuk kebutuhan transformasi digital perusahaan Anda.",
    addressTitle: "Kantor Pusat",
    addressText: "Jl. Teknologi No. 45\nJakarta Selatan, 12345, ID",
    phoneTitle: "Telepon",
    phoneText: "(021) 555-0198\n+62 811 2233 4455",
    emailTitle: "Email",
    emailText: "info@alexagroup.com\nsupport@alexagroup.com",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24040909062!2d106.75924765!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%20Selatan%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1689230504746!5m2!1sid!2sid",
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Pertanyaan umum mengenai layanan korporat kami.",
    faqList: [
      {
        q: 'Dimana lokasi operasional PT. Alexa Computindo Group?',
        a: 'Kantor pusat kami berlokasi di Jl. Teknologi No. 45, Jakarta Selatan. Kami melayani kunjungan klien enterprise pada hari kerja (Senin - Jumat), pukul 09:00 - 17:00 WIB.'
      },
      {
        q: 'Apakah layanan pengembangan software (WebMedia) termasuk maintenance?',
        a: 'Ya, seluruh proyek perangkat lunak dari WebMedia memiliki SLA dan masa maintenance mulai dari 3 hingga 12 bulan, yang dapat diperpanjang melalui kontrak support enterprise.'
      },
      {
        q: 'Berapa lama proses pemasangan internet corporate InetMedia?',
        a: 'Proses survei, penarikan kabel fiber optik, dan aktivasi internet khusus corporate rata-rata memakan waktu 3-5 hari kerja setelah SPK disetujui.'
      }
    ]
  }
};

// Helper untuk memuat data dari tabel khusus per halaman (PageHome, PageAbout, PageServices, PageContact)
const loadFromPageTable = async (pageName) => {
  try {
    let row = null;
    if (pageName === 'home') {
      row = await prisma.pageHome.findUnique({ where: { id: 'home' } });
    } else if (pageName === 'about') {
      row = await prisma.pageAbout.findUnique({ where: { id: 'about' } });
    } else if (pageName === 'services') {
      row = await prisma.pageServices.findUnique({ where: { id: 'services' } });
    } else if (pageName === 'contact') {
      row = await prisma.pageContact.findUnique({ where: { id: 'contact' } });
    }
    if (!row) return null;

    const cleanObj = {};
    for (const [key, val] of Object.entries(row)) {
      if (key === 'id' || key === 'updatedAt') continue;
      if (val !== null && val !== undefined) {
        if (['timelineList', 'teamList', 'missionList', 'faqList'].includes(key)) {
          try {
            cleanObj[key] = typeof val === 'string' ? JSON.parse(val) : val;
          } catch (e) {
            cleanObj[key] = val;
          }
        } else {
          cleanObj[key] = val;
        }
      }
    }
    return Object.keys(cleanObj).length > 0 ? cleanObj : null;
  } catch (err) {
    console.error(`Error loading from specific table Page${pageName}:`, err);
    return null;
  }
};

// Helper untuk menyimpan data ke tabel khusus per halaman
const saveToPageTable = async (pageName, mergedData) => {
  try {
    if (pageName === 'home') {
      const payload = {
        seoTitle: mergedData.seoTitle,
        seoDescription: mergedData.seoDescription,
        seoKeywords: mergedData.seoKeywords,
        seoOgImage: mergedData.seoOgImage,
        heroTitleLine1: mergedData.heroTitleLine1,
        heroTitleHighlight: mergedData.heroTitleHighlight,
        heroDesc: mergedData.heroDesc,
        ctaPrimaryText: mergedData.ctaPrimaryText,
        ctaPrimaryLink: mergedData.ctaPrimaryLink,
        ctaSecondaryText: mergedData.ctaSecondaryText,
        ctaSecondaryLink: mergedData.ctaSecondaryLink,
        introTitle: mergedData.introTitle,
        introDesc: mergedData.introDesc,
        stat1Number: mergedData.stat1Number,
        stat1Label: mergedData.stat1Label,
        stat2Number: mergedData.stat2Number,
        stat2Label: mergedData.stat2Label,
        stat3Number: mergedData.stat3Number,
        stat3Label: mergedData.stat3Label,
        servicesSectionTitle: mergedData.servicesSectionTitle,
        servicesSectionSubtitle: mergedData.servicesSectionSubtitle,
        clientsSectionTitle: mergedData.clientsSectionTitle,
        articlesSectionTitle: mergedData.articlesSectionTitle
      };
      await prisma.pageHome.upsert({
        where: { id: 'home' },
        update: payload,
        create: { id: 'home', ...payload }
      });
    } else if (pageName === 'about') {
      const payload = {
        seoTitle: mergedData.seoTitle,
        seoDescription: mergedData.seoDescription,
        seoKeywords: mergedData.seoKeywords,
        seoOgImage: mergedData.seoOgImage,
        heroTitle: mergedData.heroTitle,
        heroDesc: mergedData.heroDesc,
        historyTitle: mergedData.historyTitle,
        historyContent: mergedData.historyContent,
        historyPar1: mergedData.historyPar1,
        historyPar2: mergedData.historyPar2,
        timelineList: typeof mergedData.timelineList === 'object' ? JSON.stringify(mergedData.timelineList) : mergedData.timelineList,
        teamSectionTitle: mergedData.teamSectionTitle,
        teamList: typeof mergedData.teamList === 'object' ? JSON.stringify(mergedData.teamList) : mergedData.teamList,
        visionText: mergedData.visionText,
        missionList: typeof mergedData.missionList === 'object' ? JSON.stringify(mergedData.missionList) : mergedData.missionList
      };
      await prisma.pageAbout.upsert({
        where: { id: 'about' },
        update: payload,
        create: { id: 'about', ...payload }
      });
    } else if (pageName === 'services') {
      const payload = {
        seoTitle: mergedData.seoTitle,
        seoDescription: mergedData.seoDescription,
        seoKeywords: mergedData.seoKeywords,
        seoOgImage: mergedData.seoOgImage,
        heroTitle: mergedData.heroTitle,
        heroSubtitle: mergedData.heroSubtitle,
        sectionTitle: mergedData.sectionTitle,
        sectionSubtitle: mergedData.sectionSubtitle,
        testiSectionTitle: mergedData.testiSectionTitle
      };
      await prisma.pageServices.upsert({
        where: { id: 'services' },
        update: payload,
        create: { id: 'services', ...payload }
      });
    } else if (pageName === 'contact') {
      const payload = {
        seoTitle: mergedData.seoTitle,
        seoDescription: mergedData.seoDescription,
        seoKeywords: mergedData.seoKeywords,
        seoOgImage: mergedData.seoOgImage,
        heroTitle: mergedData.heroTitle,
        heroSubtitle: mergedData.heroSubtitle,
        addressTitle: mergedData.addressTitle,
        addressText: mergedData.addressText,
        phoneTitle: mergedData.phoneTitle,
        phoneText: mergedData.phoneText,
        emailTitle: mergedData.emailTitle,
        emailText: mergedData.emailText,
        mapEmbedUrl: mergedData.mapEmbedUrl,
        faqTitle: mergedData.faqTitle,
        faqSubtitle: mergedData.faqSubtitle,
        faqList: typeof mergedData.faqList === 'object' ? JSON.stringify(mergedData.faqList) : mergedData.faqList
      };
      await prisma.pageContact.upsert({
        where: { id: 'contact' },
        update: payload,
        create: { id: 'contact', ...payload }
      });
    }
  } catch (err) {
    console.error(`Error saving to specific table Page${pageName}:`, err);
  }
};

// Mendapatkan data gabungan untuk satu halaman dari tabel khusus / fallback
export const getPageMergedData = async (pageName) => {
  const baseDefault = defaultPages[pageName] || {};
  // 1. Coba dari tabel khusus per halaman (PageHome, PageAbout, dst.)
  const tableData = await loadFromPageTable(pageName);
  if (tableData) {
    return { ...baseDefault, ...tableData };
  }
  // 2. Fallback ke tabel PageContent
  const row = await prisma.pageContent.findUnique({ where: { pageName } });
  if (row) {
    try {
      return { ...baseDefault, ...JSON.parse(row.content) };
    } catch (e) {}
  }
  return { ...baseDefault };
};

// Mendapatkan data gabungan untuk seluruh halaman
export const getAllPagesMergedData = async () => {
  const result = {};
  for (const pName of Object.keys(defaultPages)) {
    result[pName] = await getPageMergedData(pName);
  }
  return result;
};

// GET /api/pages
export const getAllPagesContent = async (req, res) => {
  try {
    const result = await getAllPagesMergedData();
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

    const contentData = await getPageMergedData(pageName);

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

    const existingData = await getPageMergedData(pageName);
    const incomingData = typeof content === 'string' ? JSON.parse(content) : content;
    const mergedData = { ...existingData, ...incomingData };

    // 1. Simpan ke Tabel Khusus per halaman (PageHome, PageAbout, PageServices, PageContact)
    await saveToPageTable(pageName, mergedData);

    // 2. Simpan juga ke PageContent (JSON) untuk backwards compatibility
    const mergedContentStr = JSON.stringify(mergedData);
    await prisma.pageContent.upsert({
      where: { pageName },
      update: { content: mergedContentStr },
      create: { pageName, content: mergedContentStr }
    });

    return res.json({
      success: true,
      message: `Konten halaman ${pageName.toUpperCase()} berhasil diperbarui pada tabel khusus halaman.`,
      data: mergedData
    });
  } catch (error) {
    console.error('Error updatePageContent:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui konten halaman'
    });
  }
};
