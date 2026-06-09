'use client';

import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/* ---------- Count-up hook (respects reduced motion) ---------- */
function useCountUp(target: number, run: boolean, durationMs = 900) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? target : 0);

  useEffect(() => {
    if (!run) return;
    if (reduce) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, durationMs, reduce]);

  return value;
}

/* ---------- Snapshot rows (flat, solid colours) ---------- */
type BarRow = {
  label: string;
  /** 0–100 fill for the neutral track */
  pct: number;
  /** the count-up target */
  target: number;
  /** how to render the number once counted */
  format: (n: number) => string;
};

const ROWS: BarRow[] = [
  { label: 'Tools activated', pct: 67, target: 4, format: (n) => `${n}/6` },
  { label: 'Team confidence', pct: 72, target: 72, format: (n) => `${n}%` },
  { label: 'Workshops delivered', pct: 83, target: 5, format: (n) => `${n}` },
  { label: 'Hours saved / week', pct: 78, target: 31, format: (n) => `${n}` },
];

const TIMELINE = [
  { phase: '0–30', label: 'Audit' },
  { phase: '30–60', label: 'Train' },
  { phase: '60–90', label: 'Embed' },
  { phase: '90+', label: 'Own it' },
];

function SnapshotRow({ row, run, delay }: { row: BarRow; run: boolean; delay: number }) {
  const reduce = useReducedMotion();
  const n = useCountUp(row.target, run);
  return (
    <div className="snap-row">
      <div className="snap-row__head">
        <span className="snap-row__label">{row.label}</span>
        <span className="snap-row__value">{row.format(n)}</span>
      </div>
      <div className="snap-row__track" role="presentation">
        <motion.span
          className="snap-row__fill"
          initial={{ width: reduce ? `${row.pct}%` : 0 }}
          animate={run ? { width: `${row.pct}%` } : undefined}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function SnapshotPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="snap-card" aria-label="AI adoption snapshot">
      <div className="snap-card__head">
        <div className="snap-card__title">
          <span className="snap-card__dot" aria-hidden="true" />
          AI adoption
        </div>
        <span className="snap-card__tag">Last 90 days</span>
      </div>

      <div className="snap-card__rows">
        {ROWS.map((row, i) => (
          <SnapshotRow key={row.label} row={row} run={inView} delay={0.15 + i * 0.1} />
        ))}
      </div>

      <div className="snap-card__timeline">
        <div className="snap-tl__label">Enablement sprint</div>
        <div className="snap-tl__rail" aria-hidden="true">
          {TIMELINE.map((t, i) => (
            <motion.div
              key={t.phase}
              className={`snap-tl__step${i <= 2 ? ' is-done' : ''}`}
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.45, delay: 0.5 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="snap-tl__node" />
              <span className="snap-tl__phase">{t.phase}</span>
              <span className="snap-tl__step-label">{t.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */
const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const reduce = useReducedMotion();
  const fade = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="top" className="relative overflow-hidden bg-bg-base px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:pb-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Left: copy */}
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.1, delayChildren: 0.05 }}
          className="max-w-2xl"
        >
          <motion.p
            variants={fade}
            transition={{ duration: 0.5, ease }}
            className="eyebrow"
          >
            AI training · consulting · implementation
          </motion.p>

          <motion.h1
            variants={fade}
            transition={{ duration: 0.6, ease }}
            className="mt-5 text-[clamp(32px,6vw,60px)] font-bold leading-[1.05] tracking-[-0.02em] text-ink [text-wrap:balance]"
          >
            You&rsquo;ve got the AI tools. We help your team actually use them.
          </motion.h1>

          <motion.p
            variants={fade}
            transition={{ duration: 0.6, ease }}
            className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-[17px] [text-wrap:pretty]"
          >
            Most teams have AI tools they barely touch. We come in, train your people, and wire AI into
            the way you already work, so the tools you pay for start saving real time. And we stay until
            your team can run it without us.
          </motion.p>

          <motion.div
            variants={fade}
            transition={{ duration: 0.6, ease }}
            className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/book"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-traq-purple px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink active:scale-[0.98]"
            >
              Book a free call
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link
              href="/#how-we-work"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border-strong bg-white px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-traq-purple hover:text-traq-purple-ink"
            >
              See how we work
            </Link>
          </motion.div>
        </motion.div>

        {/* Right: flat light snapshot */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="w-full"
        >
          <SnapshotPanel />
        </motion.div>
      </div>
    </section>
  );
}
