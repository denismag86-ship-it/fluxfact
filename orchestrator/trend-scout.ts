/**
 * Trend Scout — main entry point.
 *
 * Fetches signals from all sources, scores, ranks, and outputs
 * actionable trends for the Content Architect agent.
 *
 * Run: npx tsx orchestrator/trend-scout.ts
 */
import { fetchGitHubTrending } from './sources/github';
import { fetchHackerNews } from './sources/hackernews';
import { fetchReddit } from './sources/reddit';
import { scoreAndRank } from './lib/scorer';
import type { TrendSignal, ScoredTrend } from './lib/types';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(import.meta.dirname ?? '.', '..', 'data');

async function run() {
  console.log('\n=== FluxFact Trend Scout ===');
  console.log(`Time: ${new Date().toISOString()}\n`);

  // 1. Fetch signals from all sources in parallel
  console.log('[1/3] Fetching signals from sources...');

  const [github, hn, reddit] = await Promise.all([
    fetchGitHubTrending(20).catch((e) => { console.error('GitHub failed:', e.message); return [] as TrendSignal[]; }),
    fetchHackerNews(20).catch((e) => { console.error('HN failed:', e.message); return [] as TrendSignal[]; }),
    fetchReddit(20).catch((e) => { console.error('Reddit failed:', e.message); return [] as TrendSignal[]; }),
  ]);

  console.log(`  GitHub: ${github.length} signals`);
  console.log(`  HN:     ${hn.length} signals`);
  console.log(`  Reddit: ${reddit.length} signals`);

  const allSignals = [...github, ...hn, ...reddit];
  console.log(`  Total:  ${allSignals.length} raw signals\n`);

  if (allSignals.length === 0) {
    console.log('No signals found. Check network/API access.');
    return;
  }

  // 2. Score and rank
  console.log('[2/3] Scoring and ranking...');
  const trends = scoreAndRank(allSignals);
  console.log(`  Scored trends: ${trends.length}\n`);

  // 3. Output
  console.log('[3/3] Results:\n');
  console.log('─'.repeat(80));

  for (let i = 0; i < trends.length; i++) {
    const t = trends[i];
    const icon = t.contentFormat === 'news' ? '📰' : t.contentFormat === 'lifehack' ? '💡' : '🔧';
    const personTag = t.person ? ` [${t.person}]` : '';

    console.log(`${icon} #${i + 1} [${t.score}/100] ${t.keyword}${personTag}`);
    console.log(`   Category: ${t.category} | Format: ${t.contentFormat}`);
    console.log(`   Score: E:${t.scoreBreakdown.engagement} V:${t.scoreBreakdown.velocity} C:${t.scoreBreakdown.contentPotential} W:${t.scoreBreakdown.viralPotential}`);
    console.log(`   Content types: ${t.suggestedContentTypes.join(', ')}`);
    console.log(`   Sources: ${t.signals.map((s) => s.source).join(', ')}`);
    console.log(`   Keywords: ${t.relatedKeywords.slice(0, 5).join(', ')}`);
    console.log('─'.repeat(80));
  }

  // Save to file
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const outPath = join(OUTPUT_DIR, `trends-${new Date().toISOString().slice(0, 10)}.json`);
  writeFileSync(outPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    signalCounts: { github: github.length, hn: hn.length, reddit: reddit.length },
    trends: trends.map((t) => ({
      ...t,
      signals: t.signals.map((s) => ({
        title: s.title,
        url: s.url,
        source: s.source,
        engagement: s.engagement,
        velocity: s.velocity,
      })),
    })),
  }, null, 2));

  console.log(`\nSaved to: ${outPath}`);
  return trends;
}

// Run if called directly
run().catch(console.error);

export { run as runTrendScout };
