/**
 * Trend Scorer — takes raw signals from all sources, deduplicates,
 * merges, scores, and produces ranked ScoredTrend list.
 */
import type { TrendSignal, ScoredTrend, ContentType, TrendScoutConfig } from './types';

const DEFAULT_CONFIG: TrendScoutConfig = {
  maxTrends: 20,
  minScore: 30,
  categories: ['tech', 'ai', 'finance', 'productivity', 'security'],
  sourceWeights: {
    github: 1.2,      // High signal — people star what they use
    hackernews: 1.0,   // Quality tech discussion
    reddit: 0.8,       // Broad but noisy
    'google-trends': 1.3, // Direct search demand signal
    producthunt: 0.9,
  },
};

/** Group similar signals by fuzzy keyword matching */
function groupSignals(signals: TrendSignal[]): Map<string, TrendSignal[]> {
  const groups = new Map<string, TrendSignal[]>();

  for (const signal of signals) {
    const key = normalizeKeyword(signal.title);
    let matched = false;

    for (const [existingKey, group] of groups) {
      if (isSimilar(key, existingKey) || sharesTags(signal, group[0])) {
        group.push(signal);
        matched = true;
        break;
      }
    }

    if (!matched) {
      groups.set(key, [signal]);
    }
  }

  return groups;
}

function normalizeKeyword(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

function isSimilar(a: string, b: string): boolean {
  // Simple word overlap check
  const wordsA = new Set(a.split(' ').filter((w) => w.length > 3));
  const wordsB = new Set(b.split(' ').filter((w) => w.length > 3));
  if (wordsA.size === 0 || wordsB.size === 0) return false;

  let overlap = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) overlap++;
  }

  return overlap / Math.min(wordsA.size, wordsB.size) > 0.5;
}

function sharesTags(a: TrendSignal, b: TrendSignal): boolean {
  const tagsA = new Set(a.tags);
  return b.tags.some((t) => tagsA.has(t)) && a.source !== b.source;
}

/** Determine best content types for a trend */
function suggestContentTypes(signals: TrendSignal[]): ContentType[] {
  const types: ContentType[] = [];
  const categories = new Set(signals.map((s) => s.category));
  const hasGitHub = signals.some((s) => s.source === 'github');
  const hasPerson = signals.some((s) => (s.meta as Record<string, unknown>)?.person);
  const avgEngagement = signals.reduce((sum, s) => sum + s.engagement, 0) / signals.length;

  // GitHub repo → howto/comparison
  if (hasGitHub) {
    types.push('howto', 'comparison');
  }

  // Person mentioned → analysis/news
  if (hasPerson) {
    types.push('analysis');
  }

  // High engagement → roundup
  if (avgEngagement > 500) {
    types.push('roundup');
  }

  // Finance → calculator
  if (categories.has('finance')) {
    types.push('calculator', 'converter');
  }

  // Security → checker
  if (categories.has('security')) {
    types.push('checker');
  }

  // AI → visualizer/comparison
  if (categories.has('ai')) {
    types.push('comparison', 'visualizer');
  }

  // Always include article as fallback
  if (!types.includes('article')) types.push('article');

  return [...new Set(types)].slice(0, 4);
}

/** Determine content format (tool vs lifehack vs news) */
function determineFormat(signals: TrendSignal[]): 'tool' | 'lifehack' | 'news' {
  const hasPerson = signals.some((s) => (s.meta as Record<string, unknown>)?.person);
  const hasGitHub = signals.some((s) => s.source === 'github');
  const maxVelocity = Math.max(...signals.map((s) => s.velocity));

  // Very fast-moving + person = news
  if (hasPerson && maxVelocity > 50) return 'news';

  // GitHub trending = lifehack/howto
  if (hasGitHub) return 'lifehack';

  // High engagement on HN/Reddit = could be tool
  const avgEngagement = signals.reduce((sum, s) => sum + s.engagement, 0) / signals.length;
  if (avgEngagement > 300) return 'tool';

  return 'lifehack';
}

/**
 * Score and rank all trend signals into actionable ScoredTrends.
 */
export function scoreAndRank(
  signals: TrendSignal[],
  config: TrendScoutConfig = DEFAULT_CONFIG
): ScoredTrend[] {
  const groups = groupSignals(signals);
  const scored: ScoredTrend[] = [];

  for (const [, groupSignals] of groups) {
    // Skip single low-engagement signals
    if (groupSignals.length === 1 && groupSignals[0].engagement < 50) continue;

    // Calculate component scores
    const maxEngagement = Math.max(...signals.map((s) => s.engagement), 1);
    const maxVelocity = Math.max(...signals.map((s) => s.velocity), 1);

    // Engagement score (0-25): weighted sum of engagements across sources
    const engagementRaw = groupSignals.reduce((sum, s) => {
      const weight = config.sourceWeights[s.source] ?? 1.0;
      return sum + (s.engagement / maxEngagement) * weight;
    }, 0);
    const engagement = Math.min(25, Math.round((engagementRaw / groupSignals.length) * 25));

    // Velocity score (0-25): how fast is it growing?
    const velocityMax = Math.max(...groupSignals.map((s) => s.velocity));
    const velocity = Math.min(25, Math.round((velocityMax / maxVelocity) * 25));

    // Content potential (0-25): can we make something interactive?
    const contentTypes = suggestContentTypes(groupSignals);
    const interactiveTypes = contentTypes.filter((t) => !['article', 'analysis'].includes(t));
    const contentPotential = Math.min(25, Math.round((interactiveTypes.length / 3) * 25));

    // Viral potential (0-25): multi-source + person + high velocity
    const sourceCount = new Set(groupSignals.map((s) => s.source)).size;
    const hasPerson = groupSignals.some((s) => (s.meta as Record<string, unknown>)?.person);
    const viralPotential = Math.min(25,
      sourceCount * 8 + (hasPerson ? 8 : 0) + (velocityMax > 10 ? 5 : 0)
    );

    const totalScore = engagement + velocity + contentPotential + viralPotential;

    if (totalScore < config.minScore) continue;

    // Pick the best title/description
    const bestSignal = groupSignals.sort((a, b) => b.engagement - a.engagement)[0];
    const allTags = [...new Set(groupSignals.flatMap((s) => s.tags))].slice(0, 10);
    const person = groupSignals.find((s) => (s.meta as Record<string, unknown>)?.person)?.meta?.person as string | undefined;

    scored.push({
      keyword: bestSignal.title,
      description: bestSignal.description,
      score: totalScore,
      scoreBreakdown: { engagement, velocity, contentPotential, viralPotential },
      suggestedContentTypes: contentTypes,
      category: bestSignal.category,
      contentFormat: determineFormat(groupSignals),
      relatedKeywords: allTags,
      signals: groupSignals,
      person,
    });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, config.maxTrends);
}
