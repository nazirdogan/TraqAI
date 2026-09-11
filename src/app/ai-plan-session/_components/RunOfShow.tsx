'use client';

import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

export type ShowRow = { time: string; title: string; body: string };

/**
 * The two hours, drawn as the timeline they are.
 *
 * A vertical rule runs down between the times and the content and draws in
 * from the top as the section enters view; each row lights a beat after the
 * line reaches it, with a dot marking where it sits. The line exists because
 * the content is a sequence to the minute, not to decorate the list.
 *
 * Reduced motion shows the finished timeline, line and all, the instant it is
 * in view, with nothing moving (see Reveal.tsx for why it still animates).
 */
export default function RunOfShow({ rows }: { rows: ShowRow[] }) {
  const reduce = useReducedMotion();
  const lineDuration = reduce ? 0 : 1.4;
  // Each row arrives as the line passes it: the line's duration split evenly
  // down the list, plus a small head start so the first row is not waiting.
  const rowDelay = (i: number) => (reduce ? 0 : 0.1 + (lineDuration / rows.length) * i);

  return (
    <motion.ol
      className="relative space-y-0"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: reduce ? '0px' : '-80px 0px' }}
    >
      {/* The rule. Sits in the gap after the time column at both breakpoints. */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-5 left-[62px] top-5 w-px origin-top bg-traq-purple/25 sm:left-[90px]"
        variants={{
          hidden: { scaleY: 0 },
          shown: { scaleY: 1, transition: { duration: lineDuration, ease: 'linear' } },
        }}
      />
      {rows.map((row, i) => (
        <motion.li
          key={row.time}
          className="relative grid grid-cols-[56px_1fr] gap-4 border-b border-border-subtle py-5 last:border-0 sm:grid-cols-[80px_1fr] sm:gap-6 lg:gap-8"
          variants={{
            hidden: { opacity: 0, x: reduce ? 0 : -10 },
            shown: {
              opacity: 1,
              x: 0,
              transition: { duration: reduce ? 0 : 0.5, delay: rowDelay(i), ease: EASE },
            },
          }}
        >
          <span
            aria-hidden="true"
            className="absolute left-[59.5px] top-[27px] h-1.5 w-1.5 rounded-full bg-traq-purple sm:left-[87.5px]"
          />
          <span className="pt-0.5 text-[13px] font-semibold tabular-nums text-traq-purple">
            {row.time}
          </span>
          <div>
            <h3 className="text-[15px] font-semibold leading-snug text-ink">{row.title}</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{row.body}</p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
