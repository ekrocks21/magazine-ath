/**
 * Companion artifact registry — editorial cross-linking to any Above
 * the Hook property (or external Studios work).
 *
 * When an article has `companion_to: <slug>` in its frontmatter, we look
 * up the slug here and render a Companion callout at the article foot.
 * Unknown slugs render nothing — the component stays silent rather than
 * breaking the page.
 *
 * Platforms:
 *   youtube / vimeo / film  — Studios video work
 *   podcast                  — audio piece
 *   blog                     — a blog.abovethehook.com post
 *   magazine                 — a magazine.abovethehook.com issue/article (rare
 *                              since this registry IS the magazine; used when
 *                              one piece points at a sibling in the same issue
 *                              or a back-issue feature)
 *   harbor                   — the Harbor Observatory (live cam)
 *
 * Add entries here whenever a piece of content pairs cleanly with a
 * magazine article. The slug in the article frontmatter must match the
 * key exactly.
 */

export type CompanionPlatform =
  | 'youtube'
  | 'vimeo'
  | 'film'
  | 'podcast'
  | 'blog'
  | 'magazine'
  | 'harbor';

export interface Companion {
  title: string;
  url: string;
  platform: CompanionPlatform;
  /** Call-to-action text. e.g. "Watch on YouTube", "Read on the Blog". */
  kicker: string;
  /** Optional: duration label for media. e.g. "12 min", "45 min". */
  duration?: string;
  /** Optional one-line description. Shown under the title if set. */
  summary?: string;
}

export const COMPANIONS: Record<string, Companion> = {
  // ─── Studios video ─────────────────────────────────────────────
  'video-from-the-hook-to-34th-street': {
    title: 'From the Hook to 34th Street',
    url: 'https://www.youtube.com/@abovethehookstudios',
    platform: 'youtube',
    kicker: 'Watch on YouTube',
  },

  // ─── Harbor Observatory ────────────────────────────────────────
  'harbor-live': {
    title: 'Watch live from the Hook',
    url: 'https://harbor.abovethehook.com',
    platform: 'harbor',
    kicker: 'See what\u2019s in the harbor right now',
    summary:
      'Every vessel entering or leaving New York Harbor, tracked 4K from Highlands, NJ.',
  },

  // ─── Blog (The Lookout) ────────────────────────────────────────
  //
  // Add entries like:
  //   'blog-sandy-hook-lighthouse': {
  //     title: 'Sandy Hook Lighthouse: The First Light',
  //     url: 'https://blog.abovethehook.com/posts/sandy-hook-lighthouse',
  //     platform: 'blog',
  //     kicker: 'Read on the Blog',
  //     summary: 'The 1764 origin story of America\u2019s oldest working lighthouse.',
  //   },
  'blog-sandy-hook-geography': {
    title: 'Sandy Hook: A Geography',
    url: 'https://blog.abovethehook.com/posts/sandy-hook-geography',
    platform: 'blog',
    kicker: 'Read on the Blog',
    summary:
      'How sixty-six million years of sediment and current built the peninsula.',
  },
};

export function getCompanion(slug: string | undefined): Companion | undefined {
  if (!slug) return undefined;
  return COMPANIONS[slug];
}
