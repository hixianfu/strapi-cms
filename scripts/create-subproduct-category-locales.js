'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const translations = [
  ['air-cushion-machine-standard-series', '气垫机标准系列', 'air-cushion-machine-standard-series-zh', 'air-cushion-machine'],
  ['air-cushion-machine-industrial-series', '气垫机工业系列', 'air-cushion-machine-industrial-series-zh', 'air-cushion-machine'],
  ['air-cushion-film-standard-film', '标准气垫膜', 'air-cushion-film-standard-film-zh', 'air-cushion-film'],
  ['air-cushion-film-heavy-duty-film', '重型气垫膜', 'air-cushion-film-heavy-duty-film-zh', 'air-cushion-film'],
  ['paper-cushion-paper-pad', '纸垫系列', 'paper-cushion-paper-pad-zh', 'paper-cushion'],
  ['paper-cushion-paper-crumple', '纸团系列', 'paper-cushion-paper-crumple-zh', 'paper-cushion'],
];

async function main() {
  const ctx = await compileStrapi();
  const app = await createStrapi(ctx).load();
  try {
    const service = strapi.documents('api::product-category.product-category');
    for (const [sourceSlug, name, slug, parentSlug] of translations) {
      const source = await service.findFirst({ filters: { slug: sourceSlug, contentLocale: 'en' } });
      if (!source) throw new Error(`Missing English subcategory: ${sourceSlug}`);
      const parent = await service.findFirst({ filters: { slug: parentSlug, contentLocale: 'en' } });
      if (!parent) throw new Error(`Missing parent category: ${parentSlug}`);
      const existing = await service.findFirst({ filters: { slug, contentLocale: 'zh' } });
      if (existing) { console.log(`Skipped existing Chinese subcategory: ${slug}`); continue; }
      const created = await service.create({ data: {
        name, slug, contentLocale: 'zh', description: `${name}，为运输提供可靠的缓冲保护。`,
        sortOrder: source.sortOrder, parent: parent.documentId, publishedAt: new Date().toISOString(),
      } });
      await service.publish({ documentId: created.documentId });
      console.log(`Created Chinese subcategory: ${name}`);
    }
  } finally { await app.destroy(); }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
