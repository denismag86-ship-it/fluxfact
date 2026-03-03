/**
 * FluxFact Content Pipeline — main orchestration flow.
 *
 * This is the entry point for the Claude SDK orchestrator.
 * Each agent is a Claude API call with a specialized system prompt.
 *
 * Pipeline: detect trend → plan cluster → generate tool → write content → design → publish
 */

import { config } from './config';

/** Pipeline stages */
export enum PipelineStage {
  TREND_DETECTION = 'trend_detection',
  CONTENT_PLANNING = 'content_planning',
  DEVELOPMENT = 'development',
  WRITING = 'writing',
  DESIGN = 'design',
  PUBLISHING = 'publishing',
}

export interface Trend {
  keyword: string;
  searchVolume: number;
  growthRate: number;      // % growth
  competition: number;     // 0-1 (lower = better)
  toolPotential: number;   // 0-1 (can we make a tool?)
  score: number;
  source: string;
  relatedKeywords: string[];
}

export interface ContentPlan {
  trend: Trend;
  pages: PagePlan[];
  estimatedCost: number;
  estimatedTime: string;
}

export interface PagePlan {
  type: string;             // calculator, converter, quiz, etc.
  slug: string;
  title: Record<string, string>;  // locale → title
  description: Record<string, string>;
  keywords: string[];
  componentName: string;
  category: string;
  faqTopics: string[];
  priority: number;         // 1 = publish first
}

export interface GeneratedPage {
  slug: string;
  component: string;        // React TSX source code
  mdx: Record<string, string>;   // locale → MDX content
  ogImage: string;          // Path to generated image
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    faq: { question: string; answer: string }[];
  };
}

/**
 * Main pipeline execution.
 * Called by the orchestrator on schedule or manually.
 */
export async function runPipeline(): Promise<void> {
  console.log('[FluxFact] Starting content pipeline...');

  // 1. Detect trends
  // const trends = await detectTrends();

  // 2. Score and filter
  // const topTrends = trends.filter(t => t.score >= config.agents.trendScout.minScore);

  // 3. For each trend, plan content cluster
  // const plans = await Promise.all(topTrends.map(planContentCluster));

  // 4. For each page in plan:
  //    a. Generate React component (Developer agent)
  //    b. Write MDX content in all locales (Writer agent)
  //    c. Generate OG image (Designer agent)
  //    d. Assemble and publish (Publisher agent)

  // 5. Verify build
  // 6. Git commit & push

  console.log('[FluxFact] Pipeline complete.');
}

/**
 * Agent system prompts — these are the "brains" of each agent.
 * Each agent is a Claude API call with these prompts.
 */
export const agentPrompts = {
  trendScout: `You are the Trend Scout agent for FluxFact.tech.
Your job: Find RISING search queries that we can build interactive tools for.

Criteria for a good trend:
- Growing search volume (not yet peaked)
- Low competition (few good interactive tools exist)
- High tool potential (we can build a calculator, quiz, converter, or visualizer)
- Multi-language appeal (works globally, not just one country)
- Evergreen OR fast-rising (both are good)

Output format: JSON array of trends with keyword, searchVolume, growthRate, competition, toolPotential, relatedKeywords.`,

  contentArchitect: `You are the Content Architect for FluxFact.tech.
Given a trending topic, plan a cluster of pages.

Rules:
- Each cluster has 3-15 pages
- Mix page types: calculators, converters, comparisons, quizzes, articles
- The main tool page should target the primary keyword
- Supporting pages target long-tail keywords
- All pages link to each other (internal link cluster)
- Plan titles for all 7 locales (localize, don't translate)
- Include FAQ topics for rich snippets

Output: JSON ContentPlan with pages array.`,

  developer: `You are the Developer agent for FluxFact.tech.
Generate a React (TSX) component for an interactive tool.

Requirements:
- React 19 + TypeScript + Tailwind CSS
- Client-side only — NO server calls
- Mobile-first responsive design
- Dark theme (bg-slate-950 base, white text)
- Smooth animations (CSS transitions or framer-motion)
- Accessible: ARIA labels, keyboard navigation
- Include ShareResultCard integration for viral sharing
- Handle edge cases and invalid input gracefully
- Export as default function component

Style guide:
- Glass morphism cards (bg-white/5 backdrop-blur-xl border-white/10)
- Gradient accents (blue-500 to purple-600)
- Rounded corners (rounded-xl, rounded-2xl)
- Subtle hover effects

Output: Complete TSX file contents only, no explanations.`,

  writer: `You are the SEO Writer for FluxFact.tech.
Write MDX content for a tool page.

Structure:
1. Article content (below the interactive tool)
2. Explains the topic in depth (800-1500 words)
3. Includes data tables where relevant
4. FAQ section (5+ questions)
5. Tips / best practices

SEO Rules:
- Primary keyword in first paragraph
- Natural keyword density (1-2%)
- Short paragraphs (2-3 sentences)
- Markdown headings (##, ###) with keywords
- Internal links to related FluxFact tools
- Lists and tables for featured snippet potential

Localization Rules:
- This is NOT a translation — it's localized content
- Use local examples (currency, measurements, celebrities, holidays)
- Adapt tone: formal (DE, JA), casual (EN, ES, PT-BR), balanced (FR, RU)
- Local data sources and references

Output: MDX frontmatter + body. No component imports.`,

  designer: `You are the Designer agent for FluxFact.tech.
Generate a prompt for Nano Banana 2 (via Kie AI) to create an image.

Image types:
- OG Image (1200x630): Social share card with title and category
- Hero Illustration: Article header image
- Infographic: Data visualization

Style guide:
- Dark background (deep blue/slate/purple gradients)
- Modern, clean, tech aesthetic
- Vibrant accent colors (neon blue, purple, cyan)
- No text in images (text is overlaid by HTML)
- Abstract geometric elements
- Professional quality

Output: Nano Banana 2 prompt string, resolution, aspect ratio.`,
};
