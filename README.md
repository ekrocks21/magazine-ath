# magazine.abovethehook.com

The digital home of **The Local Lookout**, the quarterly print magazine of
[Above the Hook](https://abovethehook.com).

## Status

Phase 1 — content + marketing + archive site. Auth, subscriptions, and paywall
are Phase 2 (separate spec, not yet written).

## Context for contributors

Before touching code, read in order:

1. `CLAUDE.md` — project context, tech stack, dependency rules, brand voice
2. `spec.md` — product specification, scope, page templates, data model
3. `decisions.md` — architecture decision log (newest at the top)

(These three live in the parent `Magazine/` folder of the ATH monorepo for now;
they'll be copied into this repo once content stabilizes.)

## Stack

Astro 6 · TypeScript strict · Tailwind 4 · Astro content collections (Zod) ·
deployed on Netlify on the same team as harbor and blog.

## Local development

```
nvm use        # uses Node 22 per .nvmrc
npm install
npm run dev
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server on http://localhost:4321 |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run astro check` | Type-check content collections and components |

## Content

All magazine content lives as Markdown under `src/content/`:

- `issues/[slug].md` — one file per quarterly issue
- `articles/[issue-slug]/[article-slug].md` — one file per article
- `pages/` — about, colophon, static pages

Frontmatter is validated at build time via Zod schemas in `src/content.config.ts`.
`status: draft` articles render on preview deploys only.

## Deploy

- Branch `main` → production at `magazine.abovethehook.com`
- Any PR → Netlify preview deploy, drafts included
- DNS: CNAME at Cloudflare (same pattern as harbor and blog)

## Do not touch

Do not modify anything related to `harbor.abovethehook.com`,
`blog.abovethehook.com`, or shared ATH Netlify team settings. See
`CLAUDE.md` for the full list.
