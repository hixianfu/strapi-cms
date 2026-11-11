import type { StrapiApp } from '@strapi/strapi/admin';

const ProductCategoryTreeIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 4v16M6 8h6M6 16h6M12 8v4h6M12 16v4h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="4" r="2" fill="currentColor" />
    <circle cx="12" cy="8" r="2" fill="currentColor" />
    <circle cx="12" cy="16" r="2" fill="currentColor" />
    <circle cx="18" cy="12" r="2" fill="currentColor" />
    <circle cx="18" cy="20" r="2" fill="currentColor" />
  </svg>
);

export default {
  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'da',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      'uk',
      // 'vi',
      'zh-Hans',
      'zh',
    ],
  },
  register(app: StrapiApp) {
    app.registerPlugin({
      id: 'product-category-tree',
      name: 'product-category-tree',
    });
    app.addMenuLink({
      to: '/product-category-tree',
      icon: ProductCategoryTreeIcon,
      intlLabel: {
        id: 'product-category-tree.menu.label',
        defaultMessage: '产品分类树',
      },
      Component: async () => {
        const component = await import('./ProductCategoryTree');
        return component;
      },
      permissions: [],
    });
  },
};
