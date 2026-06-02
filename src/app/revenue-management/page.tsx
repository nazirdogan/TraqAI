import type { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/sections/CTABanner';

const TITLE = 'AI Revenue Management';
const DESCRIPTION =
  'Turn your pipeline into a forecastable, self-driving revenue engine. Traq Collective builds AI lead scoring, pipeline forecasting, churn prevention, and automated follow-up into the CRM your team already uses.';
const CANONICAL = 'https://traqcollective.com/revenue-management';
const OG_IMAGE = 'https://traqcollective.com/og-revenue-management.png';

export const metadata: Metadata = {
  title: `${TITLE} | Traq Collective`,
  description: DESCRIPTION,
  keywords: [
    'AI revenue management',
    'revenue operations',
    'AI lead scoring',
    'pipeline forecasting',
    'sales forecasting AI',
    'churn prediction',
    'revenue intelligence',
    'CRM automation',
    'RevOps agency',
    'AI sales automation',
  ],
  authors: [{ name: 'Traq Collective' }],
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: 'website',
    title: 'AI Revenue Management — A Self-Driving Pipeline',
    description: DESCRIPTION,
    url: CANONICAL,
    siteName: 'Traq Collective',
    locale: 'en_GB',
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | Traq Collective`,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

type Leak = { stat: string; title: string; description: string };

const LEAKS: Leak[] = [
  {
    stat: '27%',
    title: 'of forecasts miss',
    description:
      'Deals slip a quarter because the pipeline is a snapshot in a spreadsheet, not a live model of what will actually close.',
  },
  {
    stat: '5+ hrs',
    title: 'lost per rep, per week',
    description:
      'Manual data entry, CRM hygiene, and chasing stalled deals eat the hours your team should spend selling.',
  },
  {
    stat: '1 in 4',
    title: 'leads never followed up',
    description:
      'Inbound enquiries cool off before anyone replies, and the highest-intent buyers route to nobody in particular.',
  },
];

type Capability = {
  icon: string;
  title: string;
  tagline: string;
  bullets: string[];
};

const CAPABILITIES: Capability[] = [
  {
    icon: '🎯',
    title: 'AI Lead Scoring',
    tagline: 'Every lead ranked the moment it lands.',
    bullets: [
      'Fit + intent scoring on enquiry',
      'Auto-routed to the right owner',
      'Reps work the best deals first',
    ],
  },
  {
    icon: '📈',
    title: 'Pipeline Forecasting',
    tagline: 'A weighted forecast you can actually defend.',
    bullets: [
      'Win-probability per deal, updated live',
      'Stage-by-stage conversion modelling',
      'Board-ready forecast in one view',
    ],
  },
  {
    icon: '✍️',
    title: 'Automated Follow-up',
    tagline: 'No deal goes cold on your watch.',
    bullets: [
      'AI-drafted replies in your voice',
      'Smart cadences across email + WhatsApp',
      'Nudges before a deal goes quiet',
    ],
  },
  {
    icon: '🛡️',
    title: 'Churn Prevention',
    tagline: 'See the at-risk accounts before they leave.',
    bullets: [
      'Health scores from usage + signals',
      'Early-warning alerts to CS',
      'Save-play workflows triggered automatically',
    ],
  },
  {
    icon: '💷',
    title: 'Pricing & Expansion',
    tagline: 'Surface the upsell the data already knows about.',
    bullets: [
      'Expansion signals flagged in-account',
      'Discount + margin guardrails',
      'Renewal windows tracked end to end',
    ],
  },
  {
    icon: '📊',
    title: 'Revenue Dashboards',
    tagline: 'One source of truth for the whole funnel.',
    bullets: [
      'Pipeline, won, cycle, win-rate live',
      'Cohort and segment breakdowns',
      'Daily digest, no analyst required',
    ],
  },
];

type Step = { number: string; title: string; description: string };

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Map the revenue motion',
    description:
      'We trace every stage from first touch to renewal — where deals stall, where leads leak, and where the forecast goes wrong.',
  },
  {
    number: '02',
    title: 'Wire AI into your CRM',
    description:
      'Scoring, forecasting, and follow-up are built into the system your team already lives in. No rip-and-replace, no new tab to learn.',
  },
  {
    number: '03',
    title: 'Pilot on real pipeline',
    description:
      'In 1–3 weeks you have a working model running against live deals, tuned against your historical close data until the numbers hold up.',
  },
  {
    number: '04',
    title: 'Scale and report',
    description:
      'We roll it across the team, instrument every metric, and stay on to evolve the model as your motion and market shift.',
  },
];

type Metric = { value: string; label: string; description: string; segment: string };

const METRICS: Metric[] = [
  {
    value: '3×',
    label: 'Faster lead response',
    description:
      'AI routing and drafted replies cut the first-response window from hours to minutes — buyers reach a human while intent is hot.',
    segment: 'B2B SaaS',
  },
  {
    value: '+18%',
    label: 'Lift in win rate',
    description:
      'Reps focused on AI-prioritised deals instead of the loudest inbox closed a measurably higher share of pipeline.',
    segment: 'Professional Services',
  },
  {
    value: '92%',
    label: 'Forecast accuracy',
    description:
      'A live, weighted model replaced gut-feel roll-ups — the leadership team finally trusts the number going to the board.',
    segment: 'Enterprise',
  },
];

export default function RevenueManagementPage() {
  return (
    <>
      {/* ───────────────── Hero ───────────────── */}
      <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-8 sm:pb-28 sm:pt-44">
        <div className="mesh-bg" aria-hidden="true" />
        <div className="grid-overlay" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Link
            href="/#contact"
            className="sr-kicker group transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
          >
            <span className="hero-kicker-badge">RevOps</span>
            Built into your CRM, not bolted on
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
            A pipeline that <span className="text-gradient">forecasts and sells itself.</span>
          </h1>
          <p className="section-sub mx-auto mt-5">
            Traq Collective wires AI into how your revenue actually works — scoring every lead,
            forecasting every deal, and chasing the follow-ups your team never gets to. Less guesswork,
            more closed pipeline.
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-3.5">
            <Link
              href="/#contact"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-bg-base shadow-glow transition-all hover:-translate-y-px hover:bg-[#f0edff] hover:shadow-glow-strong active:scale-[0.98]"
            >
              Book a Free Call
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
            <Link
              href="/automation-roi-calculator"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border-strong bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-traq-light hover:bg-white/[0.08]"
            >
              Calculate your ROI
            </Link>
          </div>

          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4">
            {[
              { value: '1–3wk', label: 'to live pilot' },
              { value: '92%', label: 'forecast accuracy' },
              { value: '3×', label: 'faster follow-up' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="impact-value text-[clamp(28px,6vw,44px)]">{s.value}</div>
                <div className="mt-2 text-[12px] uppercase tracking-[0.16em] text-white/45">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── The problem ───────────────── */}
      <section className="relative px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <div className="eyebrow">Where revenue leaks</div>
            <h2 className="section-title mt-4">
              Your pipeline is leaking <span className="text-gradient">where the work is manual.</span>
            </h2>
            <p className="section-sub mx-auto">
              Most teams don&rsquo;t have a selling problem — they have a visibility and follow-through
              problem. Here&rsquo;s where the money quietly walks out.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {LEAKS.map((l) => (
              <div
                key={l.title}
                className="relative overflow-hidden rounded-3xl border border-border-subtle bg-gradient-to-b from-[rgba(20,24,48,0.6)] to-[rgba(14,17,32,0.85)] px-8 py-9"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <div className="impact-value mb-4 text-[clamp(36px,6vw,56px)]">{l.stat}</div>
                <div className="mb-2.5 text-[17px] font-semibold tracking-tight text-white">
                  {l.title}
                </div>
                <p className="m-0 text-[13px] leading-relaxed text-white/60">{l.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Capabilities ───────────────── */}
      <section className="relative px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="eyebrow">What we build</div>
            <h2 className="section-title mt-4">
              Six systems. <span className="text-gradient">One revenue engine.</span>
            </h2>
            <p className="section-sub mx-auto">
              Each one plugs into the CRM you already run. Switch on what you need now, layer in the
              rest as you grow.
            </p>
          </div>

          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c) => (
              <div
                key={c.title}
                className="group relative overflow-hidden rounded-3xl border border-border-subtle bg-gradient-to-b from-[rgba(20,24,48,0.6)] to-[rgba(14,17,32,0.85)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-traq-light/40 sm:p-8"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-border-subtle bg-white/[0.04] text-[28px] transition-transform duration-300 group-hover:scale-105">
                  {c.icon}
                </div>
                <h3 className="m-0 text-[22px] font-semibold leading-tight tracking-tight text-white">
                  {c.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-white/60 [text-wrap:pretty]">
                  {c.tagline}
                </p>
                <ul className="mt-5 flex list-none flex-col gap-2 p-0">
                  {c.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-[13px] leading-snug text-white/75"
                    >
                      <span className="mt-[7px] block h-[5px] w-[5px] flex-none rounded-full bg-traq-light" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── How it works ───────────────── */}
      <section className="relative px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="eyebrow">How we deliver</div>
            <h2 className="section-title mt-4">
              From spreadsheet roll-ups to a <span className="text-gradient">self-driving pipeline.</span>
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.number}
                className="relative overflow-hidden rounded-3xl border border-border-subtle bg-gradient-to-b from-[rgba(20,24,48,0.6)] to-[rgba(14,17,32,0.85)] px-7 py-8"
              >
                <div className="impact-value mb-4 text-[clamp(32px,5vw,48px)]">{s.number}</div>
                <div className="mb-2.5 text-[17px] font-semibold tracking-tight text-white">
                  {s.title}
                </div>
                <p className="m-0 text-[13px] leading-relaxed text-white/60">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Impact ───────────────── */}
      <section className="relative px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="eyebrow">Measured impact</div>
            <h2 className="section-title mt-4">
              Every engagement has a <span className="text-gradient">number on it.</span>
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="relative overflow-hidden rounded-3xl border border-border-subtle bg-gradient-to-b from-[rgba(20,24,48,0.6)] to-[rgba(14,17,32,0.85)] px-8 py-9 transition-all duration-300 hover:-translate-y-1 hover:border-traq-light/40"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <div className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  {m.segment}
                </div>
                <div className="impact-value mb-4">{m.value}</div>
                <div className="m-0 mb-2.5 text-[17px] font-semibold tracking-tight text-white">
                  {m.label}
                </div>
                <p className="m-0 text-[13px] leading-relaxed text-white/60">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── CTA ───────────────── */}
      <CTABanner />
    </>
  );
}
