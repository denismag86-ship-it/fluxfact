/**
 * OG Image generation utilities.
 *
 * Two approaches:
 * 1. Static OG (build-time) — Satori generates PNG from JSX template
 * 2. Dynamic OG (share cards) — html2canvas captures tool result in browser
 *
 * This file handles the static approach.
 * For dynamic share cards, see components/tools/ — each tool has its own share card logic.
 */

/**
 * OG image template data for Satori/Vercel OG.
 * Used by the orchestrator to generate OG images at build time.
 */
export interface OgImageData {
  title: string;
  subtitle?: string;
  category?: string;
  gradient?: [string, string]; // from, to colors
  emoji?: string;
}

/**
 * Default gradient palettes per category
 */
export const categoryGradients: Record<string, [string, string]> = {
  finance: ['#3B82F6', '#8B5CF6'],
  health: ['#10B981', '#06B6D4'],
  tech: ['#6366F1', '#EC4899'],
  math: ['#F59E0B', '#EF4444'],
  travel: ['#14B8A6', '#3B82F6'],
  fun: ['#EC4899', '#F59E0B'],
  comparison: ['#8B5CF6', '#06B6D4'],
  converter: ['#6366F1', '#10B981'],
  default: ['#3B82F6', '#8B5CF6'],
};

/**
 * Generate SVG template for OG image (1200x630).
 * Can be rendered to PNG via Sharp or Satori.
 */
export function generateOgSvg(data: OgImageData): string {
  const [from, to] = data.gradient ?? categoryGradients[data.category ?? 'default'];

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${from};stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:${to};stop-opacity:0.15" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#0f172a" />
  <rect width="1200" height="630" fill="url(#bg)" />
  <!-- Decorative circles -->
  <circle cx="100" cy="100" r="200" fill="${from}" opacity="0.05" />
  <circle cx="1100" cy="530" r="250" fill="${to}" opacity="0.05" />
  <!-- Category badge -->
  ${data.category ? `<rect x="60" y="60" width="${data.category.length * 12 + 40}" height="36" rx="18" fill="${from}" opacity="0.3" />
  <text x="80" y="84" font-family="Inter, system-ui, sans-serif" font-size="16" font-weight="600" fill="white" opacity="0.9">${data.category.toUpperCase()}</text>` : ''}
  ${data.emoji ? `<text x="60" y="280" font-size="72">${data.emoji}</text>` : ''}
  <!-- Title -->
  <text x="60" y="${data.emoji ? '370' : '300'}" font-family="Inter, system-ui, sans-serif" font-size="48" font-weight="800" fill="white">
    ${wrapSvgText(data.title, 48, 1080)}
  </text>
  <!-- Subtitle -->
  ${data.subtitle ? `<text x="60" y="${data.emoji ? '420' : '360'}" font-family="Inter, system-ui, sans-serif" font-size="22" fill="#94a3b8">
    ${data.subtitle.slice(0, 80)}${data.subtitle.length > 80 ? '...' : ''}
  </text>` : ''}
  <!-- Brand -->
  <text x="60" y="580" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="700" fill="white">
    Flux<tspan fill="${from}">Fact</tspan>
  </text>
  <text x="1140" y="580" font-family="Inter, system-ui, sans-serif" font-size="16" fill="#64748b" text-anchor="end">fluxfact.tech</text>
</svg>`;
}

function wrapSvgText(text: string, fontSize: number, maxWidth: number): string {
  const approxCharWidth = fontSize * 0.55;
  const maxChars = Math.floor(maxWidth / approxCharWidth);

  if (text.length <= maxChars) return text;

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > maxChars) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = (currentLine + ' ' + word).trim();
    }
    if (lines.length >= 2) break; // Max 3 lines
  }
  if (currentLine) lines.push(currentLine);

  return lines
    .map((line, i) => (i === 0 ? line : `<tspan x="60" dy="56">${line}</tspan>`))
    .join('');
}
