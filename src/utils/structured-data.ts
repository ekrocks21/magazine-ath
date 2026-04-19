/**
 * Structured-data builders — emit schema.org JSON-LD for articles, issues,
 * and the site root. Rendered by <StructuredData /> inside the article /
 * issue / home templates.
 *
 * Every Article includes: headline, datePublished, author, publisher,
 * image, articleSection (pillar), mainEntityOfPage.
 * Every PublicationIssue includes: issueNumber, datePublished, cover.
 * The site Organization ties everything together (The Local Lookout,
 * published by Above the Hook).
 */

const SITE_NAME = 'The Local Lookout';
const PARENT_BRAND = 'Above the Hook';
const SITE_URL = 'https://magazine.abovethehook.com';
const PARENT_URL = 'https://abovethehook.com';
const LOGO_URL = `${SITE_URL}/brand/ath-wordmark.svg`;
const MONOGRAM_URL = `${SITE_URL}/brand/ath-monogram.svg`;

interface PublisherRef {
  '@type': 'Organization';
  name: string;
  url: string;
  logo: { '@type': 'ImageObject'; url: string };
}

const publisher: PublisherRef = {
  '@type': 'Organization',
  name: PARENT_BRAND,
  url: PARENT_URL,
  logo: { '@type': 'ImageObject', url: LOGO_URL },
};

// ── Organization (rendered on every page via the home builder) ────────

export function siteOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: PARENT_BRAND,
    url: PARENT_URL,
    logo: LOGO_URL,
    sameAs: [
      'https://www.youtube.com/@abovethehookstudios',
      'https://blog.abovethehook.com',
      'https://harbor.abovethehook.com',
    ],
  };
}

// ── WebSite (home page) ────────────────────────────────────────────────

export function siteWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'The Lookout',
    url: SITE_URL,
    description:
      'The quarterly print magazine of Above the Hook. Coastal New Jersey, observed.',
    publisher,
  };
}

// ── Article ────────────────────────────────────────────────────────────

interface ArticleInput {
  title: string;
  description?: string;
  url: string; // canonical URL
  image?: string; // absolute URL
  datePublished?: Date;
  author: string;
  pillar: string; // e.g. "historical_storytelling"
  tags?: string[];
  wordCount?: number;
  issueTitle?: string;
}

export function articleSchema(a: ArticleInput) {
  const sectionLabel = a.pillar
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const doc: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    url: a.url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': a.url },
    author: { '@type': 'Person', name: a.author },
    publisher,
    articleSection: sectionLabel,
    isPartOf: a.issueTitle
      ? {
          '@type': 'PublicationIssue',
          issueNumber: a.issueTitle,
          isPartOf: {
            '@type': 'Periodical',
            name: SITE_NAME,
            publisher,
          },
        }
      : undefined,
  };

  if (a.image) doc.image = a.image;
  if (a.datePublished) doc.datePublished = a.datePublished.toISOString();
  if (a.datePublished) doc.dateModified = a.datePublished.toISOString();
  if (a.tags && a.tags.length > 0) {
    doc.keywords = a.tags.map((t) => t.replace(/_/g, ' ')).join(', ');
  }
  if (a.wordCount) doc.wordCount = a.wordCount;

  return doc;
}

// ── PublicationIssue ──────────────────────────────────────────────────

interface IssueInput {
  title: string;
  issueNumber: number;
  url: string;
  description?: string;
  datePublished?: Date;
  coverImage?: string; // absolute URL
}

export function issueSchema(i: IssueInput) {
  const doc: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'PublicationIssue',
    issueNumber: i.issueNumber,
    name: i.title,
    url: i.url,
    description: i.description,
    isPartOf: {
      '@type': 'Periodical',
      name: SITE_NAME,
      url: SITE_URL,
      publisher,
    },
  };
  if (i.datePublished) doc.datePublished = i.datePublished.toISOString();
  if (i.coverImage) doc.image = i.coverImage;
  return doc;
}

// ── Breadcrumb ────────────────────────────────────────────────────────

interface Crumb {
  name: string;
  url: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}
