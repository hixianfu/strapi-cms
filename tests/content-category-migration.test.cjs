const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const migration = require('../database/migrations/2026.11.12T00.00.00.preserve-content-categories');

const filename = path.resolve(__dirname, '../src/utils/migrate-content-categories.ts');
const compiled = new Module(filename, module);
compiled._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { migrateContentCategories } = compiled.exports;

test('captures legacy values before schema sync and preserves an existing snapshot on retry', async () => {
  let snapshot;
  const rows = { videos: [{ id: 1, category: 'company', content_locale: 'zh' }], faqs: [{ id: 2, category: 'service', content_locale: 'en' }] };
  const knex = (table) => ({
    where: () => ({ first: async () => snapshot }),
    select: () => ({ whereNotNull: async () => rows[table] }),
    insert: async (value) => { snapshot = value; },
  });
  knex.schema = { hasTable: async () => true, hasColumn: async () => true };
  await migration.up(knex);
  const value = snapshot.value;
  assert.deepEqual(JSON.parse(value).entries, [
    { kind: 'video', id: 1, category: 'company', locale: 'zh' },
    { kind: 'faq', id: 2, category: 'service', locale: 'en' },
  ]);
  rows.videos = [];
  await migration.up(knex);
  assert.equal(snapshot.value, value);
});

test('a fresh installation needs no legacy data conversion', async () => {
  const knex = () => { throw new Error('No existing tables should be queried'); };
  knex.schema = { hasTable: async () => false };
  await migration.up(knex);
});

test('restores both draft and published rows, reuses categories and preserves editor selections', async () => {
  let snapshot = { completed: false, entries: [1, 2, 3].map((id) => ({ kind: 'video', id, category: 'company', locale: 'zh' })) };
  const contents = new Map([[1, { id: 1, category: null }], [2, { id: 2, category: null }], [3, { id: 3, category: { id: 99 } }]]);
  let category;
  let created = 0;
  const updated = [];
  const strapi = {
    store: () => ({ get: async () => snapshot, set: async ({ value }) => { snapshot = value; } }),
    db: { query: (uid) => uid === 'api::video.video' ? {
      findOne: async ({ where }) => contents.get(where.id),
      update: async ({ where, data }) => { updated.push(where.id); contents.get(where.id).category = { id: data.category }; },
    } : { findOne: async () => category } },
    documents: () => ({ create: async ({ data }) => { created++; category = { ...data, id: 10 }; return category; } }),
    log: { info() {} },
  };
  await migrateContentCategories(strapi);
  assert.equal(created, 1);
  assert.equal(category.name, '企业宣传');
  assert.deepEqual(updated, [1, 2]);
  assert.equal(contents.get(3).category.id, 99);
  assert.equal(snapshot.completed, true);
  await migrateContentCategories(strapi);
  assert.deepEqual(updated, [1, 2]);
});
