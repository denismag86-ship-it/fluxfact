/**
 * FluxFact SEO utilities — optimized for:
 * - Google (traditional SEO)
 * - AI/Neural search (ChatGPT, Perplexity, Yandex Neuro)
 * - Social media (OG, Twitter Cards)
 * - Rich snippets (Schema.org)
 */

export interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedDate?: string;
  modifiedDate?: string;
  author?: string;
  locale?: string;
  alternateLocales?: { locale: string; url: string }[];
  keywords?: string[];
  // Schema.org
  schemaType?: 'Article' | 'FAQPage' | 'HowTo' | 'SoftwareApplication' | 'WebApplication';
  faq?: { question: string; answer: string }[];
  // Tool-specific
  toolName?: string;
  toolCategory?: string;
  toolDescription?: string;
}

export function generateMetaTags(props: SEOProps) {
  const {
    title,
    description,
    canonicalUrl,
    ogImage = '/og/default.png',
    ogType = 'website',
    publishedDate,
    modifiedDate,
    author = 'FluxFact',
    locale = 'en',
    alternateLocales = [],
    keywords = [],
  } = props;

  const fullTitle = title.includes('FluxFact') ? title : `${title} | FluxFact`;

  return {
    title: fullTitle,
    description,
    canonical: canonicalUrl,
    ogImage,
    ogType,
    publishedDate,
    modifiedDate,
    author,
    locale,
    alternateLocales,
    keywords: keywords.join(', '),
  };
}

/**
 * Generate Schema.org JSON-LD for a tool/calculator page
 */
export function generateToolSchema(props: {
  name: string;
  description: string;
  url: string;
  category: string;
  datePublished: string;
  dateModified: string;
  image?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: props.name,
    description: props.description,
    url: props.url,
    applicationCategory: props.category,
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: props.author ?? 'FluxFact',
      url: 'https://fluxfact.tech',
    },
    datePublished: props.datePublished,
    dateModified: props.dateModified,
    image: props.image,
  };
}

/**
 * Generate Schema.org JSON-LD for an article
 */
export function generateArticleSchema(props: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.title,
    description: props.description,
    url: props.url,
    image: props.image,
    datePublished: props.datePublished,
    dateModified: props.dateModified,
    author: {
      '@type': 'Organization',
      name: props.author ?? 'FluxFact',
      url: 'https://fluxfact.tech',
    },
    publisher: {
      '@type': 'Organization',
      name: 'FluxFact',
      url: 'https://fluxfact.tech',
      logo: {
        '@type': 'ImageObject',
        url: 'https://fluxfact.tech/images/logo.png',
      },
    },
  };
}

/**
 * Generate FAQ Schema.org for rich snippets + AI search
 */
export function generateFAQSchema(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Generate BreadcrumbList Schema.org
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
