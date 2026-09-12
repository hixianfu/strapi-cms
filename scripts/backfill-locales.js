'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const models = [
  'article',
  'product',
  'product-category',
  'category',
  'author',
];

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  try {
    for (const model of models) {
      const service = strapi.documents(`api::${model}.${model}`);
      const entries = await service.findMany({});
      for (const entry of entries) {
        if (!entry.contentLocale) await strapi.db.query(`api::${model}.${model}`).update({ where: { id: entry.id }, data: { contentLocale: 'zh' } });
      }
      console.log(`${model}: ${entries.length} checked`);
    }
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
