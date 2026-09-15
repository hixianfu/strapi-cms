'use strict';

/** Grant the public role read access to the marketing content APIs. */
const controllers = ['solution', 'scenario', 'case-study', 'video', 'faq'];

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const app = await createStrapi(await compileStrapi()).load();
  try {
    const role = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    if (!role) throw new Error('Public role not found');
    const permissionQuery = strapi.query('plugin::users-permissions.permission');
    for (const controller of controllers) {
      for (const action of ['find', 'findOne']) {
        const actionName = `api::${controller}.${controller}.${action}`;
        const existing = await permissionQuery.findOne({ where: { action: actionName, role: role.id } });
        if (!existing) {
          await permissionQuery.create({ data: { action: actionName, role: role.id } });
          console.log(`Granted ${actionName}`);
        }
      }
    }
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
