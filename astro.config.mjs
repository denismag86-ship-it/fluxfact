// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://fluxfact.tech',
  integrations: [
    react(),
    tailwind(),
    sitemap({
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          de: 'de-DE',
          fr: 'fr-FR',
          es: 'es-ES',
          'pt-br': 'pt-BR',
          ru: 'ru-RU',
          ja: 'ja-JP',
        },
      },
    }),
    mdx(),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr', 'es', 'pt-br', 'ru', 'ja'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  output: 'static',
  build: {
    format: 'directory',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
});
