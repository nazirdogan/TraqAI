'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

const ease = [0.22, 1, 0.36, 1] as const;

const LINES = ["1. What's an agent?", '2. How to prompt Claude', '3. Wire it into your work'];

/**
 * The one animated "open notebook" on the site (home → How we work).
 * Handwritten lines write themselves on as it scrolls into view, with a
 * checkmark drawing in on the last line. Respects reduced motion (renders
 * fully written, no animation). The calm static cousin is HeroDoodle.
 */
export default function NotebookDoodle() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const show = reduce ? true : inView;

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-sm">
      {/* spiral binding */}
      <div className="absolute -top-2.5 left-7 right-7 flex justify-between" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="h-5 w-1.5 rounded-full bg-traq-purple/25" />
        ))}
      </div>

      <div className="paper-grid relative overflow-hidden rounded-[24px] border border-border-subtle bg-white p-6 pt-7 shadow-card sm:p-7 sm:pt-8">
        {/* header */}
        <div className="relative inline-block">
          <span className="font-hand text-[22px] font-semibold text-traq-purple">field notes</span>
          <motion.svg
            viewBox="0 0 120 10"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute -bottom-1.5 left-0 h-2 w-[110px] text-traq-purple/70"
          >
            <motion.path
              d="M2 6.5c20-2.6 42-3 64-1.4 16 1 31 .2 52-2.1"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={show ? { pathLength: 1 } : undefined}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
            />
          </motion.svg>
        </div>

        {/* written lines */}
        <ul className="mt-6 space-y-4">
          {LINES.map((line, i) => {
            const last = i === LINES.length - 1;
            return (
              <li key={line} className="border-b border-dashed border-border-subtle pb-4 last:border-0 last:pb-0">
                <motion.span
                  className="flex items-center gap-2.5"
                  initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -8 }}
                  animate={show ? { opacity: 1, x: 0 } : undefined}
                  transition={{ duration: 0.45, ease, delay: 0.3 + i * 0.35 }}
                >
                  {last ? (
                    <motion.svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="h-5 w-5 flex-none text-traq-purple"
                    >
                      <motion.path
                        d="m4 12.5 5 5L20 6"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: reduce ? 1 : 0 }}
                        animate={show ? { pathLength: 1 } : undefined}
                        transition={{ duration: 0.5, ease, delay: 0.3 + LINES.length * 0.35 }}
                      />
                    </motion.svg>
                  ) : (
                    <span className="h-2 w-2 flex-none rounded-full bg-traq-purple/50" aria-hidden="true" />
                  )}
                  <span className="font-hand text-[21px] leading-snug text-ink">{line}</span>
                </motion.span>
              </li>
            );
          })}
        </ul>

        {/* tiny doodle pencil */}
        <span className="pointer-events-none absolute bottom-4 right-5 font-hand text-[15px] text-traq-purple/60" aria-hidden="true">
          ✎ that&rsquo;s the plan
        </span>
      </div>
    </div>
  );
}
