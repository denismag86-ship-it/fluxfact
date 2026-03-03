/**
 * Core types for the FluxFact content pipeline.
 */

/** A raw trend signal from any source */
export interface TrendSignal {
  title: string;
  url: string;
  source: 'github' | 'reddit' | 'hackernews' | 'google-trends' | 'producthunt';
  category: 'tech' | 'ai' | 'finance' | 'productivity' | 'security' | 'general';
  /** Engagement score from source (stars, upvotes, etc.) */
  engagement: number;
  /** Growth velocity — how fast is it rising? */
  velocity: number;
  /** Raw description/snippet */
  description: string;
  /** Tags/topics extracted */
  tags: string[];
  /** When this trend was detected */
  detectedAt: Date;
  /** Extra source-specific metadata */
  meta?: Record<string, unknown>;
}

/** A scored and enriched trend ready for content planning */
export interface ScoredTrend {
  /** Primary keyword/topic */
  keyword: string;
  /** One-line description */
  description: string;
  /** Combined score 0-100 */
  score: number;
  /** Breakdown of score components */
  scoreBreakdown: {
    engagement: number;   // 0-25
    velocity: number;     // 0-25
    contentPotential: number; // 0-25
    viralPotential: number;   // 0-25
  };
  /** Best content types for this trend */
  suggestedContentTypes: ContentType[];
  /** Suggested category */
  category: string;
  /** Which type of FluxFact content? */
  contentFormat: 'tool' | 'lifehack' | 'news';
  /** Related keywords for SEO cluster */
  relatedKeywords: string[];
  /** Source signals that contributed */
  signals: TrendSignal[];
  /** Key person mentioned (if any) */
  person?: string;
}

export type ContentType =
  | 'calculator'
  | 'converter'
  | 'comparison'
  | 'quiz'
  | 'visualizer'
  | 'generator'
  | 'checker'
  | 'howto'      // Lifehack / tutorial
  | 'roundup'    // "Top 10" / curated list
  | 'analysis'   // News analysis / breakdown
  | 'article';

/** Trend Scout configuration */
export interface TrendScoutConfig {
  /** Max trends to return per run */
  maxTrends: number;
  /** Minimum score to include (0-100) */
  minScore: number;
  /** Categories to focus on */
  categories: string[];
  /** Source weights for scoring */
  sourceWeights: Record<string, number>;
}
