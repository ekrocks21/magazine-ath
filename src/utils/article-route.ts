/**
 * Resolve an article's route parts regardless of how its content-collection
 * id is shaped.
 *
 * Astro's glob loader uses the frontmatter `slug:` field as the id when the
 * schema declares it — which drops the directory prefix. So an entry at
 *   src/content/articles/spring-2026/the-forty-five-minutes.md
 *   (frontmatter: slug: the-forty-five-minutes)
 * has `a.id === "the-forty-five-minutes"`, not "spring-2026/the-forty-five-minutes".
 * Without `slug:` in frontmatter, `a.id === "spring-2026/the-forty-five-minutes"`.
 *
 * This helper makes every callsite tolerant of both shapes.
 */
import type { CollectionEntry } from 'astro:content';

export interface ArticleRoute {
  issueSlug: string;
  articleSlug: string;
  href: string;
}

export function articleRoute(a: CollectionEntry<'articles'>): ArticleRoute {
  const issueSlug = a.data.issue;
  const idParts = a.id.split('/');
  // When the id contains the issue dir, take the last segment; otherwise
  // the id already IS the slug. Prefer declared frontmatter slug if set.
  const lastSegment = idParts[idParts.length - 1] ?? '';
  const rawSlug = a.data.slug ?? lastSegment;
  const articleSlug = rawSlug.replace(/\.md$/, '');
  return {
    issueSlug,
    articleSlug,
    href: `/issues/${issueSlug}/${articleSlug}`,
  };
}
