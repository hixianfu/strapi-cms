import type { Core } from '@strapi/strapi';

const names: Record<string, Record<string, [string, string]>> = {
  video: {
    promotional: ['产品宣传', 'Promotional'], introduction: ['产品介绍', 'Product introduction'],
    operation: ['产品操作', 'Operation'], installation: ['安装教程', 'Installation'],
    tutorial: ['使用教程', 'Tutorial'], commissioning: ['设备调试', 'Commissioning'],
    maintenance: ['维护保养', 'Maintenance'], application: ['行业应用', 'Industry application'],
    factory: ['工厂展示', 'Factory tour'], company: ['企业宣传', 'Company'], other: ['其他', 'Other'],
  },
  faq: { product: ['产品', 'Product'], solution: ['解决方案', 'Solution'], usage: ['使用方法', 'Usage'], service: ['服务', 'Service'], other: ['其他', 'Other'] },
};

export async function migrateContentCategories(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'application', name: 'content-category-migration' });
  const snapshot = await store.get({ key: 'snapshot' }) as {
    entries: Array<{ kind: 'video' | 'faq'; id: number; category: string; locale: 'zh' | 'en' }>;
    completed: boolean;
  } | null;
  if (!snapshot || snapshot.completed) return;

  for (const entry of snapshot.entries) {
    const contentUid = entry.kind === 'video' ? 'api::video.video' : 'api::faq.faq';
    const categoryUid = entry.kind === 'video' ? 'api::video-category.video-category' : 'api::faq-category.faq-category';
    const content = await strapi.db.query(contentUid).findOne({ where: { id: entry.id }, populate: ['category'] });
    // Do not overwrite a category that an editor has already selected.
    if (!content || content.category) continue;
    const slug = entry.locale === 'zh' ? entry.category : `${entry.category}-${entry.locale}`;
    let category = await strapi.db.query(categoryUid).findOne({ where: { slug, contentLocale: entry.locale } });
    if (!category) {
      category = await strapi.documents(categoryUid).create({ data: {
        name: names[entry.kind][entry.category]?.[entry.locale === 'zh' ? 0 : 1] ?? entry.category,
        slug, contentLocale: entry.locale, sortOrder: 0,
      } });
    }
    // Update each physical row, including both draft and published versions.
    await strapi.db.query(contentUid).update({ where: { id: entry.id }, data: { category: category.id } });
  }
  await store.set({ key: 'snapshot', value: { ...snapshot, completed: true } });
  strapi.log.info('Migrated video and FAQ categories to managed category relations.');
}
