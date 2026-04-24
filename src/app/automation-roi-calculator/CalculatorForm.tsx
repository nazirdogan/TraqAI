'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const CURRENCIES: Array<{ cur: string; sym: string; rate: string; label: string; active?: boolean }> = [
  { cur: 'GBP', sym: '£', rate: '1', label: '🇬🇧 GBP', active: true },
  { cur: 'USD', sym: '$', rate: '1.27', label: '🇺🇸 USD' },
  { cur: 'AED', sym: 'د.إ', rate: '4.67', label: '🇦🇪 AED' },
  { cur: 'SAR', sym: '﷼', rate: '4.76', label: '🇸🇦 SAR' },
];

const ERROR_RATES: Array<{ rate: string; label: string; active?: boolean }> = [
  { rate: '0.01', label: 'Rare · 1%' },
  { rate: '0.03', label: 'Occasional · 3%', active: true },
  { rate: '0.06', label: 'Common · 6%' },
  { rate: '0.10', label: 'High · 10%' },
];

const STEP_TITLES = ['Your team', 'Manual workload', 'Automation scenario'] as const;
const TOTAL_STEPS = STEP_TITLES.length;

const INPUT_CLS =
  'w-full rounded-xl border border-border-subtle bg-bg-elevated py-3 pl-9 pr-3.5 text-[15px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-traq-light focus:ring-2 focus:ring-traq-light/30';
const PREFIX_CLS =
  'pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-white/45';
const TOGGLE_ACTIVE =
  'border-traq-light/60 bg-traq-purple/20 text-traq-light shadow-[0_0_18px_-4px_rgba(124,99,240,0.55)]';
const TOGGLE_INACTIVE =
  'border-border-subtle bg-bg-elevated text-white/60 hover:border-border-strong hover:text-white';
const STEP_NUM_CLS =
  'inline-flex h-6 w-6 items-center justify-center rounded-md border border-border-strong bg-traq-purple/20 text-[11px] font-bold text-traq-light';

function stepClasses(isActive: boolean) {
  return isActive ? 'service-card lg:flex-1' : 'hidden';
}

function StepHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className={STEP_NUM_CLS}>{n}</span>
        <div className="min-w-0 leading-tight">
          <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40">
            Step {n} / {TOTAL_STEPS}
          </div>
          <div className="truncate text-[12px] font-semibold uppercase tracking-[0.18em] text-traq-light">
            {title}
          </div>
        </div>
      </div>
      <div className="flex w-full items-center gap-1.5 sm:w-[84px]">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= n ? 'bg-traq-light' : 'bg-white/10'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function CalculatorForm() {
  const [step, setStep] = useState(1);
  const [showFull, setShowFull] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (window.matchMedia('(max-width: 1023px)').matches) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step]);

  useEffect(() => {
    if (showFull) {
      fullRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showFull]);

  const goPrev = () => setStep((s) => Math.max(1, s - 1));
  const goNext = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const openFull = () => setShowFull(true);
  const closeFull = () => setShowFull(false);

  return (
    <div ref={formRef} className="mx-auto max-w-6xl">
      <div
        className={`grid gap-5 lg:gap-6 ${
          showFull ? '' : 'lg:grid-cols-[1fr_1fr] lg:items-stretch'
        }`}
      >
        {/* LEFT — STEPPED INPUTS (mounted always so JS listeners survive) */}
        <div className={`${showFull ? 'hidden' : 'lg:flex lg:flex-col'}`}>
          {/* Card 1: Team */}
          <div className={stepClasses(step === 1)} aria-hidden={step !== 1}>
            <StepHeader n={1} title={STEP_TITLES[0]} />

            <div className="mb-4">
              <label htmlFor="staff" className="block">
                <span className="block text-sm font-medium text-white">
                  Number of staff doing manual tasks
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-white/45">
                  Count everyone who touches repetitive admin, data entry, or follow-up work.
                </span>
              </label>
              <div className="relative mt-3">
                <span className={PREFIX_CLS}>#</span>
                <input
                  id="staff"
                  type="number"
                  defaultValue={5}
                  min={1}
                  max={500}
                  aria-label="Number of staff"
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="salary" className="block">
                <span className="block text-sm font-medium text-white">
                  Average annual salary per person
                </span>
                <span className="mt-1 block text-xs text-white/45">Gross salary, before tax.</span>
              </label>
              <div className="relative mt-3">
                <span id="currency-symbol" className={PREFIX_CLS}>
                  £
                </span>
                <input
                  id="salary"
                  type="number"
                  defaultValue={35000}
                  min={10000}
                  max={300000}
                  aria-label="Average salary"
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-white">Currency / region</span>
              <div
                role="group"
                aria-label="Select currency"
                className="mt-3 grid grid-cols-2 gap-2"
              >
                {CURRENCIES.map((c) => (
                  <button
                    key={c.cur}
                    type="button"
                    data-currency={c.cur}
                    data-symbol={c.sym}
                    data-rate={c.rate}
                    className={`rounded-xl border px-3 py-2.5 text-sm transition-all ${
                      c.active ? `active ${TOGGLE_ACTIVE}` : TOGGLE_INACTIVE
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <StepNav step={1} onPrev={goPrev} onNext={goNext} onFinish={openFull} />
          </div>

          {/* Card 2: Manual Workload */}
          <div className={stepClasses(step === 2)} aria-hidden={step !== 2}>
            <StepHeader n={2} title={STEP_TITLES[1]} />

            <div className="mb-5">
              <label htmlFor="hours" className="block">
                <span className="block text-sm font-medium text-white">
                  Hours per person spent on manual tasks weekly
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-white/45">
                  Think: data entry, copy-paste between systems, chasing documents, sending status
                  updates.
                </span>
              </label>
              <div className="mt-4">
                <div
                  id="hours-display"
                  className="mb-3 text-2xl font-semibold text-traq-light"
                >
                  12 <small className="text-xs font-normal text-white/45">hours/week per person</small>
                </div>
                <input
                  id="hours"
                  type="range"
                  min={1}
                  max={40}
                  defaultValue={12}
                  step={1}
                  aria-label="Hours per week"
                  aria-valuemin={1}
                  aria-valuemax={40}
                  className="roi-slider"
                />
              </div>
            </div>

            <div className="mb-5">
              <span className="block text-sm font-medium text-white">Error rate on manual tasks</span>
              <span className="mt-1 block text-xs leading-relaxed text-white/45">
                How often does a manual step produce a mistake requiring rework?
              </span>
              <div role="group" aria-label="Error rate" className="mt-3 grid grid-cols-2 gap-2">
                {ERROR_RATES.map((e) => (
                  <button
                    key={e.rate}
                    type="button"
                    data-error={e.rate}
                    className={`rounded-xl border px-3 py-2.5 text-sm transition-all ${
                      e.active ? `active ${TOGGLE_ACTIVE}` : TOGGLE_INACTIVE
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="error-cost" className="block">
                <span className="block text-sm font-medium text-white">
                  Average cost of one manual error
                </span>
                <span className="mt-1 block text-xs text-white/45">
                  Re-delivery, disputed invoice, wasted staff time unpicking mistakes.
                </span>
              </label>
              <div className="relative mt-3">
                <span id="currency-symbol-2" className={PREFIX_CLS}>
                  £
                </span>
                <input
                  id="error-cost"
                  type="number"
                  defaultValue={250}
                  min={0}
                  max={50000}
                  aria-label="Cost per error"
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <StepNav step={2} onPrev={goPrev} onNext={goNext} onFinish={openFull} />
          </div>

          {/* Card 3: Automation Scenario */}
          <div className={stepClasses(step === 3)} aria-hidden={step !== 3}>
            <StepHeader n={3} title={STEP_TITLES[2]} />

            <div className="mb-5">
              <label htmlFor="auto-pct" className="block">
                <span className="block text-sm font-medium text-white">
                  What % of manual work can be automated?
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-white/45">
                  Conservative estimate: 60–80% of repetitive tasks are automatable. Adjust to your
                  process complexity.
                </span>
              </label>
              <div className="mt-4">
                <div
                  id="auto-pct-display"
                  className="mb-3 text-2xl font-semibold text-traq-light"
                >
                  70<small className="text-xs font-normal text-white/45">% automatable</small>
                </div>
                <input
                  id="auto-pct"
                  type="range"
                  min={10}
                  max={95}
                  defaultValue={70}
                  step={5}
                  aria-label="Automation percentage"
                  className="roi-slider"
                />
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="project-cost" className="block">
                <span className="block text-sm font-medium text-white">
                  Estimated project investment
                </span>
                <span className="mt-1 block text-xs text-white/45">
                  Typical Traq Collective engagement: £5K–£25K. Adjust to your scenario.
                </span>
              </label>
              <div className="relative mt-3">
                <span id="currency-symbol-3" className={PREFIX_CLS}>
                  £
                </span>
                <input
                  id="project-cost"
                  type="number"
                  defaultValue={12000}
                  min={1000}
                  max={500000}
                  aria-label="Project cost"
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="rounded-xl border border-traq-light/30 bg-traq-purple/10 px-4 py-3.5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-traq-light">
                Almost done
              </div>
              <p className="mt-1.5 text-[12px] leading-snug text-white/70">
                Click <strong className="text-white">Get full result</strong> to unlock your
                payback period, 3-year ROI, and what this really costs if you leave it alone.
              </p>
            </div>

            <StepNav step={3} onPrev={goPrev} onNext={goNext} onFinish={openFull} />
          </div>
        </div>

        {/* RIGHT / FULL — RESULTS (single tree, shared metric IDs) */}
        <aside
          ref={fullRef}
          className={showFull ? '' : 'h-full lg:sticky lg:top-24'}
        >
          <div
            className={`flex h-full flex-col overflow-hidden rounded-[24px] border border-border-strong bg-gradient-to-b from-[rgba(30,34,68,0.82)] to-[rgba(14,17,32,0.9)] shadow-card backdrop-blur-xl ${
              showFull ? 'mx-auto max-w-4xl' : ''
            }`}
          >
            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-border-subtle bg-white/[0.02] px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-7">
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-traq-light">
                  {showFull ? 'Your full ROI breakdown' : 'Your results'}
                </h2>
                <p className="mt-1 text-xs text-white/45">
                  {showFull
                    ? 'Every number below updates live if you adjust an input.'
                    : 'Updates instantly as you adjust inputs.'}
                </p>
              </div>
              {showFull && (
                <button
                  type="button"
                  onClick={closeFull}
                  className="self-start shrink-0 rounded-full border border-border-subtle bg-white/[0.03] px-3.5 py-2 text-[11px] font-medium text-white/70 transition-colors hover:border-border-strong hover:bg-white/[0.06] hover:text-white"
                >
                  ← Adjust inputs
                </button>
              )}
            </div>

            <div className="flex flex-1 flex-col px-6 py-6 sm:px-7">
              {/* Big metric — always visible */}
              <div className="relative overflow-hidden rounded-2xl border border-traq-light/40 bg-gradient-to-br from-traq-purple/30 via-traq-purple/10 to-traq-light/5 p-5 text-center sm:p-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-traq-light/90">
                  Annual cost of manual work
                </div>
                <div
                  id="res-annual-cost"
                  className="big-metric-val mt-2 text-4xl font-bold leading-none tracking-tight text-white sm:text-5xl"
                >
                  £0
                </div>
                <div className="mt-2 text-xs text-white/55">
                  What your team&rsquo;s manual processes cost every year.
                </div>
              </div>

              {/* Compact peek: two high-signal numbers, side by side */}
              {!showFull && (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border-subtle bg-white/[0.02] px-4 py-3">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                        Weekly hours lost
                      </div>
                      <div
                        id="res-weekly-hours"
                        className="metric-value mt-1.5 text-xl font-bold text-rose-400"
                      >
                        0 hrs
                      </div>
                    </div>
                    <div className="rounded-xl border border-border-subtle bg-white/[0.02] px-4 py-3">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                        Annual saving
                      </div>
                      <div
                        id="res-saving"
                        className="metric-value mt-1.5 text-xl font-bold text-emerald-400"
                      >
                        £0
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-border-subtle bg-white/[0.02] px-4 py-3.5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-traq-light/80">
                      How we calculate
                    </div>
                    <p className="mt-1.5 text-[12px] leading-snug text-white/60">
                      Staff-hours × loaded hourly rate, plus (error rate × cost per error ×
                      annual volume). Conservative — only counts time and error cost, not speed
                      or customer-experience upside.
                    </p>
                  </div>
                </>
              )}

              {/* Full-mode KPI grid — same metric IDs, shown only in full */}
              {showFull && (
                <>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <KpiTile
                      id="res-weekly-hours"
                      label="Weekly hours lost"
                      hint="Across entire team"
                      tone="rose"
                      defaultText="0 hrs"
                    />
                    <KpiTile
                      id="res-error-cost"
                      label="Annual cost of errors"
                      hint="Rework & disputed invoices"
                      tone="rose"
                      defaultText="£0"
                    />
                    <KpiTile
                      id="res-saving"
                      label="Annual saving"
                      hint="Time + error reduction"
                      tone="emerald"
                      defaultText="£0"
                    />
                    <KpiTile
                      id="res-3yr"
                      label="3-year net ROI"
                      hint="After project investment"
                      tone="violet"
                      defaultText="£0"
                    />
                    <KpiTile
                      id="res-payback"
                      label="Payback period"
                      hint="Months to break even"
                      tone="violet"
                      defaultText="—"
                    />
                    <div className="rounded-xl border border-rose-500/25 bg-rose-500/[0.06] px-4 py-3">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-300/80">
                        Cost of waiting
                      </div>
                      <p className="mt-1.5 text-[12px] leading-snug text-white/70">
                        The annual number above is what silently compounds on your P&amp;L every
                        year you delay.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/40">
                      <span>Payback progress</span>
                      <span>0 / 12 months</span>
                    </div>
                    <div
                      className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]"
                      role="progressbar"
                      aria-label="Payback period visualisation"
                    >
                      <div id="payback-bar" className="roi-payback-fill" style={{ width: '0%' }} />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[10px] text-white/40">
                      <span>Day 1</span>
                      <span>6 months</span>
                      <span>12 months</span>
                    </div>
                  </div>
                </>
              )}

              {/* Hidden-but-mounted full metrics in compact mode so the calc JS
                  always finds the DOM elements to update. */}
              {!showFull && (
                <div className="hidden" aria-hidden="true">
                  <span id="res-error-cost">£0</span>
                  <span id="res-3yr">£0</span>
                  <span id="res-payback">—</span>
                  <span id="payback-bar" className="roi-payback-fill" style={{ width: '0%' }} />
                </div>
              )}
            </div>

            {/* CTA / hint block */}
            <div className="border-t border-border-subtle bg-white/[0.02] px-6 py-5 sm:px-7 sm:py-6">
              {showFull ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[13px] leading-relaxed text-white/65 sm:max-w-sm">
                    Want us to pressure-test this against{' '}
                    <strong className="text-white">your actual operation</strong> — processes
                    mapped, build scoped, realistic payback?
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link
                      id="cta-main"
                      href="/#contact"
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-bg-base shadow-glow transition-all hover:-translate-y-px hover:bg-[#f0edff] hover:shadow-glow-strong active:scale-[0.98] sm:w-auto"
                    >
                      Get a free process audit
                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                    <button
                      id="download-btn"
                      type="button"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border-subtle bg-white/[0.03] px-5 py-3 text-xs font-medium text-white/70 transition-colors hover:border-border-strong hover:bg-white/[0.06] hover:text-white sm:w-auto"
                    >
                      Download summary (.txt)
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-[12px] leading-relaxed text-white/55">
                    Finish all three steps for the full ROI breakdown — payback period, 3-year net
                    return, and what waiting really costs you.
                  </p>
                  {/* Keep the CTA + download in the DOM so the untouched JS can wire them,
                      but hidden in compact mode. */}
                  <div className="hidden" aria-hidden="true">
                    <Link id="cta-main" href="/#contact">
                      Get a free process audit
                    </Link>
                    <button id="download-btn" type="button">
                      Download summary
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StepNav({
  step,
  onPrev,
  onNext,
  onFinish,
}: {
  step: number;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  const isFirst = step === 1;
  const isLast = step === TOTAL_STEPS;

  return (
    <div className="mt-auto flex items-center justify-between gap-2 border-t border-border-subtle pt-5 sm:gap-3">
      <div>
        {!isFirst && (
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-white/70 transition-colors hover:border-border-strong hover:bg-white/[0.06] hover:text-white sm:gap-2 sm:px-5"
          >
            <span aria-hidden="true">←</span>
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Back</span>
          </button>
        )}
      </div>
      <div>
        {!isLast ? (
          <button
            type="button"
            onClick={onNext}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-bg-base shadow-glow transition-all hover:-translate-y-px hover:bg-[#f0edff] hover:shadow-glow-strong active:scale-[0.98] sm:px-6"
          >
            Next
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onFinish}
            className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-traq-purple to-traq-light px-4 py-2.5 text-xs font-semibold text-white shadow-glow transition-all hover:-translate-y-px hover:shadow-glow-strong active:scale-[0.98] sm:gap-2 sm:px-6"
          >
            <span className="hidden sm:inline">Get full result</span>
            <span className="sm:hidden">See result</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

function KpiTile({
  id,
  label,
  hint,
  tone,
  defaultText,
}: {
  id: string;
  label: string;
  hint: string;
  tone: 'rose' | 'emerald' | 'violet';
  defaultText: string;
}) {
  const toneCls =
    tone === 'rose'
      ? 'text-rose-400'
      : tone === 'emerald'
      ? 'text-emerald-400'
      : 'text-traq-light';
  return (
    <div className="rounded-xl border border-border-subtle bg-white/[0.02] px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        {label}
      </div>
      <div id={id} className={`metric-value mt-1.5 text-xl font-bold ${toneCls}`}>
        {defaultText}
      </div>
      <div className="mt-1 text-[10px] text-white/35">{hint}</div>
    </div>
  );
}
