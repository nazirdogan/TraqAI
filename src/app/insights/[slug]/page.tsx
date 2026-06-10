import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleLayout from '@/components/insights/ArticleLayout';
import { getAllSlugs, getBySlug } from '@/lib/content/insights';

type PageProps = {
  params: { slug: string };
};

const SITE_URL = 'https://traqcollective.com';

/**
 * Pre-render every published article at build time. Returns an empty list while
 * the registry is empty; articles are added in the following Phase 3 tasks.
 */
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const article = getBySlug(params.slug);
  if (!article) {
    return { title: 'Insight not found | Traq Collective' };
  }

  const canonical = `${SITE_URL}/insights/${article.slug}`;
  return {
    title: article.title,
    description: article.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.metaDescription,
      url: canonical,
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      authors: [`${SITE_URL}/about`],
    },
  };
}

export default function InsightArticlePage({ params }: PageProps) {
  const article = getBySlug(params.slug);
  if (!article) {
    notFound();
  }

  return <ArticleLayout article={article} />;
}
