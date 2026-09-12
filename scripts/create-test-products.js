'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const products = [
  {
    name: 'Northstar Edge Monitor',
    slug: 'northstar-edge-monitor',
    summary: '实时采集关键设备数据，帮助现场团队更早发现异常并减少停机时间。',
    sortOrder: 10,
    featured: true,
    specifications: [
      { label: '采集通道', value: '最多 64 路' },
      { label: '通信协议', value: 'MQTT / Modbus TCP' },
      { label: '防护等级', value: 'IP65' },
    ],
  },
  {
    name: 'Northstar Control Hub',
    slug: 'northstar-control-hub',
    summary: '统一连接自动化设备、传感器和业务系统，为运营团队提供清晰的控制视图。',
    sortOrder: 20,
    featured: true,
    specifications: [
      { label: '连接设备', value: '500+' },
      { label: '部署方式', value: '本地 / 私有云' },
      { label: '用户角色', value: '可配置' },
    ],
  },
  {
    name: 'Northstar Asset Insights',
    slug: 'northstar-asset-insights',
    summary: '将设备健康、维护记录和现场信号集中分析，支持更准确的维护决策。',
    sortOrder: 30,
    featured: false,
    specifications: [
      { label: '分析周期', value: '实时 / 日 / 月' },
      { label: '报表类型', value: '趋势、告警、能耗' },
      { label: '导出格式', value: 'CSV / PDF' },
    ],
  },
];

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  try {
    const image = await strapi.query('plugin::upload.file').findOne({ where: { mime: { $startsWith: 'image/' } } });
    if (!image) throw new Error('No uploaded image is available for product covers');
    for (const product of products) {
      const existing = await strapi.documents('api::product.product').findFirst({ filters: { slug: product.slug } });
      if (existing) {
        console.log(`Skipped existing product: ${product.slug}`);
        continue;
      }
      const created = await strapi.documents('api::product.product').create({
        data: { ...product, cover: image.id, publishedAt: new Date().toISOString() },
      });
      await strapi.documents('api::product.product').publish({ documentId: created.documentId });
      console.log(`Created: ${product.slug}`);
    }
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
