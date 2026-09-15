'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const entries = [
  {
    slug: 'electronics-export-protection',
    industry: 'Electronics manufacturing',
    zh: {
      title: '\u7535\u5b50\u4ea7\u54c1\u51fa\u53e3\u9632\u62a4\u6848\u4f8b',
      summary: '\u4e3a\u7cbe\u5bc6\u7535\u5b50\u4ea7\u54c1\u5efa\u7acb\u7a33\u5b9a\u7684\u51fa\u53e3\u7f13\u51b2\u5305\u88c5\u65b9\u6848\u3002',
      customerProblem: '\u957f\u9014\u8fd0\u8f93\u4e2d\u632f\u52a8\u5bb9\u6613\u5bfc\u81f4\u4ea7\u54c1\u5212\u4f24\uff0c\u4e14\u539f\u6709\u6ce1\u6cab\u5305\u88c5\u5360\u7528\u4ed3\u50a8\u7a7a\u95f4\u3002',
      originalPackaging: '\u4f7f\u7528\u5b9a\u5236\u6ce1\u6cab\u886c\u57ab\u548c\u5927\u91cf\u7eb8\u7bb1\u586b\u5145\u7269\u3002',
      solution: 'Ameson supplied an **air cushion system** and standardized packing workstations for export orders.',
      results: '\u5305\u88c5\u4f53\u79ef\u51cf\u5c11 35%\uff0c\u7834\u635f\u7387\u964d\u81f3 0.4%\uff0c\u5305\u88c5\u5458\u57f9\u8bad\u65f6\u95f4\u7f29\u77ed\u4e00\u534a\u3002',
    },
    en: {
      title: 'Export Protection for Electronics',
      summary: 'A stable protective packaging workflow for precision electronics shipped overseas.',
      customerProblem: 'Long-distance vibration caused product damage, while foam inserts consumed warehouse space.',
      originalPackaging: 'Custom foam inserts and large amounts of loose paper fill were used.',
      solution: 'Ameson supplied an **air cushion system** and standardized packing workstations for export orders.',
      results: 'Packaging volume fell by 35%, damage dropped to 0.4%, and operator training time was cut in half.',
    },
  },
  {
    slug: 'ecommerce-glassware-fulfillment',
    industry: 'E-commerce fulfillment',
    zh: {
      title: '\u7535\u5546\u73bb\u7483\u5668\u5305\u88c5\u6848\u4f8b',
      summary: '\u5e2e\u52a9\u7535\u5546\u4ed3\u914d\u4e2d\u63d0\u5347\u73bb\u7483\u5668\u53d1\u8d27\u6548\u7387\u4e0e\u9632\u7834\u80fd\u529b\u3002',
      customerProblem: '\u8ba2\u5355\u5cf0\u503c\u671f\u95f4\u5305\u88c5\u901f\u5ea6\u4e0d\u8db3\uff0c\u73bb\u7483\u74f6\u5728\u914d\u9001\u4e2d\u7834\u635f\u7387\u8f83\u9ad8\u3002',
      originalPackaging: '\u4eba\u5de5\u88c1\u5207\u7eb8\u677f\u5e76\u4f7f\u7528\u5927\u91cf\u80f6\u5e26\u56fa\u5b9a\u3002',
      solution: 'Ameson introduced **air cushion film** and a one-step wrapping process for each order.',
      results: '\u5355\u4ef6\u5305\u88c5\u65f6\u95f4\u7f29\u77ed\u81f3 40 \u79d2\uff0c\u7834\u635f\u9000\u8d27\u7387\u4e0b\u964d 62%\u3002',
    },
    en: {
      title: 'Glassware Fulfillment for E-commerce',
      summary: 'Helping an e-commerce warehouse improve throughput and protection for fragile glassware.',
      customerProblem: 'Packing was too slow during peak orders, and glass bottles had a high damage rate in transit.',
      originalPackaging: 'Operators hand-cut paperboard and used large amounts of tape for each parcel.',
      solution: 'Ameson introduced **air cushion film** and a one-step wrapping process for each order.',
      results: 'Packing time fell to 40 seconds per order and damage-related returns dropped by 62%.',
    },
  },
  {
    slug: 'automotive-parts-distribution',
    industry: 'Automotive parts',
    zh: {
      title: '\u6c7d\u8f66\u96f6\u90e8\u4ef6\u914d\u9001\u6848\u4f8b',
      summary: '\u4e3a\u6c7d\u8f66\u96f6\u90e8\u4ef6\u5efa\u7acb\u53ef\u91cd\u590d\u3001\u53ef\u8ffd\u8e2a\u7684\u7f13\u51b2\u5305\u88c5\u6807\u51c6\u3002',
      customerProblem: '\u591a\u79cd\u89c4\u683c\u96f6\u4ef6\u5171\u7528\u5305\u6750\uff0c\u8fd0\u8f93\u540e\u5bb9\u6613\u522e\u8eab\u4e14\u5305\u6750\u7ba1\u7406\u590d\u6742\u3002',
      originalPackaging: '\u4f7f\u7528\u6df7\u5408\u7eb8\u5f20\u3001\u6c14\u6ce1\u888b\u4e0e\u7f29\u7d27\u819c\u3002',
      solution: 'Ameson combined **paper cushioning** with a packing specification by part family.',
      results: '\u96f6\u4ef6\u8868\u9762\u522e\u4f24\u51cf\u5c11 70%\uff0c\u5305\u6750 SKU \u51cf\u5c11 28%\uff0c\u5e93\u5185\u5206\u62e3\u66f4\u6e05\u6670\u3002',
    },
    en: {
      title: 'Automotive Parts Distribution',
      summary: 'A repeatable and traceable cushioning standard for automotive parts distribution.',
      customerProblem: 'Many part sizes shared packaging materials, causing scratches and complicated stock management.',
      originalPackaging: 'Mixed paper sheets, air bags, and stretch film were used across the warehouse.',
      solution: 'Ameson combined **paper cushioning** with a packing specification by part family.',
      results: 'Surface scratches fell by 70%, packaging SKUs fell by 28%, and warehouse picking became clearer.',
    },
  },
];

async function main() {
  const app = await createStrapi(await compileStrapi()).load();
  try {
    const service = strapi.documents('api::case-study.case-study');
    for (const entry of entries) {
      for (const locale of ['zh', 'en']) {
        const slug = locale === 'zh' ? entry.slug : `${entry.slug}-en`;
        const existing = await service.findFirst({ filters: { slug } });
        if (existing) {
          console.log(`Skipped case study: ${locale}/${slug}`);
          continue;
        }
        const created = await service.create({
          data: {
            ...entry[locale],
            slug,
            contentLocale: locale,
            industry: entry.industry,
            sortOrder: 1,
            featured: true,
            publishedAt: new Date().toISOString(),
          },
        });
        await service.publish({ documentId: created.documentId });
        console.log(`Created case study: ${locale}/${slug}`);
      }
    }
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
