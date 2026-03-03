/**
 * FluxFact Orchestrator Configuration.
 *
 * This runs locally via Claude Code SDK.
 * It orchestrates content generation pipeline:
 * Trend Scout → Content Architect → Developer → Writer → Designer → Publisher
 */

export const config = {
  site: {
    name: 'FluxFact',
    domain: 'https://fluxfact.tech',
    repoPath: 'I:/fluxfact',
    locales: ['en', 'de', 'fr', 'es', 'pt-br', 'ru', 'ja'] as const,
    defaultLocale: 'en' as const,
  },

  /** Content pipeline agents */
  agents: {
    trendScout: {
      name: 'Trend Scout',
      description: 'Finds rising search queries before competition',
      schedule: '0 */4 * * *', // Every 4 hours
      sources: [
        { type: 'google-trends', weight: 0.4 },
        { type: 'reddit', weight: 0.2 },
        { type: 'hackernews', weight: 0.15 },
        { type: 'google-autocomplete', weight: 0.15 },
        { type: 'twitter-trending', weight: 0.1 },
      ],
      scoring: {
        searchVolume: 0.3,
        growthRate: 0.3,
        competitionLow: 0.2,
        toolPotential: 0.2, // Can we make an interactive tool?
      },
      minScore: 0.6,
      maxTrends: 10, // Per cycle
    },

    contentArchitect: {
      name: 'Content Architect',
      description: 'Plans page cluster from a trend',
      clusterSize: { min: 3, max: 15 },
      pageTypes: [
        'calculator',    // Interactive calculator
        'converter',     // Unit/value converter
        'comparison',    // Side-by-side comparison
        'quiz',          // Interactive quiz with shareable result
        'visualizer',    // Data visualization
        'generator',     // Text/name/idea generator
        'checker',       // Validator/checker tool
        'article',       // Long-form SEO article
      ],
    },

    developer: {
      name: 'Developer',
      description: 'Generates React components for interactive tools',
      framework: 'react',
      styling: 'tailwind',
      requirements: [
        'Client-side only (no server)',
        'Mobile-first responsive',
        'Accessible (ARIA labels, keyboard nav)',
        'Share result functionality built-in',
        'Smooth animations (framer-motion)',
        'Error handling for edge cases',
      ],
    },

    writer: {
      name: 'Writer',
      description: 'Writes SEO-optimized articles for each tool page',
      structure: [
        'H1 with primary keyword',
        'Introduction (answer the query immediately)',
        'How to use (if tool page)',
        'Detailed explanation (800-1500 words)',
        'Data table or comparison (if applicable)',
        'Tips / best practices',
        'FAQ (5+ questions for rich snippets)',
        'Sources / methodology',
      ],
      seoRules: [
        'Primary keyword in H1, first paragraph, and meta description',
        'LSI keywords naturally throughout',
        'Internal links to related tools',
        'Short paragraphs (2-3 sentences)',
        'Lists and tables for scannability',
        'Schema.org FAQ markup for all Q&A',
      ],
      localization: {
        notTranslation: true, // Localize, don't translate
        adaptExamples: true,  // Use local currency, units, references
        adaptTone: true,      // Formal (DE, JA) vs casual (EN, PT-BR)
      },
    },

    designer: {
      name: 'Designer',
      description: 'Generates images via Nano Banana 2 / Kie AI',
      provider: 'kie-ai',
      model: 'nano-banana-2',
      imagesPerPage: {
        ogImage: 1,           // 1200x630, always
        heroIllustration: 1,  // Optional, for article pages
        infographic: 0,       // On-demand
      },
      defaultResolution: '1024' as const,
      style: 'modern, clean, dark theme, tech aesthetic',
      budget: {
        maxPerPage: 0.20, // USD
        maxPerDay: 5.00,
      },
    },

    publisher: {
      name: 'Publisher',
      description: 'Assembles MDX, commits, and deploys',
      steps: [
        'Write MDX file to src/content/tools/',
        'Write React component to src/components/tools/',
        'Copy images to public/og/ and public/images/',
        'Update component registry in pages/tools/[...slug].astro',
        'Run astro build to verify',
        'Git commit with descriptive message',
        'Git push (triggers Cloudflare Pages deploy)',
      ],
      verification: {
        buildCheck: true,
        linkCheck: true,
        lighthouseScore: 90, // Minimum
      },
    },
  },

  /** Image generation config */
  images: {
    provider: 'kie-ai',
    apiBaseUrl: 'https://api.kie.ai/v1',
    model: 'nano-banana-2',
    defaults: {
      resolution: '1024' as const,
      aspectRatio: '16:9' as const,
      format: 'png' as const,
    },
    ogDefaults: {
      resolution: '1024' as const,
      aspectRatio: '16:9' as const,
      width: 1200,
      height: 630,
    },
  },

  /** Budget limits */
  budget: {
    daily: {
      images: 5.00,      // USD
      aiTokens: 2.00,    // USD (Claude API for agents)
      total: 10.00,
    },
    perPage: {
      maxCost: 0.50,     // USD (all agents combined)
    },
  },
};

export type OrchestratorConfig = typeof config;
