/**
 * Astro content collections for The Local Lookout.
 *
 * Source of truth for frontmatter shape. Every Markdown file under
 * src/content/ is validated against one of these schemas at build time.
 *
 * A note on normalization: Eric's editorial workflow writes frontmatter keys
 * in whatever form reads naturally in a text editor ("Spring 2026" rather
 * than "spring-2026", `publication_date` rather than `publish_date`, etc.).
 * Rather than making him conform to slug-form keys, we accept either form at
 * the edge and normalize to canonical names here. See decisions.md
 * (2026-04-18 — Typography... "Also logged" section) for the full list.
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
] as const;

const PILLARS = [
  'historical_storytelling',
  'local_legends',
  'community',
  'documentary',
  'quarterly_essay',
  'editors_letter', // Eric adds this; editorially meaningful
] as const;

const ACCESS = ['free', 'subscriber'] as const;

// ── Frontmatter normalizers ────────────────────────────────────────────
// These run BEFORE Zod validates. They handle the spec §5 / real-file deltas.

function toIssueSlug(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

/**
 * Normalize raw frontmatter for an article before validation:
 *   - publication_date → publish_date (Eric's preferred key wins, canonical is spec's)
 *   - issue "Spring 2026" → "spring-2026"
 *   - type "editor_letter" alt spelling → "editors_letter"
 */
function normalizeArticleFrontmatter(raw: unknown): unknown {
  if (typeof raw !== 'object' || raw === null) return raw;
  const r = raw as Record<string, unknown>;
  const out: Record<string, unknown> = { ...r };

  if (out.publish_date === undefined && r.publication_date !== undefined) {
    out.publish_date = r.publication_date;
  }
  if (typeof r.issue === 'string') {
    out.issue = toIssueSlug(r.issue);
  }
  if (r.type === 'editor_letter') out.type = 'editors_letter';

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
// Path: src/content/issues/[slug].md
// Slug is derived from the filename by Astro; the optional `slug:`
// frontmatter is a human-readable override.

const issues = defineCollection({
  loader: glob({ base: './src/content/issues', pattern: '**/*.md' }),
  schema: z.preprocess(
    normalizeIssueFrontmatter,
    z.object({
      title: z.string(),
      issue_number: z.number().int().positive(),
      season: z.enum(SEASONS),
      year: z.number().int(),
      status: z.enum(ISSUE_STATUSES).default('planning'),
      publish_date: z.coerce.date().optional(),
      theme: z.string().optional(),
      cover_image: z.string().optional(),
      /** Slug of the editor's-letter article for this issue. */
      editors_letter: z.string().optional(),
      order_print: z.boolean().default(false),
      print_price_cents: z.number().int().nonnegative().optional(),
    }),
  ),
});

// ── Articles collection ────────────────────────────────────────────────
// Path: src/content/articles/[issue-slug]/[article-slug].md
// Articles are nested by issue slug. Astro builds routes from the path.

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
  schema: z.preprocess(
    normalizeArticleFrontmatter,
    z.object({
      title: z.string(),
      type: z.enum(ARTICLE_TYPES),
      issue: z.string(), // normalized to slug by preprocess
      issue_number: z.number().int().positive().optional(),
      season: z.enum(SEASONS),
      year: z.number().int(),
      author: z.string(),
      byline: z.string().optional(),
      dek: z.string().default(''),
      status: z.enum(ARTICLE_STATUSES).default('draft'),
      word_count: z.number().int().positive().optional(),
      access: z.enum(ACCESS).default('free'),
      pillar: z.enum(PILLARS),
      tags: z.array(z.string()).default([]),
      hero_image: z.string().optional(),
      hero_image_caption: z.string().optional(),
      hero_image_credit: z.string().optional(),
      publish_date: z.coerce.date().optional(),
    }),
  ),
});

// ── Pages collection ───────────────────────────────────────────────────
// Path: src/content/pages/[slug].md
// For About, Colophon, legal, etc.

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
