'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');
const pages = {
  zh: {
    contentLocale: 'zh',
    title: '联系我们',
    intro: '无论您正在规划什么项目，我们的团队都会为您提供合适的包装解决方案。',
    address: '中国厦门市集美区坑坪路66号',
    phone: '+86 592 5538744',
    email: 'sales@amesonpak.com',
    officeHours: '周一至周五 09:00-18:00（北京时间）',
    formTitle: '开始沟通',
    formIntro: '请留下您的需求，我们会尽快安排专业人员与您联系。',
  },
  en: {
    contentLocale: 'en',
    title: 'Let us solve the hard part together',
    intro: 'Tell us what you are building, improving, or trying to understand. Our team will respond within one business day.',
    address: 'No. 66 Kengping Road, Xiamen, China',
    phone: '+86 592 5538744',
    email: 'sales@amesonpak.com',
    officeHours: 'Monday-Friday, 09:00-18:00 (CST)',
    formTitle: 'Start a conversation',
    formIntro: 'Share a few details and we will route your message to the right specialist.',
  },
};

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  try {
    const service = strapi.documents('api::contact-page.contact-page');
    for (const [locale, data] of Object.entries(pages)) {
      const existing = await service.findFirst({ filters: { contentLocale: locale } });
      if (existing) {
        if (!existing.publishedAt) await service.publish({ documentId: existing.documentId });
        console.log(`Contact page already exists: ${locale}`);
        continue;
      }
      const created = await service.create({ data: { ...data, publishedAt: new Date().toISOString() } });
      await service.publish({ documentId: created.documentId });
      console.log(`Contact page created and published: ${locale}`);
    }
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
