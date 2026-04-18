/**
 * RSS feed — /rss.xml
 *
 * Emits an entry per published article. Drafts are hidden on production
 * regardless of PUBLIC_INCLUDE_DRAFTS so feed subscribers never see them.
 */

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const site = context.site ?? new URL('https://magazine.abovethehook.com');

  // Always exclude drafts from the feed regardless of env context.
  const articles = (await getCollection('articles', ({ data }) =>
    data.status !== 'draft',
  )).sort((a, b) => {
    const da = a.data.publish_date?.valueOf() ?? 0;
    const db = b.data.publish_date?.valueOf() ?? 0;
    return db - da;
  });

  return rss({
    title: 'The Local Lookout',
    description:
      'The quarterly print magazine of Above the Hook. Coastal New Jersey, observed.',
    site,
    items: articles.map((a) => {
      const [issueSlug, fileName] = a.id.split('/');
      const articleSlug = fileName.replace(/\.md$/, '');
      return {
        title: a.data.title,
        description: a.data.dek ?? undefined,
        link: `/issues/${issueSlug}/${articleSlug}`,
        pubDate: a.data.publish_date,
        author: a.data.byline ?? a.data.author,
        categories: [a.data.pillar, ...a.data.tags],
      };
    }),
    customData: '<language>en-us</language>',
  });
}
