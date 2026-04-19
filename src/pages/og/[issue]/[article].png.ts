/**
 * Per-article Open Graph image.
 *   URL shape: /og/{issue-slug}/{article-slug}.png
 *
 * Rendered at build time via Astro's static endpoints + sharp. Pointed at
 * from each article page's `og:image` meta in [article].astro.
 */

import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { renderOgImage } from '../../../utils/og-image';
import { articleRoute } from '../../../utils/article-route';

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map((a) => {
    const { issueSlug, articleSlug } = articleRoute(a);
    return {
      params: { issue: issueSlug, article: articleSlug },
      props: { article: a },
    };
  });
}

export const GET: APIRoute = async ({ props }) => {
  const article = props.article as Awaited<ReturnType<typeof getCollection>>[number];
  const issues = await getCollection('issues');
  const issue = issues.find(
    (i) => i.id.replace(/\.md$/, '') === article.data.issue,
  );

  const seasonLabel = article.data.season
    .charAt(0)
    .toUpperCase() + article.data.season.slice(1);

  const png = await renderOgImage({
    title: article.data.title,
    sub: article.data.dek || undefined,
    kicker: `Issue No. ${String(article.data.issue_number ?? '').padStart(2, '0')} · ${seasonLabel} ${article.data.year}`,
    footer: article.data.byline ?? article.data.author,
  });

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
