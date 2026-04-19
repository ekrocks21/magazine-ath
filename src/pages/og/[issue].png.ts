/**
 * Per-issue Open Graph image.
 *   URL shape: /og/{issue-slug}.png
 */

import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { renderOgImage } from '../../utils/og-image';

export async function getStaticPaths() {
  const issues = await getCollection('issues');
  return issues.map((i) => ({
    params: { issue: i.id.replace(/\.md$/, '') },
    props: { issue: i },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const issue = props.issue as Awaited<ReturnType<typeof getCollection>>[number];
  const d = issue.data;
  const seasonLabel = d.season.charAt(0).toUpperCase() + d.season.slice(1);

  const png = await renderOgImage({
    title: d.theme ?? d.title,
    sub: d.tagline ?? undefined,
    kicker: `Issue No. ${String(d.issue_number).padStart(2, '0')} · ${seasonLabel} ${d.year}`,
    footer: 'The Local Lookout',
  });

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
