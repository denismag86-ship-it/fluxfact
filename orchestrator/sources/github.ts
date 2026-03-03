/**
 * GitHub Trending Source — fetches trending repos and maps to TrendSignals.
 *
 * Uses GitHub Search API (no auth needed for basic usage, 10 req/min).
 * Strategy: find repos with explosive star growth in last 7 days.
 */
import type { TrendSignal } from '../lib/types';

interface GitHubRepo {
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  pushed_at: string;
}

interface GitHubSearchResponse {
  items: GitHubRepo[];
  total_count: number;
}

/** Category mapping from GitHub topics/languages */
const TOPIC_CATEGORIES: Record<string, TrendSignal['category']> = {
  'artificial-intelligence': 'ai', 'machine-learning': 'ai', 'llm': 'ai',
  'deep-learning': 'ai', 'gpt': 'ai', 'chatgpt': 'ai', 'openai': 'ai',
  'langchain': 'ai', 'rag': 'ai', 'agents': 'ai', 'diffusion': 'ai',
  'crypto': 'finance', 'cryptocurrency': 'finance', 'defi': 'finance',
  'bitcoin': 'finance', 'ethereum': 'finance', 'trading': 'finance',
  'fintech': 'finance', 'web3': 'finance',
  'security': 'security', 'cybersecurity': 'security', 'hacking': 'security',
  'privacy': 'security', 'encryption': 'security',
  'productivity': 'productivity', 'automation': 'productivity',
  'cli': 'productivity', 'devtools': 'productivity', 'workflow': 'productivity',
};

function categorize(repo: GitHubRepo): TrendSignal['category'] {
  // Check topics first
  for (const topic of repo.topics) {
    const cat = TOPIC_CATEGORIES[topic.toLowerCase()];
    if (cat) return cat;
  }
  // Check description
  const desc = (repo.description ?? '').toLowerCase();
  if (/\b(ai|llm|gpt|machine.?learning|neural|diffusion|model)\b/.test(desc)) return 'ai';
  if (/\b(crypto|defi|trading|finance|bitcoin|ethereum)\b/.test(desc)) return 'finance';
  if (/\b(security|hack|vuln|exploit|privacy)\b/.test(desc)) return 'security';
  if (/\b(productiv|automat|workflow|cli tool)\b/.test(desc)) return 'productivity';
  return 'tech';
}

function extractTags(repo: GitHubRepo): string[] {
  const tags = [...repo.topics.slice(0, 5)];
  if (repo.language) tags.push(repo.language.toLowerCase());
  return [...new Set(tags)];
}

/**
 * Fetch trending GitHub repos (created or surged in last 7 days).
 */
export async function fetchGitHubTrending(limit = 30): Promise<TrendSignal[]> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const dateStr = weekAgo.toISOString().split('T')[0];

  // Strategy 1: repos created in last 7 days with 100+ stars (viral new repos)
  const newReposUrl = `https://api.github.com/search/repositories?q=created:>${dateStr}+stars:>100&sort=stars&order=desc&per_page=${limit}`;

  // Strategy 2: repos with recent push and high stars (surging established repos)
  const surgingUrl = `https://api.github.com/search/repositories?q=pushed:>${dateStr}+stars:>1000&sort=stars&order=desc&per_page=${Math.floor(limit / 2)}`;

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'FluxFact-TrendScout/1.0',
  };

  // Add token if available
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const results: TrendSignal[] = [];

  try {
    // Fetch new viral repos
    const res1 = await fetch(newReposUrl, { headers });
    if (res1.ok) {
      const data: GitHubSearchResponse = await res1.json();
      for (const repo of data.items) {
        const daysSinceCreated = Math.max(1, (Date.now() - new Date(repo.created_at).getTime()) / 86400000);
        const starsPerDay = repo.stargazers_count / daysSinceCreated;

        results.push({
          title: repo.full_name,
          url: repo.html_url,
          source: 'github',
          category: categorize(repo),
          engagement: repo.stargazers_count,
          velocity: Math.round(starsPerDay),
          description: repo.description ?? '',
          tags: extractTags(repo),
          detectedAt: new Date(),
          meta: {
            language: repo.language,
            starsPerDay: Math.round(starsPerDay * 10) / 10,
            isNew: daysSinceCreated <= 7,
          },
        });
      }
    }

    // Small delay to respect rate limits
    await new Promise((r) => setTimeout(r, 1000));

    // Fetch surging established repos
    const res2 = await fetch(surgingUrl, { headers });
    if (res2.ok) {
      const data: GitHubSearchResponse = await res2.json();
      for (const repo of data.items) {
        // Skip if already in results
        if (results.some((r) => r.url === repo.html_url)) continue;

        results.push({
          title: repo.full_name,
          url: repo.html_url,
          source: 'github',
          category: categorize(repo),
          engagement: repo.stargazers_count,
          velocity: 0, // Can't calculate without historical data
          description: repo.description ?? '',
          tags: extractTags(repo),
          detectedAt: new Date(),
          meta: {
            language: repo.language,
            isNew: false,
          },
        });
      }
    }
  } catch (err) {
    console.error('[GitHub] Fetch error:', err);
  }

  // Sort by velocity (new repos) then by engagement (established)
  return results.sort((a, b) => b.velocity - a.velocity || b.engagement - a.engagement);
}
