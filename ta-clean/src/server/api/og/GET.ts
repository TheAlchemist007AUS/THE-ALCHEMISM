import type { Request, Response } from 'express';

/**
 * OG image endpoint — returns an SVG-based social preview card.
 * Usage: /api/og?title=Page+Title&description=Short+description&platform=tiktok|kick|spotify
 *
 * The optional `platform` param renders a platform-branded accent colour
 * so shared links look native on TikTok, Kick, and Spotify.
 */
export default function handler(req: Request, res: Response) {
  const title = String(req.query.title ?? 'The Alchemism').slice(0, 80);
  const description = String(req.query.description ?? 'Transform. Create. Transcend.').slice(0, 160);
  const platform = String(req.query.platform ?? '').toLowerCase();

  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Platform accent colours
  const platformConfig: Record<string, { color: string; label: string; icon: string }> = {
    tiktok: {
      color: '#ff0050',
      label: 'TIKTOK · @thealchemist1086',
      icon: 'M',
    },
    kick: {
      color: '#53fc18',
      label: 'KICK · alchy-007',
      icon: 'K',
    },
    spotify: {
      color: '#1db954',
      label: 'SPOTIFY · THE ALCHEMISM',
      icon: 'S',
    },
  };

  const pc = platformConfig[platform] ?? null;
  const accentColor = pc ? pc.color : '#C9922A';
  const platformLabel = pc ? pc.label : null;

  // Word-wrap description to ~60 chars per line
  const words = escape(description).split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > 62) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  }
  if (current) lines.push(current.trim());
  const descLines = lines.slice(0, 3);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0E0C0A"/>
      <stop offset="100%" stop-color="#1a150d"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="4" fill="${accentColor}"/>

  <!-- Bottom accent bar (platform tint) -->
  <rect x="0" y="626" width="1200" height="4" fill="${accentColor}" opacity="0.4"/>

  <!-- Decorative sigil -->
  <circle cx="980" cy="315" r="260" stroke="${accentColor}" stroke-width="0.5" fill="none" opacity="0.15"/>
  <circle cx="980" cy="315" r="200" stroke="${accentColor}" stroke-width="0.5" fill="none" opacity="0.1"/>
  <polygon points="980,80 1180,430 780,430" stroke="${accentColor}" stroke-width="0.8" fill="none" opacity="0.12"/>
  <polygon points="980,550 780,200 1180,200" stroke="${accentColor}" stroke-width="0.8" fill="none" opacity="0.08"/>

  <!-- Left accent line -->
  <rect x="80" y="80" width="3" height="470" fill="${accentColor}" opacity="0.5"/>

  <!-- Brand label -->
  <text x="104" y="118" font-family="Georgia, serif" font-size="14" letter-spacing="6" fill="${accentColor}" text-anchor="start" font-weight="bold">THE ALCHEMISM</text>

  ${platformLabel ? `<!-- Platform badge -->
  <rect x="104" y="134" width="${platformLabel.length * 8 + 20}" height="24" rx="3" fill="${accentColor}" opacity="0.15"/>
  <text x="114" y="151" font-family="Arial, sans-serif" font-size="11" letter-spacing="2" fill="${accentColor}" text-anchor="start" font-weight="bold">${escape(platformLabel)}</text>` : ''}

  <!-- Title -->
  <text x="104" y="${platformLabel ? '280' : '260'}" font-family="Georgia, serif" font-size="58" fill="#F5F5F5" text-anchor="start" font-weight="bold">${escape(title)}</text>

  <!-- Description lines -->
  ${descLines.map((line, i) => `<text x="104" y="${(platformLabel ? 340 : 320) + i * 36}" font-family="Arial, sans-serif" font-size="22" fill="#999999" text-anchor="start">${line}</text>`).join('\n  ')}

  <!-- Bottom tagline -->
  <text x="104" y="560" font-family="Georgia, serif" font-size="16" letter-spacing="4" fill="${accentColor}" text-anchor="start" opacity="0.7">TRANSFORM · CREATE · TRANSCEND</text>

  <!-- Domain -->
  <text x="104" y="590" font-family="Arial, sans-serif" font-size="13" letter-spacing="2" fill="#555555" text-anchor="start">ogthealchemist.com</text>
</svg>`;

  res
    .status(200)
    .set('Content-Type', 'image/svg+xml')
    .set('Cache-Control', 'public, max-age=86400')
    .send(svg);
}
