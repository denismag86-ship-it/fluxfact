/**
 * FluxFact Image Generation — Nano Banana 2 via Kie AI
 *
 * Used by the orchestrator (Claude SDK) to generate:
 * - OG images for social sharing
 * - Article illustrations
 * - Tool result share cards
 * - Infographics and data visualizations
 *
 * This module runs in the orchestrator (Node.js), NOT in the browser.
 */

export interface ImageGenerationConfig {
  /** Kie AI API key */
  apiKey: string;
  /** Base URL for Kie AI API */
  baseUrl: string;
  /** Default resolution */
  defaultResolution: '512' | '1024' | '2048' | '4096';
}

export interface GenerateImageRequest {
  prompt: string;
  /** Negative prompt to avoid unwanted elements */
  negativePrompt?: string;
  /** Resolution (px) */
  resolution?: '512' | '1024' | '2048' | '4096';
  /** Aspect ratio */
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  /** Style preset */
  style?: 'photorealistic' | 'illustration' | 'infographic' | 'minimal' | 'vibrant';
}

export interface GenerateImageResult {
  url: string;
  width: number;
  height: number;
  cost: number;
}

/**
 * Prompt templates for different content types.
 * The orchestrator fills in {variables} before calling generate.
 */
export const imagePromptTemplates = {
  ogImage: `Clean, modern social media card for "{title}".
Dark gradient background (deep blue to purple).
Large, bold white text: "{headline}".
Subtle tech/data visualization elements.
Brand: FluxFact logo bottom-right.
Style: minimal, professional, high contrast.
No text artifacts or watermarks.`,

  articleHero: `Editorial illustration for article about {topic}.
Modern, clean style with vibrant colors.
Abstract geometric elements mixed with realistic details.
Wide format 16:9. Professional quality.
No text in the image.`,

  toolResult: `Data visualization card showing {metric} = {value}.
Dark background, neon accent colors (blue, purple, cyan).
Modern dashboard aesthetic.
Clean typography, bold numbers.
Shareable social card format.`,

  infographic: `Clean infographic about {topic}.
{dataPoints} data points visualized.
Modern flat design, dark theme.
Color palette: blue, purple, cyan accents on dark slate.
Professional, trustworthy aesthetic.`,

  comparison: `Side-by-side comparison visualization: {itemA} vs {itemB}.
Split design with contrasting colors.
Key metrics highlighted with icons.
Modern, clean, dark background.`,
} as const;

/**
 * Generate alt text for SEO (critical for image SEO + accessibility).
 * Called by orchestrator after image generation.
 */
export function generateAltText(params: {
  type: 'og' | 'hero' | 'result' | 'infographic' | 'comparison';
  title: string;
  context?: string;
}): string {
  const { type, title, context } = params;

  switch (type) {
    case 'og':
      return `${title} — FluxFact interactive tool`;
    case 'hero':
      return `Illustration for ${title}${context ? `: ${context}` : ''}`;
    case 'result':
      return `Results visualization: ${title}`;
    case 'infographic':
      return `Infographic about ${title}${context ? ` showing ${context}` : ''}`;
    case 'comparison':
      return `Comparison chart: ${title}`;
    default:
      return title;
  }
}

/**
 * Generate structured image metadata for Schema.org.
 */
export function generateImageSchema(params: {
  url: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
}) {
  return {
    '@type': 'ImageObject',
    url: params.url,
    width: params.width,
    height: params.height,
    caption: params.caption ?? params.alt,
  };
}

/**
 * Cost estimator for budget planning.
 * Nano Banana 2 via Kie AI pricing.
 */
export function estimateImageCost(params: {
  count: number;
  resolution: '512' | '1024' | '2048' | '4096';
  batch?: boolean;
}): { perImage: number; total: number } {
  // Kie AI pricing for Nano Banana 2
  const prices: Record<string, number> = {
    '512': 0.03,
    '1024': 0.04,
    '2048': 0.06,
    '4096': 0.09,
  };

  const perImage = prices[params.resolution] * (params.batch ? 0.5 : 1);
  return {
    perImage,
    total: perImage * params.count,
  };
}
