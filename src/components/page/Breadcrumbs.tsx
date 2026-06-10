import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { BreadcrumbItem } from '@/lib/seo/schema';

type BreadcrumbsProps = {
  /**
   * Ordered trail, home first. The same array should be passed to the
   * breadcrumbs() schema builder so the visible trail mirrors the JSON-LD.
   */
  items: BreadcrumbItem[];
  className?: string;
};

/**
 * Visible breadcrumb trail. Renders an ordered list of links with the last
 * item as the current page (not a link). Pairs with BreadcrumbList JSON-LD
 * emitted by the page using the identical items array.
 */
export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('text-[13px]', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-faint">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-x-2">
              {isLast ? (
                <span className="font-medium text-ink-soft" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.url}
                    className="transition-colors hover:text-traq-purple"
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden="true" className="text-ink-faint">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
