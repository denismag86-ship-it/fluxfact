/**
 * FluxFact i18n — lightweight translation system
 * Each locale has its own UI strings; content is in Astro content collections.
 */

export const languages = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  'pt-br': 'Português (BR)',
  ru: 'Русский',
  ja: '日本語',
} as const;

export type Locale = keyof typeof languages;

export const defaultLocale: Locale = 'en';

// UI strings only — content lives in content collections
const ui: Record<Locale, Record<string, string>> = {
  en: {
    'site.name': 'FluxFact',
    'site.tagline': 'Facts in flux',
    'site.description': 'Free interactive tools, calculators, and visualizations on trending topics.',
    'nav.home': 'Home',
    'nav.tools': 'Tools',
    'nav.about': 'About',
    'nav.language': 'Language',
    'tool.try': 'Try it now',
    'tool.share': 'Share result',
    'tool.related': 'Related tools',
    'tool.faq': 'FAQ',
    'tool.free': 'Free',
    'footer.tools': 'Popular Tools',
    'footer.languages': 'Languages',
    'footer.about': 'About',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.copyright': '© {year} FluxFact. All rights reserved.',
    'share.copy': 'Copy link',
    'share.copied': 'Copied!',
    'share.twitter': 'Share on X',
    'share.facebook': 'Share on Facebook',
    'share.telegram': 'Share on Telegram',
    'share.whatsapp': 'Share on WhatsApp',
    'home.hero.title': 'Discover. Calculate. Share.',
    'home.hero.subtitle': 'Free interactive tools and data visualizations on the topics you care about.',
    'home.trending': 'Trending Now',
    'home.categories': 'Browse by Category',
  },
  de: {
    'site.name': 'FluxFact',
    'site.tagline': 'Fakten im Fluss',
    'site.description': 'Kostenlose interaktive Tools, Rechner und Visualisierungen zu Trendthemen.',
    'nav.home': 'Startseite',
    'nav.tools': 'Tools',
    'nav.about': 'Über uns',
    'nav.language': 'Sprache',
    'tool.try': 'Jetzt ausprobieren',
    'tool.share': 'Ergebnis teilen',
    'tool.related': 'Ähnliche Tools',
    'tool.faq': 'FAQ',
    'tool.free': 'Kostenlos',
    'footer.tools': 'Beliebte Tools',
    'footer.languages': 'Sprachen',
    'footer.about': 'Über uns',
    'footer.privacy': 'Datenschutz',
    'footer.terms': 'Nutzungsbedingungen',
    'footer.copyright': '© {year} FluxFact. Alle Rechte vorbehalten.',
    'share.copy': 'Link kopieren',
    'share.copied': 'Kopiert!',
    'share.twitter': 'Auf X teilen',
    'share.facebook': 'Auf Facebook teilen',
    'share.telegram': 'Auf Telegram teilen',
    'share.whatsapp': 'Auf WhatsApp teilen',
    'home.hero.title': 'Entdecken. Berechnen. Teilen.',
    'home.hero.subtitle': 'Kostenlose interaktive Tools und Datenvisualisierungen zu den Themen, die dich interessieren.',
    'home.trending': 'Gerade im Trend',
    'home.categories': 'Nach Kategorie',
  },
  fr: {
    'site.name': 'FluxFact',
    'site.tagline': 'Les faits en mouvement',
    'site.description': 'Outils interactifs gratuits, calculateurs et visualisations sur les sujets tendance.',
    'nav.home': 'Accueil',
    'nav.tools': 'Outils',
    'nav.about': 'À propos',
    'nav.language': 'Langue',
    'tool.try': 'Essayer maintenant',
    'tool.share': 'Partager le résultat',
    'tool.related': 'Outils similaires',
    'tool.faq': 'FAQ',
    'tool.free': 'Gratuit',
    'footer.tools': 'Outils populaires',
    'footer.languages': 'Langues',
    'footer.about': 'À propos',
    'footer.privacy': 'Confidentialité',
    'footer.terms': 'Conditions',
    'footer.copyright': '© {year} FluxFact. Tous droits réservés.',
    'share.copy': 'Copier le lien',
    'share.copied': 'Copié !',
    'share.twitter': 'Partager sur X',
    'share.facebook': 'Partager sur Facebook',
    'share.telegram': 'Partager sur Telegram',
    'share.whatsapp': 'Partager sur WhatsApp',
    'home.hero.title': 'Découvrez. Calculez. Partagez.',
    'home.hero.subtitle': 'Outils interactifs gratuits et visualisations de données sur les sujets qui vous intéressent.',
    'home.trending': 'Tendances',
    'home.categories': 'Par catégorie',
  },
  es: {
    'site.name': 'FluxFact',
    'site.tagline': 'Hechos en flujo',
    'site.description': 'Herramientas interactivas gratuitas, calculadoras y visualizaciones sobre temas de tendencia.',
    'nav.home': 'Inicio',
    'nav.tools': 'Herramientas',
    'nav.about': 'Acerca de',
    'nav.language': 'Idioma',
    'tool.try': 'Probar ahora',
    'tool.share': 'Compartir resultado',
    'tool.related': 'Herramientas relacionadas',
    'tool.faq': 'Preguntas frecuentes',
    'tool.free': 'Gratis',
    'footer.tools': 'Herramientas populares',
    'footer.languages': 'Idiomas',
    'footer.about': 'Acerca de',
    'footer.privacy': 'Privacidad',
    'footer.terms': 'Términos',
    'footer.copyright': '© {year} FluxFact. Todos los derechos reservados.',
    'share.copy': 'Copiar enlace',
    'share.copied': '¡Copiado!',
    'share.twitter': 'Compartir en X',
    'share.facebook': 'Compartir en Facebook',
    'share.telegram': 'Compartir en Telegram',
    'share.whatsapp': 'Compartir en WhatsApp',
    'home.hero.title': 'Descubre. Calcula. Comparte.',
    'home.hero.subtitle': 'Herramientas interactivas gratuitas y visualizaciones de datos sobre los temas que te importan.',
    'home.trending': 'Tendencias',
    'home.categories': 'Por categoría',
  },
  'pt-br': {
    'site.name': 'FluxFact',
    'site.tagline': 'Fatos em fluxo',
    'site.description': 'Ferramentas interativas gratuitas, calculadoras e visualizações sobre temas em alta.',
    'nav.home': 'Início',
    'nav.tools': 'Ferramentas',
    'nav.about': 'Sobre',
    'nav.language': 'Idioma',
    'tool.try': 'Experimentar agora',
    'tool.share': 'Compartilhar resultado',
    'tool.related': 'Ferramentas relacionadas',
    'tool.faq': 'Perguntas frequentes',
    'tool.free': 'Grátis',
    'footer.tools': 'Ferramentas populares',
    'footer.languages': 'Idiomas',
    'footer.about': 'Sobre',
    'footer.privacy': 'Privacidade',
    'footer.terms': 'Termos',
    'footer.copyright': '© {year} FluxFact. Todos os direitos reservados.',
    'share.copy': 'Copiar link',
    'share.copied': 'Copiado!',
    'share.twitter': 'Compartilhar no X',
    'share.facebook': 'Compartilhar no Facebook',
    'share.telegram': 'Compartilhar no Telegram',
    'share.whatsapp': 'Compartilhar no WhatsApp',
    'home.hero.title': 'Descubra. Calcule. Compartilhe.',
    'home.hero.subtitle': 'Ferramentas interativas gratuitas e visualizações de dados sobre os temas que você se interessa.',
    'home.trending': 'Em Alta',
    'home.categories': 'Por Categoria',
  },
  ru: {
    'site.name': 'FluxFact',
    'site.tagline': 'Факты в потоке',
    'site.description': 'Бесплатные интерактивные инструменты, калькуляторы и визуализации на трендовые темы.',
    'nav.home': 'Главная',
    'nav.tools': 'Инструменты',
    'nav.about': 'О нас',
    'nav.language': 'Язык',
    'tool.try': 'Попробовать',
    'tool.share': 'Поделиться результатом',
    'tool.related': 'Похожие инструменты',
    'tool.faq': 'Вопросы и ответы',
    'tool.free': 'Бесплатно',
    'footer.tools': 'Популярные инструменты',
    'footer.languages': 'Языки',
    'footer.about': 'О проекте',
    'footer.privacy': 'Конфиденциальность',
    'footer.terms': 'Условия',
    'footer.copyright': '© {year} FluxFact. Все права защищены.',
    'share.copy': 'Скопировать ссылку',
    'share.copied': 'Скопировано!',
    'share.twitter': 'Поделиться в X',
    'share.facebook': 'Поделиться в Facebook',
    'share.telegram': 'Поделиться в Telegram',
    'share.whatsapp': 'Поделиться в WhatsApp',
    'home.hero.title': 'Открывай. Считай. Делись.',
    'home.hero.subtitle': 'Бесплатные интерактивные инструменты и визуализации данных на темы, которые тебе интересны.',
    'home.trending': 'Сейчас в тренде',
    'home.categories': 'По категориям',
  },
  ja: {
    'site.name': 'FluxFact',
    'site.tagline': '流れる事実',
    'site.description': 'トレンドトピックに関する無料のインタラクティブツール、計算機、ビジュアライゼーション。',
    'nav.home': 'ホーム',
    'nav.tools': 'ツール',
    'nav.about': '概要',
    'nav.language': '言語',
    'tool.try': '今すぐ試す',
    'tool.share': '結果をシェア',
    'tool.related': '関連ツール',
    'tool.faq': 'よくある質問',
    'tool.free': '無料',
    'footer.tools': '人気ツール',
    'footer.languages': '言語',
    'footer.about': '概要',
    'footer.privacy': 'プライバシー',
    'footer.terms': '利用規約',
    'footer.copyright': '© {year} FluxFact. All rights reserved.',
    'share.copy': 'リンクをコピー',
    'share.copied': 'コピーしました！',
    'share.twitter': 'Xでシェア',
    'share.facebook': 'Facebookでシェア',
    'share.telegram': 'Telegramでシェア',
    'share.whatsapp': 'WhatsAppでシェア',
    'home.hero.title': '発見する。計算する。シェアする。',
    'home.hero.subtitle': '気になるトピックの無料インタラクティブツールとデータビジュアライゼーション。',
    'home.trending': '今のトレンド',
    'home.categories': 'カテゴリ別',
  },
};

export function t(locale: Locale, key: string, params?: Record<string, string>): string {
  let text = ui[locale]?.[key] ?? ui.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, v);
    }
  }
  return text;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Locale;
  return defaultLocale;
}

export function getLocalizedPath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}

/**
 * Get alternate locale URLs for hreflang tags
 */
export function getAlternateLocales(path: string): { locale: string; url: string }[] {
  return Object.keys(languages)
    .filter((l) => l !== defaultLocale)
    .map((locale) => ({
      locale: locale === 'pt-br' ? 'pt-BR' : locale,
      url: `https://fluxfact.tech/${locale}${path}`,
    }));
}
