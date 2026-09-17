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
  /** YouTube id. When set on a `youtube` companion the callout plays
   *  the video in place rather than only linking out to it. Leave it
   *  off for entries that point at a channel rather than one video. */
  videoId?: string;
}

export const COMPANIONS: Record<string, Companion> = {
  // ─── Studios video ─────────────────────────────────────────────
  'video-highland-beach-last-building': {
    title: 'The Last Building on Sandy Hook\u2019s Lost Beach',
    url: 'https://www.youtube.com/watch?v=ZDJviT1dhao',
    platform: 'youtube',
    kicker: 'Watch on YouTube',
    videoId: 'ZDJviT1dhao',
    summary:
      'Why the one house the state left standing on the old resort ground is worth keeping.',
  },

  'video-ferry-best-commute': {
    title: 'The Best Commute in America is from Jersey to NYC',
    url: 'https://www.youtube.com/watch?v=lwkiBUg_hPc',
    platform: 'youtube',
    kicker: 'Watch on YouTube',
    videoId: 'lwkiBUg_hPc',
    summary:
      'The forty-five minutes from the Highlands dock to 34th Street, run end to end.',
  },

  'video-iceboat-van-nostrand': {
    title:
      'The $100,000 Tiffany Trophy That Sat in a Vault for 135 Years',
    url: 'https://www.youtube.com/watch?v=CrpCjiu09xs',
    platform: 'youtube',
    kicker: 'Watch on YouTube',
    videoId: 'CrpCjiu09xs',
    summary: 'The Van Nostrand Ice Boat Challenge, sailed again in 2026.',
  },

  'video-tall-ships-four-days': {
    title: 'The World Sailed Into Our Backyard',
    url: 'https://www.youtube.com/watch?v=1W1yvWm06iM',
    platform: 'youtube',
    kicker: 'Watch on YouTube',
    videoId: '1W1yvWm06iM',
    summary: 'Four days with the tall ships of Sail4th 250.',
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
    title: 'The Edge of the Continent',
    url: 'https://blog.abovethehook.com/posts/the-edge-of-the-continent-why-new-york-harbor-sandy-hook-and-the-highlands-shape/',
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
