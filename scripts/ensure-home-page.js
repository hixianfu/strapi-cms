'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');
const seed = require('../data/data.json');

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  try {
    const existing = await strapi.documents('api::home-page.home-page').findFirst({ populate: '*' });
    if (existing) {
      if (!existing.publishedAt) {
        await strapi.documents('api::home-page.home-page').publish({ documentId: existing.documentId });
        console.log('Home page published');
      } else {
        console.log('Home page already exists and is published');
      }
      return;
    }

    const slides = [];
    for (const slide of seed.homePage.heroSlides || []) {
      const file = await strapi.query('plugin::upload.file').findOne({ where: { name: slide.image.replace(/\..*$/, '') } });
      if (!file) throw new Error(`Missing uploaded image: ${slide.image}`);
      slides.push({ ...slide, image: file.id });
    }

    await strapi.documents('api::home-page.home-page').create({
      data: { ...seed.homePage, heroSlides: slides, publishedAt: new Date().toISOString() },
    });
    console.log('Home page created');
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
