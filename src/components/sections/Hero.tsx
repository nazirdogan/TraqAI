'use client';

import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { track } from '@/components/analytics/Analytics';

/* ---------- Count-up hook (respects reduced motion) ---------- */
function useCountUp(target: number, run: boolean, durationMs = 1100) {
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
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, durationMs, reduce]);

  return value;
}

/* ---------- Adoption curve (flat, solid line + flat fill, no gradient) ----------
   Illustrative: share of the team confident using AI across the 90-day sprint.
   The VERTICAL axis is a % scale (0 → 100%), made explicit with gridlines and
   left-hand % labels so the curve can't be misread as a day axis. The endpoint
   sits at 89% / Day 90 and is labelled. Plot box: x 40→306, y 18(=100%)→150(=0%). */
const yOf = (pct: number) => 150 - (pct / 100) * 132; // 0%→150, 100%→18
const CURVE_D =
  'M 40 128.9 C 78 118, 100 104, 127 92 C 165 76, 188 68, 217 57.7 C 255 45, 282 39, 306 32.5';
const AREA_D = `${CURVE_D} L 306 150 L 40 150 Z`;
// [x, y, dayLabel] data points along the curve.
const POINTS: ReadonlyArray<readonly [number, number, string]> = [
  [40, 128.9, 'Day 0'],
  [127, 92, '30'],
  [217, 57.7, '60'],
  [306, 32.5, '90'],
];
// Horizontal % gridlines (the giveaway that the y-axis is a percentage).
const Y_TICKS = [0, 50, 89] as const;

function AdoptionCurve() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const pct = useCountUp(89, inView);

  return (
    <div
      ref={ref}
      className="rounded-[24px] border border-border-subtle bg-white p-6 shadow-card sm:p-7"
      aria-label="Share of the team confident using AI rises to 89% by day 90"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-ink">
          <span className="h-2 w-2 rounded-full bg-traq-purple" aria-hidden="true" />
          Team confident using AI
        </div>
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-faint">
          % of team · first 90 days
        </span>
      </div>

      <div className="mt-4 flex items-end gap-3">
        <span className="text-[44px] font-bold leading-none tracking-[-0.03em] text-traq-purple sm:text-[52px]">
          {pct}%
        </span>
        <span className="mb-1 text-[13px] leading-snug text-ink-soft">
          of the team confident
          <br />
          using AI, by day 90
        </span>
      </div>

      <svg
        viewBox="0 0 320 172"
        className="mt-5 w-full"
        fill="none"
        role="presentation"
        aria-hidden="true"
      >
        {/* % gridlines + left-hand axis labels — makes the vertical scale unmistakable */}
        {Y_TICKS.map((t) => (
          <g key={t}>
            <line
              x1="40"
              y1={yOf(t)}
              x2="306"
              y2={yOf(t)}
              stroke={t === 0 ? '#E3E3E3' : '#F0F0F0'}
              strokeWidth="1"
              strokeDasharray={t === 0 ? '0' : '3 4'}
            />
            <text
              x="32"
              y={yOf(t) + 3.5}
              textAnchor="end"
              fill="#8A8A8A"
              fontSize="10"
              fontWeight="600"
            >
              {t}%
            </text>
          </g>
        ))}

        {/* flat (non-gradient) area fill */}
        <motion.path
          d={AREA_D}
          fill="#F3F0FF"
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
        {/* the rising line, drawing on */}
        <motion.path
          d={CURVE_D}
          stroke="#5B3FE4"
          strokeWidth={2.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          initial={{ strokeDashoffset: reduce ? 0 : 1 }}
          animate={inView ? { strokeDashoffset: 0 } : undefined}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* data points */}
        {POINTS.map(([x, y], i) => (
          <motion.circle
            key={x}
            cx={x}
            cy={y}
            r={i === POINTS.length - 1 ? 5 : 3.5}
            fill="#fff"
            stroke="#5B3FE4"
            strokeWidth={2.5}
            initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.3, delay: reduce ? 0 : 0.5 + i * 0.28 }}
          />
        ))}
        {/* endpoint callout: "89%" pinned to the final Day-90 point */}
        <motion.g
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.4, delay: reduce ? 0 : 1.5 }}
        >
          <rect x="246" y="14" width="56" height="20" rx="10" fill="#5B3FE4" />
          <text x="274" y="27.5" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">
            89% · Day 90
          </text>
        </motion.g>
      </svg>

      {/* x-axis: day labels, aligned under the plot box (x 40→306 of 320) */}
      <div className="mt-1 flex justify-between pl-[10%] pr-[1%] text-[11px] font-medium text-ink-faint">
        {POINTS.map(([, , label]) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] text-ink-faint">Days into the 90-day sprint →</p>
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
    <section
      id="top"
      className="relative overflow-hidden bg-bg-base px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:pb-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Left: copy */}
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.1, delayChildren: 0.05 }}
          className="max-w-2xl"
        >
          <motion.p variants={fade} transition={{ duration: 0.5, ease }} className="eyebrow">
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
              onClick={() => track('cta_book_click', { location: 'hero' })}
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

          <motion.p
            variants={fade}
            transition={{ duration: 0.6, ease }}
            className="mt-5 text-[14px] text-ink-soft"
          >
            Not sure where you stand?{' '}
            <Link
              href="/ai-readiness"
              className="font-semibold text-traq-purple underline-offset-4 transition-colors hover:underline"
            >
              Take the free 2-minute AI readiness assessment
            </Link>
            <span aria-hidden="true"> &rarr;</span>
          </motion.p>
        </motion.div>

        {/* Right: adoption curve */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="w-full"
        >
          <AdoptionCurve />
        </motion.div>
      </div>
    </section>
  );
}
