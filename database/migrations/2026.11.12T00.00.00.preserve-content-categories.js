'use strict';

// Run before schema synchronization removes the old enumeration columns.
module.exports = {
  async up(knex) {
    const store = 'strapi_core_store_settings';
    if (!(await knex.schema.hasTable(store))) return;
    const key = 'application_content-category-migration_snapshot';
    if (await knex(store).where({ key }).first()) return;
    const entries = [];
    for (const [table, kind] of [['videos', 'video'], ['faqs', 'faq']]) {
      if (!(await knex.schema.hasTable(table)) || !(await knex.schema.hasColumn(table, 'category'))) continue;
      const rows = await knex(table).select('id', 'category', 'content_locale').whereNotNull('category');
      for (const row of rows) {
        if (typeof row.category === 'string' && row.category.trim()) {
          entries.push({ kind, id: row.id, category: row.category, locale: row.content_locale || 'zh' });
        }
      }
    }
    if (entries.length) await knex(store).insert({ key, value: JSON.stringify({ entries, completed: false }), type: 'object', environment: null, tag: null });
  },
};
