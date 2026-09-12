'use strict';
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const children = [
  { parent: 'air-cushion-machine', name: 'Standard Series', slug: 'air-cushion-machine-standard-series', sortOrder: 1 },
  { parent: 'air-cushion-machine', name: 'Industrial Series', slug: 'air-cushion-machine-industrial-series', sortOrder: 2 },
  { parent: 'air-cushion-film', name: 'Standard Film', slug: 'air-cushion-film-standard-film', sortOrder: 1 },
  { parent: 'air-cushion-film', name: 'Heavy-Duty Film', slug: 'air-cushion-film-heavy-duty-film', sortOrder: 2 },
  { parent: 'paper-cushion', name: 'Paper Pad', slug: 'paper-cushion-paper-pad', sortOrder: 1 },
  { parent: 'paper-cushion', name: 'Paper Crumple', slug: 'paper-cushion-paper-crumple', sortOrder: 2 },
];

async function main() {
  const ctx = await compileStrapi();
  const app = await createStrapi(ctx).load();
  try {
    for (const child of children) {
      const parent = await strapi.documents('api::product-category.product-category').findFirst({ filters: { slug: child.parent, contentLocale: 'en' } });
      if (!parent) throw new Error(`Missing parent category: ${child.parent}`);
      const existing = await strapi.documents('api::product-category.product-category').findFirst({ filters: { slug: child.slug, contentLocale: 'en' } });
      if (existing) { console.log(`Skipped existing subcategory: ${child.slug}`); continue; }
      const created = await strapi.documents('api::product-category.product-category').create({ data: { name: child.name, slug: child.slug, contentLocale: 'en', description: `${child.name} for ${parent.name}.`, sortOrder: child.sortOrder, parent: parent.documentId, publishedAt: new Date().toISOString() } });
      await strapi.documents('api::product-category.product-category').publish({ documentId: created.documentId });
      console.log(`Created: ${child.slug}`);
    }
  } finally { await app.destroy(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
