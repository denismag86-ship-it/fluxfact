/**
 * Hacker News Source — fetches top/best stories and maps to TrendSignals.
 *
 * Uses official HN API (no auth, no rate limits).
 * Focus: tech news, AI announcements, developer tools.
 */
import type { TrendSignal } from '../lib/types';

interface HNItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  descendants: number; // comment count
  by: string;
  time: number;
  type: string;
}

/** Key people to track — their posts/mentions get boosted */
const KEY_PEOPLE = [
  'sama', 'elonmusk', 'vitalik', 'karpathy', 'lexfridman',
  'paulg', 'dang', 'tptacek', 'patio11',
];

const CATEGORY_PATTERNS: [RegExp, TrendSignal['category']][] = [
  [/\b(ai|llm|gpt|claude|gemini|openai|anthropic|model|neural|diffusion|machine.?learn)\b/i, 'ai'],
  [/\b(crypto|bitcoin|ethereum|defi|web3|blockchain|token)\b/i, 'finance'],
  [/\b(security|hack|breach|vulnerability|exploit|privacy|zero.?day)\b/i, 'security'],
  [/\b(startup|fund|valuation|ipo|acquisition|revenue|profit)\b/i, 'finance'],
  [/\b(rust|go|python|typescript|react|nextjs|svelte|astro)\b/i, 'tech'],
  [/\b(productiv|automat|workflow|tool|cli|terminal)\b/i, 'productivity'],
];

function categorize(item: HNItem): TrendSignal['category'] {
  const text = `${item.title} ${item.url ?? ''}`;
  for (const [pattern, cat] of CATEGORY_PATTERNS) {
    if (pattern.test(text)) return cat;
  }
  return 'tech';
}

function detectPerson(title: string): string | undefined {
  const personPatterns: [RegExp, string][] = [
    [/\b(elon\s*musk|musk)\b/i, 'Elon Musk'],
    [/\b(sam\s*altman|altman)\b/i, 'Sam Altman'],
    [/\b(mark\s*zuckerberg|zuckerberg|meta)\b/i, 'Mark Zuckerberg'],
    [/\b(sundar\s*pichai|pichai|google)\b/i, 'Sundar Pichai'],
    [/\b(satya\s*nadella|nadella|microsoft)\b/i, 'Satya Nadella'],
    [/\b(jensen\s*huang|huang|nvidia)\b/i, 'Jensen Huang'],
    [/\b(vitalik\s*buterin|vitalik)\b/i, 'Vitalik Buterin'],
    [/\b(andrej\s*karpathy|karpathy)\b/i, 'Andrej Karpathy'],
    [/\b(dario\s*amodei|amodei|anthropic)\b/i, 'Dario Amodei'],
    [/\b(tim\s*cook|cook|apple)\b/i, 'Tim Cook'],
  ];
  for (const [pattern, name] of personPatterns) {
    if (pattern.test(title)) return name;
  }
  return undefined;
}

/**
 * Fetch top/best HN stories from the last 24h.
 */
export async function fetchHackerNews(limit = 30): Promise<TrendSignal[]> {
  const results: TrendSignal[] = [];
  const cutoffTime = Date.now() / 1000 - 24 * 3600; // Last 24 hours

  try {
    // Get top story IDs
    const topRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    if (!topRes.ok) return [];
    const topIds: number[] = await topRes.json();

    // Fetch first N stories in parallel (batches of 10)
    const idsToFetch = topIds.slice(0, Math.min(limit * 2, 60));
    const batchSize = 10;

    for (let i = 0; i < idsToFetch.length; i += batchSize) {
      const batch = idsToFetch.slice(i, i + batchSize);
      const items = await Promise.all(
        batch.map(async (id) => {
          const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return res.ok ? (await res.json()) as HNItem : null;
        })
      );

      for (const item of items) {
        if (!item || item.type !== 'story' || item.time < cutoffTime) continue;

        const ageHours = Math.max(1, (Date.now() / 1000 - item.time) / 3600);
        const scorePerHour = item.score / ageHours;
        const person = detectPerson(item.title);

        results.push({
          title: item.title,
          url: item.url ?? `https://news.ycombinator.com/item?id=${item.id}`,
          source: 'hackernews',
          category: categorize(item),
          engagement: item.score,
          velocity: Math.round(scorePerHour * 10) / 10,
          description: item.title, // HN titles are self-descriptive
          tags: [categorize(item), ...(person ? [person.toLowerCase().replace(/\s+/g, '-')] : [])],
          detectedAt: new Date(),
          meta: {
            comments: item.descendants ?? 0,
            author: item.by,
            scorePerHour: Math.round(scorePerHour * 10) / 10,
            person,
            isKeyPerson: KEY_PEOPLE.includes(item.by),
            hnId: item.id,
          },
        });
      }

      if (results.length >= limit) break;
    }
  } catch (err) {
    console.error('[HN] Fetch error:', err);
  }

  return results
    .sort((a, b) => b.velocity - a.velocity)
    .slice(0, limit);
}
