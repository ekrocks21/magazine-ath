/**
 * Astro content collections for The Local Lookout.
 *
 * Source of truth for frontmatter shape. Every Markdown file under
 * src/content/ is validated against one of these schemas at build time.
 *
 * Normalization: Eric's editorial workflow writes frontmatter keys in
 * whatever form reads naturally in a text editor. Rather than making him
 * conform to slug-form keys, we accept either form at the edge and
 * normalize to canonical names here. See decisions.md.
 */

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

// ── Shared vocabularies ────────────────────────────────────────────────

const SEASONS = ['winter', 'spring', 'summer', 'fall'] as const;

const ISSUE_STATUSES = [
  'planning',
  'in_production',
  'published',
  'archived',
] as const;

const ARTICLE_STATUSES = ['draft', 'edited', 'final', 'published'] as const;

const ARTICLE_TYPES = [
  'feature',
  'editors_letter',
  'essay',
  'interview',
  'documentary',
  'local_legend',
  'announcement', // spec-winter-2026.md §4.5 — What's Up Next
] as const;

const PILLARS = [
  'historical_storytelling',
  'local_legends',
  'community',
  'documentary',
  'quarterly_essay',
  'editors_letter',
] as const;

const ACCESS = ['free', 'subscriber'] as const;

// ── Helpers ────────────────────────────────────────────────────────────

function toIssueSlug(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

/**
 * "winter-2026" → { season: "winter", year: 2026 }.
 * Used so articles can omit season/year when they already name the issue.
 */
function deriveSeasonYearFromIssue(
  issueSlug: string | undefined,
): { season?: string; year?: number } {
  if (!issueSlug) return {};
  const match = issueSlug.match(/^(winter|spring|summer|fall)-(\d{4})$/);
  if (!match) return {};
  return { season: match[1], year: Number(match[2]) };
}

// ── Frontmatter normalizers ────────────────────────────────────────────

function normalizeArticleFrontmatter(raw: unknown): unknown {
  if (typeof raw !== 'object' || raw === null) return raw;
  const r = raw as Record<string, unknown>;
  const out: Record<string, unknown> = { ...r };

  // publication_date → publish_date (canonical)
  if (out.publish_date === undefined && r.publication_date !== undefined) {
    out.publish_date = r.publication_date;
  }
  // Normalize issue slug ("Spring 2026" → "spring-2026", "winter-2026" stays)
  if (typeof r.issue === 'string') {
    out.issue = toIssueSlug(r.issue);
  }
  // Accept editor_letter misspelling
  if (r.type === 'editor_letter') out.type = 'editors_letter';

  // Derive season/year from issue slug when not explicit.
  const derived = deriveSeasonYearFromIssue(
    typeof out.issue === 'string' ? out.issue : undefined,
  );
  if (out.season === undefined && derived.season) out.season = derived.season;
  if (out.year === undefined && derived.year) out.year = derived.year;

  return out;
}

function normalizeIssueFrontmatter(raw: unknown): unknown {
  if (typeof raw !== 'object' || raw === null) return raw;
  const r = raw as Record<string, unknown>;
  const out: Record<string, unknown> = { ...r };

  if (out.publish_date === undefined && r.publication_date !== undefined) {
    out.publish_date = r.publication_date;
  }
  if (typeof r.slug === 'string') {
    out.slug = toIssueSlug(r.slug);
  }
  return out;
}

// ── Issues collection ──────────────────────────────────────────────────

const issues = defineCollection({
  loader: glob({ base: './src/content/issues', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.preprocess(
      normalizeIssueFrontmatter,
      z.object({
        title: z.string(),
        issue_number: z.number().int().positive(),
        season: z.enum(SEASONS),
        year: z.number().int(),
        status: z.enum(ISSUE_STATUSES).default('planning'),
        publish_date: z.coerce.date().optional(),
        theme: z.string().optional(),
        tagline: z.string().optional(),

        // Cover art — pipeline-optimized when image() helper is used
        cover_image: image().optional(),
        cover_image_alt: z.string().optional(),

        /** Slug of the editor's-letter article for this issue. */
        editors_letter: z.string().optional(),

        // Colophon (spec-winter-2026 §7). Arrays so quarterly colophon
        // can evolve per issue without schema churn.
        contributors: z.array(z.string()).default([]),
        photographers: z.array(z.string()).default([]),
        editors: z.array(z.string()).default([]),
        special_thanks: z.array(z.string()).default([]),

        order_print: z.boolean().default(false),
        print_price_cents: z.number().int().nonnegative().optional(),
      }),
    ),
});

// ── Articles collection ────────────────────────────────────────────────

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.preprocess(
      normalizeArticleFrontmatter,
      z.object({
        title: z.string(),
        type: z.enum(ARTICLE_TYPES),
        issue: z.string(),
        issue_number: z.number().int().positive().optional(),
        season: z.enum(SEASONS),
        year: z.number().int(),
        /** Ordering within the issue's TOC. Honored by /issues/[slug]. */
        order: z.number().int().positive().optional(),
        author: z.string(),
        byline: z.string().optional(),
        dek: z.string().default(''),
        status: z.enum(ARTICLE_STATUSES).default('draft'),
        word_count: z.number().int().positive().optional(),
        access: z.enum(ACCESS).default('free'),
        pillar: z.enum(PILLARS),
        tags: z.array(z.string()).default([]),

        // Hero — image() makes Astro run the pipeline + emit responsive variants
        hero_image: image().optional(),
        hero_image_alt: z.string().optional(),
        hero_image_caption: z.string().optional(),
        hero_image_credit: z.string().optional(),

        // Optional gallery — grid of supporting frames rendered after the body.
        // Each item goes through the image pipeline (responsive WebP).
        gallery: z
          .array(
            z.object({
              src: image(),
              alt: z.string(),
              caption: z.string().optional(),
              credit: z.string().optional(),
            }),
          )
          .default([]),
        gallery_title: z.string().optional(),

        publish_date: z.coerce.date().optional(),
      }),
    ),
});

// ── Pages collection ───────────────────────────────────────────────────

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    status: z.enum(['draft', 'published']).default('published'),
    updated: z.coerce.date().optional(),
  }),
});

// ── Export ─────────────────────────────────────────────────────────────

export const collections = { issues, articles, pages };
