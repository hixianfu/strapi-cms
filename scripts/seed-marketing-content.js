'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const entries = {
  solution: [
    { slug: 'smart-factory', zh: { title: '智能工厂解决方案', summary: '连接设备、数据与团队，提升生产透明度。' }, en: { title: 'Smart Factory Solution', summary: 'Connect equipment, data, and teams for clearer production visibility.' } },
    { slug: 'asset-monitoring', zh: { title: '资产监测解决方案', summary: '帮助运维团队提前发现异常并降低停机风险。' }, en: { title: 'Asset Monitoring Solution', summary: 'Help maintenance teams detect anomalies earlier and reduce downtime.' } },
  ],
  scenario: [
    { slug: 'factory-floor', zh: { title: '工厂车间', summary: '面向生产现场的实时监控与协同。' }, en: { title: 'Factory Floor', summary: 'Real-time monitoring and collaboration for production sites.' } },
    { slug: 'warehouse-logistics', zh: { title: '仓储物流', summary: '让仓储设备和物流流程更高效、更可追踪。' }, en: { title: 'Warehouse & Logistics', summary: 'Make warehouse equipment and logistics workflows efficient and traceable.' } },
  ],
  'case-study': [
    { slug: 'packaging-line-upgrade', zh: { title: '包装产线升级案例', summary: '通过数据采集与自动化改造提升产线稳定性。' }, en: { title: 'Packaging Line Upgrade', summary: 'Improving line stability through data collection and automation.' } },
  ],
  video: [
    { slug: 'company-overview', category: 'company', zh: { title: '艾美森公司介绍', description: '了解我们的团队、能力与服务。' }, en: { title: 'About Ameson', description: 'Meet our team, capabilities, and services.' } },
  ],
  faq: [
    { slug: 'integration-support', category: 'service', zh: { question: '是否支持现有设备接入？', answer: '支持，我们可以根据现场协议和网络环境提供接入方案。' }, en: { question: 'Can existing equipment be integrated?', answer: 'Yes. We provide integration plans based on site protocols and network conditions.' } },
  ],
};

async function main() {
  const app = await createStrapi(await compileStrapi()).load();
  try {
    for (const [type, definitions] of Object.entries(entries)) {
      const service = strapi.documents(`api::${type}.${type}`);
      for (const definition of definitions) {
        for (const locale of ['zh', 'en']) {
          const localized = definition[locale];
          const slug = locale === 'zh' ? definition.slug : `${definition.slug}-en`;
          const existing = await service.findFirst({ filters: { slug } });
          if (existing) {
            console.log(`Skipped ${type}: ${locale}/${slug}`);
            continue;
          }
          const created = await service.create({
            data: {
              ...localized,
              slug,
              contentLocale: locale,
              sortOrder: 1,
              featured: true,
              ...(definition.category ? { category: definition.category } : {}),
              publishedAt: new Date().toISOString(),
            },
          });
          await service.publish({ documentId: created.documentId });
          console.log(`Created ${type}: ${locale}/${slug}`);
        }
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
