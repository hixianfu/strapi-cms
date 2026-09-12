'use strict';
const { createStrapi, compileStrapi } = require('@strapi/strapi');
const pages = {
  about: { en: { title: 'About Ameson Packaging' }, zh: { title: '关于 Ameson Packaging' } },
  contact: { en: { title: 'Let us solve the hard part together', intro: 'Tell us what you are building, improving, or trying to understand. Our team will respond within one business day.', formTitle: 'Start a conversation', formIntro: 'Share a few details and we will route your message to the right specialist.' }, zh: { title: '让我们一起解决难题', intro: '告诉我们您正在构建、改进或希望了解的内容。我们的团队将在一个工作日内回复。', formTitle: '开始沟通', formIntro: '请分享一些需求细节，我们会将您的信息转给合适的专业团队。' } },
};
async function main() { const ctx = await compileStrapi(); const app = await createStrapi(ctx).load(); try { for (const [type, locales] of Object.entries(pages)) { const uid = type === 'about' ? 'api::about.about' : 'api::contact-page.contact-page'; for (const [locale, data] of Object.entries(locales)) { const found = await strapi.documents(uid).findFirst({ filters: { contentLocale: locale } }); if (found) { console.log(`Skipped ${type}:${locale}`); continue; } const created = await strapi.documents(uid).create({ data: { ...data, contentLocale: locale, publishedAt: new Date().toISOString() } }); await strapi.documents(uid).publish({ documentId: created.documentId }); console.log(`Created ${type}:${locale}`); } } } finally { await app.destroy(); } }
main().catch((error) => { console.error(error); process.exitCode = 1; });
