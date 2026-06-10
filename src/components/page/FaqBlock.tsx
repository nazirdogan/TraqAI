import type { Qa } from '@/lib/seo/schema';

type FaqBlockProps = {
  /**
   * The questions and answers. Pass the identical array to faqPage() so the
   * FAQPage JSON-LD always mirrors what is visible here.
   */
  qas: Qa[];
  /** Section heading. Phrase as a real query where possible. */
  heading?: string;
  /** Optional one-line supporting copy under the heading. */
  intro?: string;
};

/**
 * On-page FAQ block. Renders native <details>/<summary> accordions styled to
 * match the Phase 1 home FAQ. This is the visible mirror of the FAQPage schema;
 * keep the qas array identical between this component and faqPage().
 *
 * Server component: native <details> needs no client JS, so it ships zero
 * runtime and the content is fully in the HTML for crawlers and AI search.
 */
export default function FaqBlock({ qas, heading = 'Frequently asked questions', intro }: FaqBlockProps) {
  if (!qas.length) return null;

  return (
    <section className="relative bg-bg-subtle px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <div className="eyebrow eyebrow-accent">FAQ</div>
          <h2 className="section-title mt-4">{heading}</h2>
          {intro ? <p className="section-sub mx-auto mt-4 text-center">{intro}</p> : null}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:gap-3.5">
          {qas.map((qa) => (
            <details
              key={qa.q}
              className="group rounded-[18px] border border-border-subtle bg-white shadow-card transition-colors duration-300 open:border-border-strong sm:rounded-[20px]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold leading-snug text-ink marker:hidden sm:px-6 sm:py-5 sm:text-base [&::-webkit-details-marker]:hidden">
                {qa.q}
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-border-subtle text-traq-purple transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <p className="m-0 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
                  {qa.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
