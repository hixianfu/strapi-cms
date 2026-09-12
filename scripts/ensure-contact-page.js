'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');
const seed = require('../data/data.json');

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  try {
    const service = strapi.documents('api::contact-page.contact-page');
    const existing = await service.findFirst({ populate: '*' });
    if (existing) {
      if (!existing.publishedAt) {
        await service.publish({ documentId: existing.documentId });
        console.log('Contact page published');
      } else {
        console.log('Contact page already exists and is published');
      }
      return;
    }
    await service.create({ data: { ...seed.contactPage, publishedAt: new Date().toISOString() } });
    console.log('Contact page created and published');
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
