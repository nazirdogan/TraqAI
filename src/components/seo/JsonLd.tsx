import {
  organization,
  service,
  localBusiness,
  person,
  breadcrumbs,
  faqPage,
  blogPosting,
  webPage,
  courseList,
  event,
  type ServiceInput,
  type BlogPostingInput,
  type WebPageInput,
  type CourseInput,
  type EventInput,
  type BreadcrumbItem,
  type Qa,
} from '@/lib/seo/schema';

type JsonLdProps = {
  data: Record<string, unknown>;
};

/**
 * Renders a JSON-LD structured data block.
 * Server component (no client JS). Use one per schema object.
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Typed convenience wrappers around the pure builders in src/lib/seo/schema.ts.
 * Drop these straight into a page; each renders one <script type=ld+json>.
 */

export function OrganizationJsonLd() {
  return <JsonLd data={organization()} />;
}

export function ServiceJsonLd(props: ServiceInput) {
  return <JsonLd data={service(props)} />;
}

export function LocalBusinessJsonLd() {
  return <JsonLd data={localBusiness()} />;
}

export function PersonJsonLd() {
  return <JsonLd data={person()} />;
}

export function BreadcrumbsJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return <JsonLd data={breadcrumbs(items)} />;
}

export function FaqPageJsonLd({ qas }: { qas: Qa[] }) {
  return <JsonLd data={faqPage(qas)} />;
}

export function BlogPostingJsonLd(props: BlogPostingInput) {
  return <JsonLd data={blogPosting(props)} />;
}

export function WebPageJsonLd(props: WebPageInput) {
  return <JsonLd data={webPage(props)} />;
}

export function EventJsonLd(props: EventInput) {
  return <JsonLd data={event(props)} />;
}

export function CourseListJsonLd({ courses }: { courses: CourseInput[] }) {
  return <JsonLd data={courseList(courses)} />;
}
