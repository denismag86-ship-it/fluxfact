/**
 * Astro Content Collections — defines schemas for all content types.
 * Each tool page is a content collection entry with full SEO metadata.
 */
import { defineCollection, z } from 'astro:content';

const tools = defineCollection({
  type: 'content',
  schema: z.object({
    // Core
    title: z.string(),
    description: z.string(),
    locale: z.enum(['en', 'de', 'fr', 'es', 'pt-br', 'ru', 'ja']),

    // Categorization
    category: z.enum([
      'finance',
      'health',
      'tech',
      'math',
      'travel',
      'fun',
      'comparison',
      'converter',
    ]),
    tags: z.array(z.string()).default([]),

    // SEO
    keywords: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
    schemaType: z.enum(['WebApplication', 'SoftwareApplication']).default('WebApplication'),

    // Dates
    publishedDate: z.string(),
    modifiedDate: z.string(),

    // Tool-specific
    toolName: z.string().optional(),
    toolCategory: z.string().optional(),
    toolDescription: z.string().optional(),

    // Interactive component
    componentName: z.string(), // React component filename in src/components/tools/

    // FAQ for rich snippets
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).default([]),

    // Related tools
    relatedTools: z.array(z.object({
      title: z.string(),
      slug: z.string(),
      description: z.string(),
    })).default([]),

    // Viral mechanics
    shareText: z.string().optional(), // Pre-filled share text template
    resultShareable: z.boolean().default(true), // Can users share their results?
  }),
});

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(['en', 'de', 'fr', 'es', 'pt-br', 'ru', 'ja']),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
    publishedDate: z.string(),
    modifiedDate: z.string(),
    author: z.string().default('FluxFact'),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).default([]),
    relatedArticles: z.array(z.string()).default([]),
  }),
});

export const collections = { tools, articles };
