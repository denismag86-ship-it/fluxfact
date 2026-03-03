/**
 * Reddit Source — fetches hot posts from relevant subreddits.
 *
 * Uses public JSON API (no auth needed, append .json to any URL).
 * Rate limit: ~30 req/min without auth.
 */
import type { TrendSignal } from '../lib/types';

interface RedditPost {
  data: {
    title: string;
    url: string;
    permalink: string;
    score: number;
    num_comments: number;
    created_utc: number;
    subreddit: string;
    selftext: string;
    link_flair_text: string | null;
    is_self: boolean;
  };
}

interface RedditListing {
  data: {
    children: RedditPost[];
  };
}

/** Subreddits to monitor, grouped by category */
const SUBREDDITS: Record<TrendSignal['category'], string[]> = {
  tech: ['technology', 'webdev', 'programming', 'software'],
  ai: ['artificial', 'MachineLearning', 'LocalLLaMA', 'ChatGPT', 'singularity'],
  finance: ['CryptoCurrency', 'investing', 'personalfinance', 'stocks'],
  productivity: ['productivity', 'LifeProTips', 'coolguides', 'InternetIsBeautiful'],
  security: ['netsec', 'cybersecurity', 'privacy'],
  general: ['todayilearned', 'Futurology'],
};

/**
 * Fetch hot posts from relevant subreddits.
 */
export async function fetchReddit(limit = 30): Promise<TrendSignal[]> {
  const results: TrendSignal[] = [];
  const cutoffTime = Date.now() / 1000 - 24 * 3600;

  const allSubs = Object.entries(SUBREDDITS);

  for (const [category, subs] of allSubs) {
    for (const sub of subs) {
      if (results.length >= limit) break;

      try {
        const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=10`, {
          headers: { 'User-Agent': 'FluxFact-TrendScout/1.0' },
        });
        if (!res.ok) continue;

        const data: RedditListing = await res.json();

        for (const post of data.data.children) {
          const p = post.data;
          if (p.created_utc < cutoffTime) continue;
          if (p.score < 100) continue; // Skip low-engagement posts

          const ageHours = Math.max(1, (Date.now() / 1000 - p.created_utc) / 3600);
          const scorePerHour = p.score / ageHours;

          results.push({
            title: p.title,
            url: p.is_self ? `https://reddit.com${p.permalink}` : p.url,
            source: 'reddit',
            category: category as TrendSignal['category'],
            engagement: p.score,
            velocity: Math.round(scorePerHour * 10) / 10,
            description: p.selftext?.slice(0, 300) || p.title,
            tags: [sub.toLowerCase(), category, ...(p.link_flair_text ? [p.link_flair_text.toLowerCase()] : [])],
            detectedAt: new Date(),
            meta: {
              subreddit: p.subreddit,
              comments: p.num_comments,
              scorePerHour: Math.round(scorePerHour * 10) / 10,
              permalink: p.permalink,
            },
          });
        }

        // Respect rate limits
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error(`[Reddit] Error fetching r/${sub}:`, err);
      }
    }
  }

  return results
    .sort((a, b) => b.velocity - a.velocity)
    .slice(0, limit);
}
