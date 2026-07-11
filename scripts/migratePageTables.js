import { PrismaClient } from '@prisma/client';
import { defaultPages } from '../src/controllers/pageContentController.js';

const prisma = new PrismaClient();

async function run() {
  console.log('Migrating default content into dedicated per-page tables...');

  // 1. Home
  const home = defaultPages.home;
  await prisma.pageHome.upsert({
    where: { id: 'home' },
    update: home,
    create: { id: 'home', ...home }
  });
  console.log('✔ PageHome seeded.');

  // 2. About
  const about = defaultPages.about;
  await prisma.pageAbout.upsert({
    where: { id: 'about' },
    update: {
      seoTitle: about.seoTitle,
      seoDescription: about.seoDescription,
      seoKeywords: about.seoKeywords,
      seoOgImage: about.seoOgImage,
      heroTitle: about.heroTitle,
      heroDesc: about.heroDesc,
      historyTitle: about.historyTitle,
      historyContent: about.historyContent,
      historyPar1: about.historyPar1,
      historyPar2: about.historyPar2,
      timelineList: JSON.stringify(about.timelineList),
      teamSectionTitle: about.teamSectionTitle,
      teamList: JSON.stringify(about.teamList),
      visionText: about.visionText,
      missionList: JSON.stringify(about.missionList)
    },
    create: {
      id: 'about',
      seoTitle: about.seoTitle,
      seoDescription: about.seoDescription,
      seoKeywords: about.seoKeywords,
      seoOgImage: about.seoOgImage,
      heroTitle: about.heroTitle,
      heroDesc: about.heroDesc,
      historyTitle: about.historyTitle,
      historyContent: about.historyContent,
      historyPar1: about.historyPar1,
      historyPar2: about.historyPar2,
      timelineList: JSON.stringify(about.timelineList),
      teamSectionTitle: about.teamSectionTitle,
      teamList: JSON.stringify(about.teamList),
      visionText: about.visionText,
      missionList: JSON.stringify(about.missionList)
    }
  });
  console.log('✔ PageAbout seeded.');

  // 3. Services
  const services = defaultPages.services;
  await prisma.pageServices.upsert({
    where: { id: 'services' },
    update: services,
    create: { id: 'services', ...services }
  });
  console.log('✔ PageServices seeded.');

  // 4. Contact
  const contact = defaultPages.contact;
  await prisma.pageContact.upsert({
    where: { id: 'contact' },
    update: {
      seoTitle: contact.seoTitle,
      seoDescription: contact.seoDescription,
      seoKeywords: contact.seoKeywords,
      seoOgImage: contact.seoOgImage,
      heroTitle: contact.heroTitle,
      heroSubtitle: contact.heroSubtitle,
      addressTitle: contact.addressTitle,
      addressText: contact.addressText,
      phoneTitle: contact.phoneTitle,
      phoneText: contact.phoneText,
      emailTitle: contact.emailTitle,
      emailText: contact.emailText,
      mapEmbedUrl: contact.mapEmbedUrl,
      faqTitle: contact.faqTitle,
      faqSubtitle: contact.faqSubtitle,
      faqList: JSON.stringify(contact.faqList)
    },
    create: {
      id: 'contact',
      seoTitle: contact.seoTitle,
      seoDescription: contact.seoDescription,
      seoKeywords: contact.seoKeywords,
      seoOgImage: contact.seoOgImage,
      heroTitle: contact.heroTitle,
      heroSubtitle: contact.heroSubtitle,
      addressTitle: contact.addressTitle,
      addressText: contact.addressText,
      phoneTitle: contact.phoneTitle,
      phoneText: contact.phoneText,
      emailTitle: contact.emailTitle,
      emailText: contact.emailText,
      mapEmbedUrl: contact.mapEmbedUrl,
      faqTitle: contact.faqTitle,
      faqSubtitle: contact.faqSubtitle,
      faqList: JSON.stringify(contact.faqList)
    }
  });
  console.log('✔ PageContact seeded.');

  await prisma.$disconnect();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
