'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const product = {
  contentLocale: 'en',
  name: 'Northstar Edge Monitor EN',
  slug: 'northstar-edge-monitor-en',
  summary: 'Collect critical equipment data in real time so field teams can spot anomalies earlier and reduce downtime.',
  sortOrder: 10,
  featured: true,
  specifications: [
    { label: 'Data channels', value: 'Up to 64' },
    { label: 'Protocols', value: 'MQTT / Modbus TCP' },
    { label: 'Protection rating', value: 'IP65' },
  ],
};

const article = {
  contentLocale: 'en',
  title: 'Building Better Operational Visibility',
  description: 'How connected systems help teams make faster, safer decisions.',
  slug: 'operations-visibility-en',
  blocks: [
    {
      __component: 'shared.rich-text',
      body: '## Building Better Operational Visibility\n\nConnected data gives operations teams a clearer view of what is happening across every site. With timely signals, teams can respond earlier, coordinate maintenance, and make safer decisions with confidence.',
    },
  ],
};

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  try {
    const image = await strapi.query('plugin::upload.file').findOne({
      where: { mime: { $startsWith: 'image/' } },
    });
    if (!image) throw new Error('No uploaded image is available for test content');

    const productService = strapi.documents('api::product.product');
    const existingProduct = await productService.findFirst({
      filters: { slug: product.slug },
    });
    if (existingProduct) {
      console.log(`Skipped existing product: ${product.slug}`);
    } else {
      const createdProduct = await productService.create({
        data: { ...product, cover: image.id, publishedAt: new Date().toISOString() },
      });
      await productService.publish({ documentId: createdProduct.documentId });
      console.log(`Created product: ${product.slug}`);
    }

    const articleService = strapi.documents('api::article.article');
    const existingArticle = await articleService.findFirst({
      filters: { slug: article.slug },
    });
    if (existingArticle) {
      console.log(`Skipped existing article: ${article.slug}`);
    } else {
      const createdArticle = await articleService.create({
        data: { ...article, cover: image.id, publishedAt: new Date().toISOString() },
      });
      await articleService.publish({ documentId: createdArticle.documentId });
      console.log(`Created article: ${article.slug}`);
    }
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
