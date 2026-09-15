'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const categories = [
  { slug: 'company-news', zh: '公司新闻', en: 'Company News', description: 'Company announcements and updates.' },
  { slug: 'industry-news', zh: '行业新闻', en: 'Industry News', description: 'Industry trends and market insights.' },
  { slug: 'charity', zh: '爱心公益', en: 'Charity & Public Welfare', description: 'Community, charity and public welfare initiatives.' },
  { slug: 'public-notices', zh: '公示信息', en: 'Public Notices', description: 'Public notices and official information.' },
];

async function main() {
  const context = await compileStrapi();
  const app = await createStrapi(context).load();
  try {
    const service = strapi.documents('api::category.category');
    for (const category of categories) {
      for (const [contentLocale, name] of [['zh', category.zh], ['en', category.en]]) {
        const slug = contentLocale === 'en' ? `${category.slug}-en` : category.slug;
        const existing = await service.findFirst({ filters: { slug } });
        if (existing) {
          console.log(`Skipped existing category: ${contentLocale}/${category.slug}`);
          continue;
        }
        await service.create({ data: { name, slug, contentLocale, description: category.description } });
        console.log(`Created category: ${contentLocale}/${slug}`);
      }
    }
  } finally {
    await app.destroy();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
