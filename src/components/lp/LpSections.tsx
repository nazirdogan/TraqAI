import Image from 'next/image';
import {
  LP_GROUP_SIZES,
  OFFER_FORMATS,
  PILLARS,
  PROOF,
  RISK_REVERSAL,
  QUALIFIERS,
} from '@/lib/lp';
import { DELIVERY_PHASES, FEATURED_TRACKS, TRAINING_TOOLS } from '@/lib/training';

/**
 * The tracks this page sells.
 *
 * The same featured set the services page leads with, so the two never drift.
 * Gemini is delivered on request and listed there, but a paid landing page
 * should offer one clear path per stack rather than a wall of logos.
 */
const LP_TRACKS = FEATURED_TRACKS;

/**
 * Section furniture for the paid-search landing pages.
 *
 * Server components, no client JS. Everything reuses the sitewide card and type
 * language (rounded-[24px], border-subtle, shadow-card, solid purple accent) so
 * a visitor who lands from an ad and later sees traqcollective.com recognises
 * the same product.
 *
 * The catalogue sections read from src/lib/training.ts, the same source the
 * /services/ai-training page uses. These pages are the only destination paid
 * traffic is sent to, so the offer has to be answered here rather than behind a
 * link the visitor is never given.
 */

/** Shared measure. Wide enough to carry a real grid, short of full-bleed. */
const SHELL = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

const LEVEL_STYLES: Record<string, string> = {
  Leadership: 'border-traq-purple/40 bg-traq-tint text-traq-purple-ink',
  Core: 'border-border-strong bg-bg-subtle text-ink-soft',
  Advanced: 'border-traq-purple/25 bg-white text-traq-purple-ink',
};

/** Wordmark only. No navigation, no menu, nothing that links off the page. */
export function LpHeader() {
  return (
    <header className="border-b border-border-subtle bg-bg-base">
      <div className={`${SHELL} flex h-[66px] items-center justify-between gap-4`}>
        <Image
          src="/logos/wordmark-purple.png"
          alt="Traq Collective"
          width={1888}
          height={696}
          priority
          className="h-[24px] w-auto"
        />
        <p className="hidden text-[12.5px] text-ink-faint sm:block">
          Dubai &middot; Abu Dhabi &middot; Remote
        </p>
      </div>
    </header>
  );
}

/**
 * The qualifier row, above the fold on purpose.
 *
 * A student or job seeker should know within two seconds that this is not for
 * them. Every one repelled here is a click we do not pay to convert.
 */
export function LpQualifiers() {
  return (
    <ul className="mt-7 flex flex-wrap gap-2">
      {QUALIFIERS.map((q) => (
        <li
          key={q.label}
          className={
            q.fits
              ? 'inline-flex items-center gap-2 rounded-full border border-border-subtle bg-traq-tint px-3.5 py-1.5 text-[13px] font-semibold text-ink'
              : 'inline-flex items-center gap-2 rounded-full border border-border-subtle bg-transparent px-3.5 py-1.5 text-[13px] font-semibold text-ink-soft'
          }
        >
          <span
            aria-hidden="true"
            className={
              q.fits
                ? 'h-1.5 w-1.5 flex-none rounded-full bg-traq-purple'
                : 'h-1.5 w-1.5 flex-none rounded-full bg-border-strong'
            }
          />
          {q.label}
        </li>
      ))}
    </ul>
  );
}

/**
 * The three pillars, in the hero's right column.
 *
 * Answers "what is this actually" on the first screen, which the page has to do
 * itself: there is no navigation to a services page from here.
 */
export function LpPillars() {
  return (
    <aside className="rounded-[24px] border border-border-subtle bg-white p-6 shadow-card sm:p-7">
      <p className="text-[10.5px] font-semibold uppercase tracking-widest text-ink-faint">
        Bespoke, not off the shelf
      </p>
      <ul className="mt-5 flex flex-col gap-5">
        {PILLARS.map((p) => (
          <li key={p.title} className="flex gap-3.5">
            <span
              aria-hidden="true"
              className="mt-1.5 h-2 w-2 flex-none rotate-45 rounded-[2px] bg-traq-purple"
            />
            <div>
              <h2 className="text-[15px] font-bold leading-snug tracking-tight text-ink">
                {p.title}
              </h2>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
                {p.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 border-t border-border-subtle pt-4 text-[12.5px] leading-relaxed text-ink-faint">
        Delivered in person across Dubai and Abu Dhabi, or remote worldwide.
      </p>
    </aside>
  );
}

/**
 * The catalogue.
 *
 * The six tracks sold on /services/ai-training, in the order a rollout runs
 * them: leadership first, then the tool tracks, then automation.
 */
export function LpTracks() {
  return (
    <section className="border-t border-border-subtle bg-bg-base px-0 py-14 sm:py-16">
      <div className={SHELL}>
        <p className="eyebrow">What we actually train</p>
        <h2 className="mt-3 max-w-2xl text-balance text-[clamp(22px,3vw,29px)] font-bold leading-tight tracking-tight text-ink">
          Five tracks, picked to match who is in the room
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
          Every serious programme splits by seniority rather than by tool: the
          leadership question and the &ldquo;I have the licence and never open
          it&rdquo; question need different sessions. Most companies run the
          leadership track first, then one or two tool tracks across the teams.
        </p>

        <ul className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LP_TRACKS.map((track) => (
            <li
              key={track.slug}
              className="flex flex-col rounded-[20px] border border-border-subtle bg-white p-6 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[16.5px] font-bold leading-snug tracking-tight text-ink">
                  {track.name}
                </h3>
                <span
                  className={`flex-none rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    LEVEL_STYLES[track.level] ?? LEVEL_STYLES.Core
                  }`}
                >
                  {track.level}
                </span>
              </div>

              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
                {track.summary}
              </p>

              <dl className="mt-5 flex flex-col gap-2.5 border-t border-border-subtle pt-4 text-[12.5px] leading-relaxed">
                <div className="flex gap-2">
                  <dt className="w-[58px] flex-none font-semibold text-ink-faint">Who</dt>
                  <dd className="text-ink-soft">{track.audience}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-[58px] flex-none font-semibold text-ink-faint">Length</dt>
                  <dd className="text-ink-soft">{track.format}</dd>
                </div>
              </dl>

              <p className="mt-4 rounded-xl bg-bg-subtle px-3.5 py-3 text-[12.5px] leading-relaxed text-ink-soft">
                <span className="font-semibold text-ink">They leave with </span>
                {track.outcome}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-[12.5px] font-semibold text-ink-faint">
            Tools we put hands on:
          </span>
          {TRAINING_TOOLS.filter((t) => t.name !== 'Gemini').map((t) => (
            <span
              key={t.name}
              className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink-soft"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 flex-none rounded-full"
                style={{ backgroundColor: t.dotColor }}
              />
              {t.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * How the bespoke part actually works.
 *
 * The "after" is the phase that separates training that sticks from a day
 * everyone enjoyed and then forgot, so it is named rather than implied.
 */
export function LpDelivery() {
  return (
    <section className="border-t border-border-subtle bg-bg-subtle px-0 py-14 sm:py-16">
      <div className={SHELL}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          <div>
            <p className="eyebrow">Built around your workflows</p>
            <h2 className="mt-3 text-balance text-[clamp(22px,3vw,29px)] font-bold leading-tight tracking-tight text-ink">
              The agenda is built from your work, not a slide deck
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              Nobody watches a demo. People bring live work and leave having done
              it faster, with the guardrails explained as we go rather than as a
              policy slide at the end.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              That is why the scoping happens before anyone books a room. Two
              teams in the same company rarely need the same session.
            </p>
          </div>

          <ol className="flex flex-col gap-4">
            {DELIVERY_PHASES.map((phase) => (
              <li
                key={phase.step}
                className="flex gap-5 rounded-[20px] border border-border-subtle bg-white p-6 shadow-card"
              >
                <span className="text-[13px] font-bold tabular-nums text-traq-purple">
                  {phase.step}
                </span>
                <div>
                  <h3 className="text-[16px] font-bold leading-snug tracking-tight text-ink">
                    {phase.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
                    {phase.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function LpProof() {
  return (
    <section className="border-t border-border-subtle bg-bg-base px-0 py-14 sm:py-16">
      <div className={SHELL}>
        <div className="grid gap-9 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-14">
          <div>
            <p className="eyebrow">What this looks like when it lands</p>
            <h2 className="mt-3 text-balance text-[clamp(22px,3vw,29px)] font-bold leading-tight tracking-tight text-ink">
              {PROOF.heading}
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
              The same enablement motion the tracks above describe, measured
              before and after on a real engagement.
            </p>
          </div>

          <div className="rounded-[24px] border border-border-subtle bg-white p-6 shadow-card sm:p-8">
            <dl className="grid gap-7 sm:grid-cols-3">
              {PROOF.metrics.map((m) => (
                <div key={m.value}>
                  <dt className="sr-only">{m.label}</dt>
                  <dd>
                    <span className="block text-[32px] font-extrabold leading-none tracking-tight text-traq-purple tabular-nums">
                      {m.value}
                    </span>
                    <span className="mt-2 block text-[13px] leading-relaxed text-ink-soft">
                      {m.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 border-t border-border-subtle pt-5 text-[12.5px] leading-relaxed text-ink-faint">
              {PROOF.attribution}
            </p>

            <div className="mt-5 flex items-center gap-3.5 border-t border-border-subtle pt-5">
              <Image
                src="/nazir.jpg"
                alt="Nazir Dogan"
                width={40}
                height={40}
                className="h-10 w-10 flex-none rounded-full object-cover"
              />
              <p className="text-[12.5px] leading-relaxed text-ink-faint">
                <span className="font-semibold text-ink-soft">{PROOF.founder}</span>
                <br />
                {PROOF.licence}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The offer, without rates.
 *
 * Engagements are scoped through an enquiry, so this shows the formats and why
 * each one exists rather than a number. A rate quoted before anyone has looked
 * at the workflows either anchors low or scares off a buyer who has not scoped
 * anything yet, and neither is a conversation worth starting.
 */
export function LpOffer({ heading }: { heading: string }) {
  return (
    <section className="border-t border-border-subtle bg-bg-base px-0 py-14 sm:py-16">
      <div className={SHELL}>
        <p className="eyebrow">How it is delivered</p>
        <h2 className="mt-3 max-w-2xl text-balance text-[clamp(22px,3vw,29px)] font-bold leading-tight tracking-tight text-ink">
          {heading}
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
          Four shapes, and the honest reason to pick each one. Which one fits
          depends on how many teams you are moving and how much needs wiring in
          afterwards, so we scope it with you rather than quoting from a list.
        </p>

        <ul className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {OFFER_FORMATS.map((f) => (
            <li
              key={f.name}
              className="flex flex-col rounded-[20px] border border-border-subtle bg-white p-6 shadow-card"
            >
              <h3 className="text-[16.5px] font-bold leading-snug tracking-tight text-ink">
                {f.name}
              </h3>
              <p className="mt-2 text-[13px] font-semibold text-traq-purple-ink">
                {f.length}
              </p>
              <p className="mt-1 text-[12.5px] text-ink-faint">
                {LP_GROUP_SIZES[f.name] ?? f.who}
              </p>
              <p className="mt-4 border-t border-border-subtle pt-4 text-[13.5px] leading-relaxed text-ink-soft">
                {f.why}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-9 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-[24px] border border-border-subtle bg-traq-tint p-6 sm:p-8">
            <h3 className="text-[18px] font-bold leading-snug tracking-tight text-ink">
              {RISK_REVERSAL.heading}
            </h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
              {RISK_REVERSAL.body}
            </p>
          </div>

          <div className="rounded-[24px] border border-border-subtle bg-bg-subtle p-6 sm:p-8">
            <h3 className="text-[15px] font-bold leading-snug tracking-tight text-ink">
              What a quote depends on
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {[
                'How many people, and how many separate sessions',
                'Which tracks, and whether leadership runs first',
                'How much gets wired into your tools afterwards',
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink-soft">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-traq-purple"
                  />
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-border-subtle pt-4 text-[12.5px] leading-relaxed text-ink-faint">
              We take on a limited number of new partners each quarter, so every
              team gets senior attention.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
