/**
 * Reading time from a word count.
 *
 * 220 words a minute is the usual estimate for adult prose. Kept in
 * one place so the article page and the cards that link to it can
 * never disagree about how long the same piece takes.
 */

const WORDS_PER_MINUTE = 220;

export function readingTimeFor(wordCount: number | undefined): string | undefined {
  const m = minutesFor(wordCount);
  return m === undefined ? undefined : `${m} min read`;
}

/** The same number, short enough to sit in a card's tag line. */
export function readingTimeShort(wordCount: number | undefined): string | undefined {
  const m = minutesFor(wordCount);
  return m === undefined ? undefined : `${m} min`;
}

function minutesFor(wordCount: number | undefined): number | undefined {
  if (!wordCount) return undefined;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
