import type { Schema, Struct } from '@strapi/strapi';

export interface BliftopMainContentBliftopMainContent
  extends Struct.ComponentSchema {
  collectionName: 'components_bliftop_main_content_bliftop_main_contents';
  info: {
    description: '';
    displayName: 'bliftop_main_content';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    sectionss: Schema.Attribute.Component<'sectionss.sectionss', true>;
  };
}

export interface ButtonsButtons extends Struct.ComponentSchema {
  collectionName: 'components_buttons_buttons';
  info: {
    displayName: 'buttons';
  };
  attributes: {
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ContactSectionContactSection extends Struct.ComponentSchema {
  collectionName: 'components_contact_section_contact_sections';
  info: {
    description: '';
    displayName: 'contactSection';
  };
  attributes: {
    content: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    links: Schema.Attribute.Component<'links.links', true>;
  };
}

export interface ContactContact extends Struct.ComponentSchema {
  collectionName: 'components_contact_contacts';
  info: {
    description: '';
    displayName: 'contact';
  };
  attributes: {
    description: Schema.Attribute.Text;
    highlighted_texts: Schema.Attribute.Component<
      'highlighted-texts.highlighted-texts',
      true
    >;
    Title: Schema.Attribute.String;
  };
}

export interface FaqFaq extends Struct.ComponentSchema {
  collectionName: 'components_faq_faqs';
  info: {
    displayName: 'FAQ';
  };
  attributes: {
    Anwer: Schema.Attribute.Text;
    Order: Schema.Attribute.Integer;
    Question: Schema.Attribute.String;
  };
}

export interface GalleryImagesGalleryImages extends Struct.ComponentSchema {
  collectionName: 'components_gallery_images_gallery_images';
  info: {
    displayName: 'GalleryImages';
  };
  attributes: {
    GalleryImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    show_on_home: Schema.Attribute.Boolean;
  };
}

export interface GalleryItemGalleryItem extends Struct.ComponentSchema {
  collectionName: 'components_gallery_item_gallery_items';
  info: {
    displayName: 'GalleryItem';
  };
  attributes: {
    description: Schema.Attribute.String;
    GalleryImages: Schema.Attribute.Component<
      'gallery-images.gallery-images',
      true
    >;
    Title: Schema.Attribute.String;
  };
}

export interface HighlightCardHighlight extends Struct.ComponentSchema {
  collectionName: 'components_highlight_card_highlights';
  info: {
    description: '';
    displayName: 'CardHighlight';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface HighlightedTextsHighlightedTexts
  extends Struct.ComponentSchema {
  collectionName: 'components_highlighted_texts_highlighted_texts';
  info: {
    description: '';
    displayName: 'highlighted_texts';
  };
  attributes: {
    color: Schema.Attribute.String;
    is_highlighted: Schema.Attribute.Boolean;
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ItemItems extends Struct.ComponentSchema {
  collectionName: 'components_item_items';
  info: {
    displayName: 'items';
  };
  attributes: {
    name: Schema.Attribute.String;
    price: Schema.Attribute.String;
  };
}

export interface LinksLinks extends Struct.ComponentSchema {
  collectionName: 'components_links_links';
  info: {
    displayName: 'links';
  };
  attributes: {
    isButton: Schema.Attribute.Boolean;
    linktext: Schema.Attribute.String;
    linkUrl: Schema.Attribute.String;
  };
}

export interface ListItemsListItems extends Struct.ComponentSchema {
  collectionName: 'components_list_items_list_items';
  info: {
    displayName: 'list_items';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    isBald: Schema.Attribute.Boolean;
    title: Schema.Attribute.String;
  };
}

export interface ListList extends Struct.ComponentSchema {
  collectionName: 'components_list_lists';
  info: {
    displayName: 'list';
  };
  attributes: {
    listsitem: Schema.Attribute.Component<'listsitem.listsitem', true>;
  };
}

export interface ListsLists extends Struct.ComponentSchema {
  collectionName: 'components_lists_lists';
  info: {
    description: '';
    displayName: 'lists';
  };
  attributes: {
    list_Item: Schema.Attribute.String;
  };
}

export interface ListsitemListsitem extends Struct.ComponentSchema {
  collectionName: 'components_listsitem_listsitems';
  info: {
    displayName: 'listsitem';
  };
  attributes: {
    description: Schema.Attribute.Text;
    isBald: Schema.Attribute.Boolean;
    Title: Schema.Attribute.String;
  };
}

export interface MainContentMainContent extends Struct.ComponentSchema {
  collectionName: 'components_main_content_main_contents';
  info: {
    description: '';
    displayName: 'main_content';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    sections: Schema.Attribute.Component<'section.section', true>;
  };
}

export interface NewsCardItemNewsCardItem extends Struct.ComponentSchema {
  collectionName: 'components_news_card_item_news_card_items';
  info: {
    displayName: 'NewsCardItem';
  };
  attributes: {
    Description: Schema.Attribute.String;
    highlighted_texts_button: Schema.Attribute.String;
    highlighted_texts_button_url: Schema.Attribute.String;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Title: Schema.Attribute.String;
  };
}

export interface OpeningHourOpenHours extends Struct.ComponentSchema {
  collectionName: 'components_opening_hour_open_hours';
  info: {
    displayName: 'open-hours';
  };
  attributes: {};
}

export interface OpeningHourOpeningHour extends Struct.ComponentSchema {
  collectionName: 'components_opening_hour_opening_hours';
  info: {
    displayName: 'Opening Hour';
  };
  attributes: {
    day: Schema.Attribute.String;
    hour: Schema.Attribute.String;
  };
}

export interface PricingSectionPricingSections extends Struct.ComponentSchema {
  collectionName: 'components_pricing_section_pricing_sections_s';
  info: {
    description: '';
    displayName: 'pricing_sections ';
  };
  attributes: {
    category: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    items: Schema.Attribute.Component<'item.items', true>;
  };
}

export interface PrimaryCtaPrimaryCta extends Struct.ComponentSchema {
  collectionName: 'components_primary_cta_primary_cta_s';
  info: {
    displayName: 'PrimaryCTA ';
  };
  attributes: {
    Text: Schema.Attribute.String;
    URL: Schema.Attribute.String;
  };
}

export interface SecondaryCtaSecondaryCta extends Struct.ComponentSchema {
  collectionName: 'components_secondary_cta_secondary_ctas';
  info: {
    displayName: 'SecondaryCTA';
  };
  attributes: {
    Text: Schema.Attribute.String;
    URL: Schema.Attribute.String;
  };
}

export interface SectionSection extends Struct.ComponentSchema {
  collectionName: 'components_section_sections';
  info: {
    description: '';
    displayName: 'section';
  };
  attributes: {
    description: Schema.Attribute.String;
    links: Schema.Attribute.Component<'links.links', true>;
    lists: Schema.Attribute.Component<'lists.lists', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionssSectionss extends Struct.ComponentSchema {
  collectionName: 'components_sectionss_sectionsses';
  info: {
    description: '';
    displayName: 'sectionss';
  };
  attributes: {
    description: Schema.Attribute.Text;
    list: Schema.Attribute.Component<'list.list', false>;
    lists: Schema.Attribute.Component<'lists.lists', true>;
    Title: Schema.Attribute.String;
  };
}

export interface SocialSocial extends Struct.ComponentSchema {
  collectionName: 'components_social_socials';
  info: {
    description: '';
    displayName: 'Social Links';
  };
  attributes: {
    icon_color: Schema.Attribute.String;
    platform: Schema.Attribute.Enumeration<
      ['WhatsApp', 'Facebook', 'Instagram']
    >;
    url: Schema.Attribute.String;
  };
}

export interface SubSectionSubSection extends Struct.ComponentSchema {
  collectionName: 'components_sub_section_sub_section_s';
  info: {
    displayName: 'SubSection ';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Link: Schema.Attribute.String;
    LinkText: Schema.Attribute.String;
    Subtitle: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'bliftop-main-content.bliftop-main-content': BliftopMainContentBliftopMainContent;
      'buttons.buttons': ButtonsButtons;
      'contact-section.contact-section': ContactSectionContactSection;
      'contact.contact': ContactContact;
      'faq.faq': FaqFaq;
      'gallery-images.gallery-images': GalleryImagesGalleryImages;
      'gallery-item.gallery-item': GalleryItemGalleryItem;
      'highlight.card-highlight': HighlightCardHighlight;
      'highlighted-texts.highlighted-texts': HighlightedTextsHighlightedTexts;
      'item.items': ItemItems;
      'links.links': LinksLinks;
      'list-items.list-items': ListItemsListItems;
      'list.list': ListList;
      'lists.lists': ListsLists;
      'listsitem.listsitem': ListsitemListsitem;
      'main-content.main-content': MainContentMainContent;
      'news-card-item.news-card-item': NewsCardItemNewsCardItem;
      'opening-hour.open-hours': OpeningHourOpenHours;
      'opening-hour.opening-hour': OpeningHourOpeningHour;
      'pricing-section.pricing-sections': PricingSectionPricingSections;
      'primary-cta.primary-cta': PrimaryCtaPrimaryCta;
      'secondary-cta.secondary-cta': SecondaryCtaSecondaryCta;
      'section.section': SectionSection;
      'sectionss.sectionss': SectionssSectionss;
      'social.social': SocialSocial;
      'sub-section.sub-section': SubSectionSubSection;
    }
  }
}
