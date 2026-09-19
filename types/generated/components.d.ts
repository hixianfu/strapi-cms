import type { Schema, Struct } from '@strapi/strapi';

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    displayName: 'Call to action';
    icon: 'arrowRight';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    image: Schema.Attribute.Media<'images'>;
    imageAlt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface SharedFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_feature_items';
  info: {
    displayName: 'Feature item';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface SharedFeatureList extends Struct.ComponentSchema {
  collectionName: 'components_shared_feature_lists';
  info: {
    displayName: 'Feature list';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    items: Schema.Attribute.Component<'shared.feature-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SharedHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_slides';
  info: {
    description: 'A homepage carousel slide with an optional call to action.';
    displayName: 'Hero slide';
    icon: 'picture';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imageAlt: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    linkLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    linkUrl: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SharedHomeArticles extends Struct.ComponentSchema {
  collectionName: 'components_shared_home_articles';
  info: {
    displayName: 'Homepage articles';
    icon: 'file';
  };
  attributes: {
    articles: Schema.Attribute.Relation<'manyToMany', 'api::article.article'>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SharedHomeCases extends Struct.ComponentSchema {
  collectionName: 'components_shared_home_cases';
  info: {
    displayName: 'Homepage cases';
    icon: 'chartBubble';
  };
  attributes: {
    cases: Schema.Attribute.Relation<
      'manyToMany',
      'api::case-study.case-study'
    >;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SharedHomeFaqs extends Struct.ComponentSchema {
  collectionName: 'components_shared_home_faqs';
  info: {
    displayName: 'Homepage FAQs';
    icon: 'question';
  };
  attributes: {
    faqs: Schema.Attribute.Relation<'manyToMany', 'api::faq.faq'>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SharedHomeCompanyShowcase extends Struct.ComponentSchema {
  collectionName: 'components_shared_home_company_showcases';
  info: {
    displayName: 'Home company showcase';
    icon: 'building';
  };
  attributes: {
    article: Schema.Attribute.Relation<'manyToOne', 'api::article.article'>;
    backgroundImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    buttonLabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    highlights: Schema.Attribute.Component<
      'shared.home-showcase-highlight',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      >;
    imageAlt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SharedHomeFeatureCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_home_feature_cards';
  info: {
    displayName: 'Home feature card';
    icon: 'star';
  };
  attributes: {
    article: Schema.Attribute.Relation<'manyToOne', 'api::article.article'>;
    case: Schema.Attribute.Relation<'manyToOne', 'api::case-study.case-study'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    image: Schema.Attribute.Media<'images'>;
    product: Schema.Attribute.Relation<'manyToOne', 'api::product.product'>;
    scenario: Schema.Attribute.Relation<'manyToOne', 'api::scenario.scenario'>;
    solution: Schema.Attribute.Relation<'manyToOne', 'api::solution.solution'>;
    targetType: Schema.Attribute.Enumeration<
      ['product', 'article', 'solution', 'scenario', 'case']
    > &
      Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SharedHomeFeatureCards extends Struct.ComponentSchema {
  collectionName: 'components_shared_home_feature_cards_sections';
  info: {
    displayName: 'Home feature cards';
    icon: 'grid';
  };
  attributes: {
    cards: Schema.Attribute.Component<'shared.home-feature-card', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 8;
          min: 1;
        },
        number
      >;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SharedHomeHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_home_heroes';
  info: {
    displayName: 'Homepage hero';
    icon: 'picture';
  };
  attributes: {
    slides: Schema.Attribute.Component<'shared.hero-slide', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 8;
          min: 1;
        },
        number
      >;
  };
}

export interface SharedHomeProducts extends Struct.ComponentSchema {
  collectionName: 'components_shared_home_products';
  info: {
    displayName: 'Homepage products';
    icon: 'cube';
  };
  attributes: {
    products: Schema.Attribute.Relation<'manyToMany', 'api::product.product'>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SharedHomeScenarios extends Struct.ComponentSchema {
  collectionName: 'components_shared_home_scenarios';
  info: {
    displayName: 'Homepage scenarios';
    icon: 'apps';
  };
  attributes: {
    scenarios: Schema.Attribute.Relation<
      'manyToMany',
      'api::scenario.scenario'
    >;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SharedHomeShowcaseHighlight extends Struct.ComponentSchema {
  collectionName: 'components_shared_home_showcase_highlights';
  info: {
    displayName: 'Home showcase highlight';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 220;
      }>;
  };
}

export interface SharedHomeSolutions extends Struct.ComponentSchema {
  collectionName: 'components_shared_home_solutions';
  info: {
    displayName: 'Homepage solutions';
    icon: 'briefcase';
  };
  attributes: {
    solutions: Schema.Attribute.Relation<
      'manyToMany',
      'api::solution.solution'
    >;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SharedHomeVideos extends Struct.ComponentSchema {
  collectionName: 'components_shared_home_videos';
  info: {
    displayName: 'Homepage videos';
    icon: 'video';
  };
  attributes: {
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    videos: Schema.Attribute.Relation<'manyToMany', 'api::video.video'>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedMediaGallery extends Struct.ComponentSchema {
  collectionName: 'components_shared_media_galleries';
  info: {
    displayName: 'Media gallery';
    icon: 'landscape';
  };
  attributes: {
    altText: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    images: Schema.Attribute.Media<'images', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 20;
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SharedNavigationItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_navigation_items';
  info: {
    displayName: 'Navigation item';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface SharedProductVideo extends Struct.ComponentSchema {
  collectionName: 'components_shared_product_videos';
  info: {
    description: 'A titled video shown on a product detail page.';
    displayName: 'Product Video';
    icon: 'play';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    kind: Schema.Attribute.Enumeration<
      ['promotional', 'operation', 'maintenance', 'other']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'promotional'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    video: Schema.Attribute.Media<'videos'> & Schema.Attribute.Required;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
    shareImageAlt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social link';
    icon: 'share';
  };
  attributes: {
    platform: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface SharedSpecification extends Struct.ComponentSchema {
  collectionName: 'components_shared_specifications';
  info: {
    displayName: 'Specification';
    icon: 'dashboard';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
  };
}

export interface SharedTimelineItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_timeline_items';
  info: {
    displayName: 'Timeline item';
    icon: 'clock';
  };
  attributes: {
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    image: Schema.Attribute.Media<'images'>;
    imageAlt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shared.cta': SharedCta;
      'shared.feature-item': SharedFeatureItem;
      'shared.feature-list': SharedFeatureList;
      'shared.hero-slide': SharedHeroSlide;
      'shared.home-articles': SharedHomeArticles;
      'shared.home-cases': SharedHomeCases;
      'shared.home-company-showcase': SharedHomeCompanyShowcase;
      'shared.home-faqs': SharedHomeFaqs;
      'shared.home-feature-card': SharedHomeFeatureCard;
      'shared.home-feature-cards': SharedHomeFeatureCards;
      'shared.home-hero': SharedHomeHero;
      'shared.home-products': SharedHomeProducts;
      'shared.home-scenarios': SharedHomeScenarios;
      'shared.home-showcase-highlight': SharedHomeShowcaseHighlight;
      'shared.home-solutions': SharedHomeSolutions;
      'shared.home-videos': SharedHomeVideos;
      'shared.media': SharedMedia;
      'shared.media-gallery': SharedMediaGallery;
      'shared.navigation-item': SharedNavigationItem;
      'shared.product-video': SharedProductVideo;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.social-link': SharedSocialLink;
      'shared.specification': SharedSpecification;
      'shared.timeline-item': SharedTimelineItem;
    }
  }
}
