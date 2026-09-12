'use strict';
const { createStrapi, compileStrapi } = require('@strapi/strapi');
const categories = [
  ['Air Cushion Machine', 'air-cushion-machine'], ['Air Cushion Film', 'air-cushion-film'], ['Paper Cushion', 'paper-cushion'],
  ['Foam in Place', 'foam-in-place'], ['Padded Mailer', 'padded-mailer'], ['Gummed Paper Tape', 'gummed-paper-tape'],
  ['Air Column Bag', 'air-column-bag'], ['Dunnage Bags', 'dunnage-bags'],
];
async function main() { const ctx = await compileStrapi(); const app = await createStrapi(ctx).load(); try { for (const [name, slug] of categories) { const found = await strapi.documents('api::product-category.product-category').findFirst({ filters: { slug, contentLocale: 'en' } }); if (found) { console.log(`Skipped existing category: ${slug}`); continue; } const created = await strapi.documents('api::product-category.product-category').create({ data: { name, slug, contentLocale: 'en', sortOrder: categories.findIndex((x) => x[1] === slug) + 1, description: `Ameson ${name} solutions.`, publishedAt: new Date().toISOString() } }); await strapi.documents('api::product-category.product-category').publish({ documentId: created.documentId }); console.log(`Created: ${slug}`); } } finally { await app.destroy(); } }
main().catch((error) => { console.error(error); process.exitCode = 1; });
