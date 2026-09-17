import { getCollection, type CollectionEntry } from 'astro:content';

export type Issue = CollectionEntry<'issues'>;

const publishedAt = (i: Issue) => i.data.publish_date?.valueOf() ?? 0;

/** `summer-2026` — the slug the /issues/ routes are built on. */
export function issueSlug(i: Issue): string {
  return i.id.replace(/\.md$/, '');
}

/** "Summer Issue" — the season, cased for a nav item. */
export function issueLabel(i: Issue): string {
  const s = i.data.season;
  return `${s.charAt(0).toUpperCase()}${s.slice(1)} Issue`;
}

/**
 * The issue that is out now: the most recently published one, where
 * anything dated in the future is still forthcoming.
 *
 * This rule was written out separately in the masthead, the subscribe
 * page and the home page, and the footer gave up and hardcoded
 * `/issues/spring-2026` — which was right until Summer published and
 * silently wrong afterwards. Anything that needs "the current issue"
 * should ask here, so the day Fall lands it moves everywhere at once.
 */
export async function getCurrentIssue(): Promise<Issue | undefined> {
  const issues = await getCollection('issues');
  const now = Date.now();
  return issues
    .filter((i) => publishedAt(i) <= now)
    .sort((a, b) => publishedAt(b) - publishedAt(a))[0];
}

/** Where "the current issue" points, with the archive as a fallback. */
export async function currentIssueHref(): Promise<string> {
  const i = await getCurrentIssue();
  return i ? `/issues/${issueSlug(i)}` : '/archive';
}
