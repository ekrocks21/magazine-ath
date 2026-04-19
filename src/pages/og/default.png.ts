/**
 * Site default Open Graph image — used by the landing page, /next,
 * /subscribe, /archive, /about.
 *   URL: /og/default.png
 */

import type { APIRoute } from 'astro';
import { renderOgImage } from '../../utils/og-image';

export const GET: APIRoute = async () => {
  const png = await renderOgImage({
    title: 'The Local Lookout',
    sub: 'A quarterly, rooted in Highlands, NJ.',
    kicker: 'From Above the Hook · Founded Winter 2026',
    footer: 'Four issues a year.',
  });

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
