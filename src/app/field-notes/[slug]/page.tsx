import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FieldNoteLayout from '@/components/field-notes/FieldNoteLayout';
import { getAllFieldNoteSlugs, getFieldNoteBySlug } from '@/lib/content/field-notes';
import { brandedTitle, stripBrandSuffix } from '@/lib/metadata';

type PageProps = {
  params: { slug: string };
};

const SITE_URL = 'https://traqcollective.com';

/** Pre-render every published field note at build time. */
export function generateStaticParams() {
  return getAllFieldNoteSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const note = getFieldNoteBySlug(params.slug);
  if (!note) {
    return { title: 'Field note not found | Traq Collective' };
  }

  const canonical = `${SITE_URL}/field-notes/${note.slug}`;
  const title = stripBrandSuffix(note.title);
  return {
    title,
    description: note.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: brandedTitle(note.title),
      description: note.metaDescription,
      url: canonical,
      publishedTime: note.datePublished,
      modifiedTime: note.dateModified,
      authors: [`${SITE_URL}/about`],
    },
  };
}

export default function FieldNotePage({ params }: PageProps) {
  const note = getFieldNoteBySlug(params.slug);
  if (!note) {
    notFound();
  }

  return <FieldNoteLayout note={note} />;
}
