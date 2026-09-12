'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');
const seed = require('../data/data.json');

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  try {
    const service = strapi.documents('api::about.about');
    const existing = await service.findFirst({ populate: '*' });
    if (existing) {
      if (!existing.publishedAt) {
        await service.publish({ documentId: existing.documentId });
        console.log('About page published');
      } else {
        console.log('About page already exists and is published');
      }
      return;
    }

    await service.create({ data: { ...seed.about, publishedAt: new Date().toISOString() } });
    console.log('About page created and published');
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
