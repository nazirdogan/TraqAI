import HandUnderline from '@/components/ui/HandUnderline';

export type ContentSection = { h2: string; body: string; points?: string[] };

type Props = {
  sections: ContentSection[];
  /** Optional small label above the grid. */
  eyebrow?: string;
  /** Optional heading above the grid. */
  heading?: string;
  /** Optional one-line intro under the heading. */
  intro?: string;
};

/**
 * Wide, two-column "notebook card" renderer for the SEO/service pages.
 *
 * Replaces the old narrow (max-w-3xl) stacked-prose blocks: the same
 * { h2, body, points } data now reads across a wider, shorter, less
 * scroll-heavy layout, with a subtle ruled-card + handwritten-number motif.
 * Server component — no client JS.
 */
export default function ContentSections({ sections, eyebrow, heading, intro }: Props) {
  if (!sections.length) return null;

  return (
    <section className="paper-dots relative bg-bg-base px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-5xl">
        {(eyebrow || heading) && (
          <div className="mb-9 sm:mb-12">
            {eyebrow ? <div className="eyebrow eyebrow-accent">{eyebrow}</div> : null}
            {heading ? (
              <div className="relative inline-block">
                <h2 className="section-title mt-3 max-w-2xl">{heading}</h2>
                <span
                  className="pointer-events-none absolute -bottom-2 left-0 text-traq-purple"
                  aria-hidden="true"
                >
                  <HandUnderline className="h-2.5 w-40" />
                </span>
              </div>
            ) : null}
            {intro ? <p className="section-sub mt-5">{intro}</p> : null}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          {sections.map((section, i) => (
            <article key={section.h2} className="note-card flex flex-col">
              <div className="flex items-baseline gap-3">
                <span className="note-card__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="text-[18px] font-semibold leading-snug tracking-tight text-ink sm:text-xl">
                  {section.h2}
                </h2>
              </div>

              <p className="mt-3 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
                {section.body}
              </p>

              {section.points ? (
                <ul className="mt-4 space-y-2.5">
                  {section.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 flex-none text-traq-purple"
                      >
                        <path
                          d="m4 12.5 5 5L20 6"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[13.5px] leading-relaxed text-ink-soft sm:text-[14.5px]">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
