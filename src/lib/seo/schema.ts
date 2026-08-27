/**
 * Pure JSON-LD builders for Traq Collective.
 *
 * Each function returns a plain object ready to pass to <JsonLd data={...} />
 * (src/components/seo/JsonLd.tsx). Keep these pure: no React, no side effects,
 * so they can be reused in metadata, server components, and tests.
 *
 * Canonical base URL and the UAE phone number live here as the single source
 * of truth so every page stays consistent.
 */

export const SITE_URL = 'https://traqcollective.com';
export const SITE_NAME = 'Traq Collective';
export const PHONE = '+971 50 868 7196';
export const EMAIL = 'hello@traqcollective.com';
export const LOGO_URL = `${SITE_URL}/logos/wordmark-purple.png`;

const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#nazir`;

/** Build a fully-qualified URL from a path ("/about" -> "https://.../about"). */
export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

// Confirmed official profiles. These anchor entity recognition so AI engines and
// search can disambiguate Traq Collective (the company) and Nazir Dogan (the
// founder) from similarly named entities such as traq.ai.
const ORG_SAME_AS = [
  'https://www.linkedin.com/company/traq-collective',
  'https://www.instagram.com/traqcollective',
  // Verified live third-party profiles. These corroborate the entity across the
  // surfaces AI engines and search actually scrape, so the model treats them all
  // as one company rather than ignoring a small, unlinked brand.
  'https://www.crunchbase.com/organization/traq-collective',
  'https://clutch.co/profile/traq-collective',
  'https://www.goodfirms.co/company/traq-collective',
  'https://themanifest.com/company/traq-collective',
  'https://techbehemoths.com/company/traq-collective',
];

// Founder profiles point at the Person entity, not the company.
const PERSON_SAME_AS = ['https://www.linkedin.com/in/nazir-dogan-010ab117a'];

export type JsonLdObject = Record<string, unknown>;

/**
 * Organization — sitewide entity. Rendered once in the root layout; reference
 * it elsewhere by its @id rather than re-declaring it.
 */
export function organization(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    description:
      'Traq Collective is a UAE-based AI enablement partner that helps your team actually use the AI you already pay for: hands-on training, consulting as your embedded AI partner, implementation, and agentic infrastructure. We deliver in person across Dubai and Abu Dhabi, and remotely worldwide.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AE',
      addressRegion: 'Dubai',
    },
    areaServed: [
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    // The founder edge closes the entity loop. The Person already points here
    // via `worksFor`, but the link was one-directional, so a crawler reading the
    // Organization alone had no route to the human behind it.
    founder: { '@id': PERSON_ID },
    // Explicit topic scope. "Traq" collides with several unrelated entities
    // (traq.ai in Florida, a debt-collection vendor, a PHP issue tracker) and
    // this domain previously served a padel-court pricing product, so engines
    // have more than one plausible reading of what this company does. Naming
    // the subject matter gives them a reason to prefer the right one.
    knowsAbout: [
      'AI enablement',
      'AI training for teams',
      'AI consulting',
      'AI implementation',
      'Agentic AI',
      'AI adoption',
    ],
    sameAs: ORG_SAME_AS,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: PHONE,
      email: EMAIL,
      contactType: 'customer service',
      areaServed: ['AE', 'Worldwide'],
      availableLanguage: ['English'],
    },
  };
}

export type ServiceInput = {
  name: string;
  description: string;
  /** Canonical path or full URL for the service page, e.g. "/services/ai-training". */
  url: string;
  /** Optional service type label, e.g. "AI training". */
  serviceType?: string;
};

/**
 * Service — one per service / offer page. The provider points back to the
 * sitewide Organization entity by @id. areaServed reflects UAE + global reach.
 */
export function service({ name, description, url, serviceType }: ServiceInput): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(url),
    serviceType: serviceType ?? name,
    provider: {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: [
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: absoluteUrl('/book'),
      servicePhone: { '@type': 'ContactPoint', telephone: PHONE },
    },
  };
}

/**
 * LocalBusiness (ProfessionalService) — for the UAE location page.
 * areaServed: AE plus worldwide; phone is the UAE number. No street address is
 * published yet (remote-first), so we declare addressCountry only.
 */
export function localBusiness(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/ai-consulting-uae/#localbusiness`,
    name: SITE_NAME,
    url: absoluteUrl('/ai-consulting-uae'),
    image: LOGO_URL,
    logo: LOGO_URL,
    description:
      'AI consulting and training in the UAE. We train teams in Dubai and Abu Dhabi to use the AI tools they already pay for, embed as your AI partner, and deliver remotely worldwide.',
    telephone: PHONE,
    email: EMAIL,
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AE',
      addressRegion: 'Dubai',
    },
    areaServed: [
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    sameAs: ORG_SAME_AS,
    parentOrganization: { '@id': ORG_ID },
  };
}

/**
 * Person — founder/author entity for /about and (later) guide bylines.
 * Bio/photo and social handles are placeholders until confirmed (spec §12).
 */
export function person(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Nazir Dogan',
    jobTitle: 'Founder, AI enablement partner',
    description:
      'Founder of Traq Collective. Nazir builds AI systems and trains teams to use them every day, including a full autonomous operation he runs end to end.',
    url: absoluteUrl('/about'),
    image: `${SITE_URL}/nazir.jpg`,
    worksFor: { '@id': ORG_ID },
    sameAs: PERSON_SAME_AS,
  };
}

export type BreadcrumbItem = { name: string; url: string };

/**
 * BreadcrumbList — pass an ordered list of { name, url }. The home crumb should
 * be first. URLs are normalised to absolute.
 */
export function breadcrumbs(items: BreadcrumbItem[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export type BlogPostingInput = {
  /** Article headline (usually the H1). */
  headline: string;
  /** Meta description / short summary. */
  description: string;
  /** Canonical path or full URL for the article, e.g. "/insights/ai-adoption". */
  url: string;
  /** ISO date string, e.g. "2026-06-10". */
  datePublished: string;
  /** ISO date string, e.g. "2026-06-10". */
  dateModified: string;
  /** Author display name. Defaults to the founder. */
  authorName?: string;
  /** Local path to the lead image, e.g. "/field-notes/slug.jpg". */
  imageUrl?: string;
};

/**
 * BlogPosting — one per /insights guide. The author points back to the founder
 * Person entity by @id (declared on /about), and the publisher points to the
 * sitewide Organization. mainEntityOfPage anchors the article to its canonical
 * URL so the schema and the page agree.
 */
export function blogPosting({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  authorName = 'Nazir Dogan',
  imageUrl,
}: BlogPostingInput): JsonLdObject {
  const canonical = absoluteUrl(url);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    url: canonical,
    ...(imageUrl ? { image: absoluteUrl(imageUrl) } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: authorName,
      url: absoluteUrl('/about'),
    },
    publisher: {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
  };
}

export type WebPageInput = {
  name: string;
  description: string;
  url: string;
  /** ISO date the page content was last genuinely reviewed. */
  dateModified: string;
};

/**
 * WebPage — a freshness signal for the commercial landing pages.
 *
 * Guides and field notes carry their own dates, but the pages that actually
 * have to win commercial queries (services, /ai-consulting-uae) carried no date
 * at all, and AI search weights recency when choosing between sources. Set
 * `dateModified` from a hand-maintained constant, never `new Date()`, so it
 * stays a truthful claim about when the copy was last reviewed rather than a
 * number that rebuilds itself every deploy.
 */
export function webPage({ name, description, url, dateModified }: WebPageInput): JsonLdObject {
  const canonical = absoluteUrl(url);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': canonical,
    name,
    description,
    url: canonical,
    dateModified,
    isPartOf: { '@type': 'WebSite', url: absoluteUrl('/'), name: SITE_NAME },
    publisher: { '@type': 'Organization', '@id': ORG_ID },
  };
}

export type Qa = { q: string; a: string };

/**
 * FAQPage — pass the same { q, a } array that renders visibly on the page so
 * the structured data always mirrors the on-page content.
 */
export function faqPage(qas: Qa[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qas.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export type CourseInput = {
  name: string;
  description: string;
  /** Path plus anchor for the track, e.g. "/services/ai-training#claude-for-business". */
  url: string;
  /** ISO 8601 duration, e.g. "PT4H". Google rejects prose in courseWorkload. */
  workloadIso: string;
};

/**
 * ItemList of Course — the training catalogue as structured data.
 *
 * The visible catalogue on /services/ai-training answers "what exactly is in
 * this", and that answer is worth nothing to an AI engine if it only exists as
 * styled markup. Each track is emitted as a Course whose provider points back
 * to the sitewide Organization by @id, wrapped in an ItemList so the six read
 * as one catalogue rather than six unrelated declarations.
 *
 * courseMode carries both delivery formats because every track runs onsite in
 * the UAE and online everywhere else; the Place is the UAE delivery footprint,
 * not a campus address, since there is no public street address to claim.
 */
export function courseList(courses: CourseInput[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: courses.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        name: course.name,
        description: course.description,
        url: absoluteUrl(course.url),
        provider: {
          '@type': 'Organization',
          '@id': ORG_ID,
          name: SITE_NAME,
          url: SITE_URL,
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: ['onsite', 'online'],
          courseWorkload: course.workloadIso,
          location: {
            '@type': 'Place',
            name: 'Dubai, United Arab Emirates',
            address: { '@type': 'PostalAddress', addressCountry: 'AE', addressRegion: 'Dubai' },
          },
        },
        offers: {
          '@type': 'Offer',
          category: 'Paid',
          url: absoluteUrl('/book'),
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };
}
