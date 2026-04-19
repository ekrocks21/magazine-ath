/**
 * Open-Graph composite generator.
 *
 * Builds a 1200×630 PNG with the ATH masthead treatment: paper background,
 * rust accent rule, Playfair title (falls to Georgia/serif when Playfair
 * isn't installed on the build host), small-caps issue label.
 *
 * Implemented by rendering an SVG with inline `<text>` nodes, then piping
 * through sharp for rasterization. We intentionally avoid bundling font
 * files — Netlify's build container has Georgia and Liberation Serif,
 * which render Playfair-like enough at this size for social preview use.
 *
 * Produced PNGs are served from /og/{route}.png endpoints. Each page's
 * `og:image` meta points at its matching PNG.
 */

import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;

// Palette (matches global.css)
const PAPER = '#FDFAF5';
const INK = '#1A1208';
const INK_SOFT = '#3D3020';
const RUST = '#8B3A2A';
const MUTED = '#7A6F5F';
const SAND = '#C9B99A';

export interface OgInput {
  /** Primary headline (article title, issue name, or site name). */
  title: string;
  /** "Issue No. 02 · Spring 2026" or similar. */
  kicker?: string;
  /** Optional italic sub-line (issue theme, dek). */
  sub?: string;
  /** Optional footer line (author, date). */
  footer?: string;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Break a title onto up to 3 lines. Targets ~18 chars/line at 88px so the
 * heading fits the canvas cleanly. Doesn't need to be perfect — social
 * crawlers forgive a lot.
 */
function wrap(title: string, max: number, maxLines: number): string[] {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > max && cur) {
      lines.push(cur);
      cur = w;
      if (lines.length >= maxLines - 1) {
        // Greedy-fit remaining words on the last line with ellipsis.
        let last = cur;
        for (let j = i + 1; j < words.length; j++) {
          const candidate = `${last} ${words[j]}`;
          if (candidate.length > max) {
            last = `${last}…`;
            break;
          }
          last = candidate;
          if (j === words.length - 1 && last.length >= max - 3) {
            // Room exhausted and we consumed everything — clean end.
          }
        }
        lines.push(last);
        cur = '';
        break;
      }
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function buildSvg({ title, kicker, sub, footer }: OgInput): string {
  const lines = wrap(title, 22, 3);
  const titleStartY = 260 - (lines.length - 1) * 48;

  const lineEls = lines
    .map(
      (line, i) =>
        `<tspan x="80" dy="${i === 0 ? 0 : 104}">${escapeXml(line)}</tspan>`,
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}" />

  <!-- top-left masthead -->
  <text x="80" y="88" font-family="Georgia, 'Times New Roman', serif" font-size="14" letter-spacing="4" fill="${MUTED}" font-weight="400" text-transform="uppercase">
    ABOVE THE HOOK · QUARTERLY
  </text>
  <text x="80" y="120" font-family="Georgia, 'Times New Roman', serif" font-size="30" font-weight="700" fill="${INK}" letter-spacing="-0.5">
    The Local <tspan font-style="italic" font-weight="400" fill="${RUST}">Lookout</tspan>
  </text>

  <!-- Title -->
  <text x="80" y="${titleStartY}" font-family="Georgia, 'Times New Roman', serif" font-size="88" font-weight="700" fill="${INK}" letter-spacing="-2">
    ${lineEls}
  </text>

  ${
    sub
      ? (() => {
          const subLines = wrap(sub, 62, 2);
          const subY = titleStartY + lines.length * 104 - 20;
          return subLines
            .map(
              (line, i) =>
                `<text x="80" y="${subY + i * 38}" font-family="Georgia, 'Times New Roman', serif" font-size="26" font-style="italic" fill="${INK_SOFT}">${escapeXml(line)}</text>`,
            )
            .join('\n');
        })()
      : ''
  }

  <!-- Rust rule above the footer -->
  <rect x="80" y="${HEIGHT - 100}" width="80" height="3" fill="${RUST}" />

  ${
    kicker
      ? `<text x="80" y="${HEIGHT - 60}" font-family="Georgia, 'Times New Roman', serif" font-size="16" letter-spacing="3" fill="${MUTED}">${escapeXml(kicker.toUpperCase())}</text>`
      : ''
  }
  ${
    footer
      ? `<text x="80" y="${HEIGHT - 30}" font-family="Georgia, 'Times New Roman', serif" font-size="14" fill="${MUTED}">${escapeXml(footer)}</text>`
      : ''
  }

  <!-- URL, right-aligned -->
  <text x="${WIDTH - 80}" y="${HEIGHT - 30}" text-anchor="end" font-family="Georgia, 'Times New Roman', serif" font-size="14" fill="${SAND}">
    magazine.abovethehook.com
  </text>
</svg>`;
}

/**
 * Render an SVG-described OG image to a PNG buffer.
 */
export async function renderOgImage(input: OgInput): Promise<Buffer> {
  const svg = buildSvg(input);
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
