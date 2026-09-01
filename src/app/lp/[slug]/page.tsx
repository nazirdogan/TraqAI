import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AssessmentForm from '@/app/ai-readiness/AssessmentForm';
import {
  LpDelivery,
  LpGovernance,
  LpHeader,
  LpPillars,
  LpOffer,
  LpProof,
  LpQualifiers,
  LpTracks,
} from '@/components/lp/LpSections';
import { LANDING_PAGES, LP_SLUGS, PIVOT_LINE, type LpSlug } from '@/lib/lp';
import { OG_IMAGE, brandedTitle } from '@/lib/metadata';

/**
 * Paid-search landing pages, one per ad group.
 *
 * Structure is identical across all three and only the top third changes, so
 * the page repeats the query the visitor typed. The assessment is embedded
 * rather than linked: every navigation is a chance to leave, and the component
 * already exists, so it drops straight in with the two blueprint changes turned
 * on (email captured mid-quiz, qualified bands routed to a calendar).
 *
 * Because this is the only destination paid traffic is sent to, the catalogue
 * lives on the page too. A visitor who wants to know what the training actually
 * covers gets the answer by scrolling, not by finding a nav link that is not
 * there.
 *
 * These pages are noindex. They exist for paid traffic and would otherwise
 * compete with /services/ai-training for the same organic terms.
 */

const SHELL = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

const CTA_PRIMARY =
  'group inline-flex items-center justify-center gap-2.5 rounded-full bg-traq-purple px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]';

const CTA_SECONDARY =
  'inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-ink-soft underline decoration-border-strong underline-offset-4 transition-colors hover:text-traq-purple-ink hover:decoration-traq-purple';

export function generateStaticParams() {
  return LP_SLUGS.map((slug) => ({ slug }));
}

type Params = { params: { slug: string } };

function pageFor(slug: string) {
  return (LP_SLUGS as string[]).includes(slug)
    ? LANDING_PAGES[slug as LpSlug]
    : null;
}

export function generateMetadata({ params }: Params): Metadata {
  const lp = pageFor(params.slug);
  if (!lp) return {};
  return {
    title: lp.title,
    description: lp.description,
    alternates: { canonical: `/lp/${lp.slug}` },
    // Paid destinations only. Indexing them would split the organic signal
    // with the service pages that are built to rank.
    robots: { index: false, follow: false },
    openGraph: {
      title: brandedTitle(lp.title),
      description: lp.description,
      url: `/lp/${lp.slug}`,
      type: 'website',
      images: [OG_IMAGE],
    },
  };
}

export default function LandingPage({ params }: Params) {
  const lp = pageFor(params.slug);
  if (!lp) notFound();

  /**
   * The quiz sits in the wider column with a short reassurance rail beside it,
   * so the page uses its width instead of stacking one narrow card down the
   * middle. Compact spacing lifts the first question up the viewport.
   */
  const assessment = (
    <section
      id="assessment"
      className="scroll-mt-4 border-t border-border-subtle bg-bg-subtle px-0 pb-14 pt-10 sm:pb-16 sm:pt-12"
    >
      <div className={SHELL}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <AssessmentForm
            captureEmailAfter={3}
            bookingHref="/book"
            source={`lp/${lp.slug}`}
            compact
            containerClassName="w-full"
            askBudget
          />

          <aside className="lg:pt-2">
            <p className="text-[10.5px] font-semibold uppercase tracking-widest text-ink-faint">
              Why the score first
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
              Nine questions across tools, confidence, training, ownership and
              measurement. It tells us which track your team should start on,
              and it tells you where the gap actually is.
            </p>
            <ul className="mt-5 flex flex-col gap-3 border-t border-border-subtle pt-5">
              {[
                'A real score out of 27, not a lead form',
                'Your band and the next steps for it, on screen',
                'One optional question on budget, so we scope the right format',
                'No call needed unless you want one',
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-soft">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-traq-purple"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );

  const offer = (
    <LpOffer
      heading={
        lp.leadWith === 'offer'
          ? 'The formats, and when each one is the right call'
          : 'How corporate AI training is delivered'
      }
    />
  );

  /**
   * The governance order. Deliverables first, because that visitor searched for
   * a document and needs to see it exists before being asked for anything, then
   * the quiz, then the catalogue the policy session sits inside.
   */
  const governanceBody = (
    <>
      <LpGovernance />
      {assessment}
      <LpTracks />
      <LpDelivery />
      {offer}
      <LpProof />
    </>
  );

  return (
    <>
      <LpHeader />

      <section className="bg-bg-base px-0 pb-12 pt-12 sm:pb-14 sm:pt-14">
        <div className={SHELL}>
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
            <div>
              <p className="eyebrow eyebrow-accent">{lp.eyebrow}</p>

              <h1 className="mt-4 text-balance text-[clamp(30px,4.4vw,44px)] font-extrabold leading-[1.08] tracking-tight text-ink">
                {lp.h1}
              </h1>

              <p className="mt-4 text-balance text-[clamp(18px,2.2vw,21px)] font-semibold leading-snug tracking-tight text-traq-purple-ink">
                {lp.promise}
              </p>

              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-[16.5px] [text-wrap:pretty]">
                {lp.intro}
              </p>

              <LpQualifiers />

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a href="#assessment" className={CTA_PRIMARY}>
                  Get your team&rsquo;s AI readiness score
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                    &rarr;
                  </span>
                </a>
                <a href="/book" className={CTA_SECONDARY}>
                  Book a call instead
                </a>
              </div>

              <p className="mt-4 text-[13px] text-ink-faint">
                Nine questions, about two minutes. A real score at the end, not a
                brochure.
              </p>
            </div>

            <LpPillars />
          </div>
        </div>
      </section>

      {/* The cost-intent visitor came to size the thing, so that page leads with
          the formats and puts the quiz below them. Everywhere else the quiz is
          first and the catalogue follows: it is what someone reads once they
          have a score and want to know what they would actually be buying. */}
      {lp.leadWith === 'governance' ? (
        governanceBody
      ) : lp.leadWith === 'offer' ? (
        <>
          {offer}
          {assessment}
          <LpTracks />
          <LpDelivery />
          <LpProof />
        </>
      ) : (
        <>
          {assessment}
          <LpTracks />
          <LpDelivery />
          {offer}
          <LpProof />
        </>
      )}

      <section className="border-t border-border-subtle bg-bg-base px-0 py-16 sm:py-20">
        <div className={SHELL}>
          <p className="max-w-2xl text-balance text-[clamp(22px,3.2vw,30px)] font-bold leading-[1.25] tracking-tight text-ink">
            {PIVOT_LINE}
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <a href="#assessment" className={CTA_PRIMARY}>
              Get your readiness score
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                &rarr;
              </span>
            </a>
            <a href="/book" className={CTA_SECONDARY}>
              Book a call instead
            </a>
          </div>
        </div>
      </section>

      <div className="bg-bg-subtle px-0 py-8">
        <div className={`${SHELL} text-[12px] leading-relaxed text-ink-faint`}>
          <p>
            Traq Collective. Founder led AI enablement partner. Practitioners,
            not consultants.
          </p>
          <p className="mt-1.5">
            Client results are measured outcomes from real engagements,
            anonymised at the client&rsquo;s request. Every engagement is scoped
            and quoted through an enquiry.
          </p>
          {/* The page has no navigation by design, but it collects an email, so
              the policy that covers it has to be reachable from it. New tab, so
              the one permitted link out cannot cost the conversion. */}
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            <a
              href="/privacy"
              target="_blank"
              rel="noopener"
              className="underline decoration-border-strong underline-offset-4 transition-colors hover:text-traq-purple-ink hover:decoration-traq-purple"
            >
              Privacy policy
            </a>
            <a
              href="/terms"
              target="_blank"
              rel="noopener"
              className="underline decoration-border-strong underline-offset-4 transition-colors hover:text-traq-purple-ink hover:decoration-traq-purple"
            >
              Terms
            </a>
            <span>&copy; {new Date().getFullYear()} Traq Collective</span>
          </p>
        </div>
      </div>
    </>
  );
}
