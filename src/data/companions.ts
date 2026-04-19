/**
 * Companion artifact registry.
 *
 * When an article has `companion_to: <slug>` in its frontmatter, we look
 * up the slug here and render a Companion callout at the article foot.
 * Unknown slugs render nothing — the component stays silent rather than
 * breaking the page.
 *
 * When Eric ships a new video/podcast/film that pairs with a piece, add
 * an entry here. The slug in the article frontmatter must match the key.
 */

export interface Companion {
  title: string;
  url: string;
  platform: 'youtube' | 'vimeo' | 'podcast' | 'film';
  kicker: string; // "Watch on YouTube", "Listen", "Watch the film"
  duration?: string; // e.g. "12 min", "45 min"
}

export const COMPANIONS: Record<string, Companion> = {
  'video-from-the-hook-to-34th-street': {
    title: 'From the Hook to 34th Street',
    url: 'https://www.youtube.com/@abovethehookstudios',
    platform: 'youtube',
    kicker: 'Watch on YouTube',
    duration: undefined,
  },
};

export function getCompanion(slug: string | undefined): Companion | undefined {
  if (!slug) return undefined;
  return COMPANIONS[slug];
}
