import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register() {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const contentTypes = strapi.plugin('content-manager').service('content-types') as {
      findConfiguration: (model: { uid: string }) => Promise<any>;
      updateConfiguration: (model: { uid: string }, configuration: any) => Promise<unknown>;
    };
    const components = strapi.plugin('content-manager').service('components') as {
      findConfiguration: (model: { uid: string }) => Promise<any>;
      updateConfiguration: (model: { uid: string }, configuration: any) => Promise<unknown>;
    };

    const syncLabels = async (
      models: object,
      service: typeof contentTypes,
    ) => {
      for (const model of Object.values(models) as Array<{
        uid: string;
        attributes: Record<string, { displayName?: string }>;
      }>) {
        const configuration = await service.findConfiguration(model);
        let changed = false;
        const metadatas = { ...configuration.metadatas };

        for (const [field, attribute] of Object.entries(model.attributes)) {
          if (!attribute.displayName) continue;
          const metadata = metadatas[field] ?? { edit: {}, list: {} };
          const edit = { ...metadata.edit, label: attribute.displayName };
          const list = { ...metadata.list, label: attribute.displayName };
          if (metadata.edit?.label !== edit.label || metadata.list?.label !== list.label) {
            metadatas[field] = { ...metadata, edit, list };
            changed = true;
          }
        }

        if (changed) await service.updateConfiguration(model, { ...configuration, metadatas });
      }
    };

    await syncLabels(strapi.contentTypes, contentTypes);
    await syncLabels(strapi.components, components);
  },
};
