'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CASE_STUDIES } from '@/lib/constants';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Proof() {
  const reduce = useReducedMotion();
  const card = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="proof" className="relative px-5 py-20 sm:px-8 sm:py-28 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-16">
          <div className="eyebrow">Proof</div>
          <h2 className="section-title mt-4">Real results, from real engagements.</h2>
        </div>

        {/* Flat before/after cards. Structured so named testimonials + logos
            can drop in later without a redesign. */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.1 }}
          className="grid auto-rows-fr gap-4 sm:gap-5 lg:grid-cols-3"
        >
          {CASE_STUDIES.map((c) => (
            <motion.div
              key={c.label}
              variants={card}
              transition={{ duration: 0.5, ease }}
              className="flex flex-col rounded-[20px] border border-border-subtle bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-cardHover sm:rounded-[24px] sm:p-8"
            >
              <div className="impact-value">{c.metric}</div>
              <div className="mt-2 text-[15px] font-semibold tracking-tight text-ink sm:mt-3 sm:text-base">
                {c.label}
              </div>
              <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-traq-purple">
                {c.who}
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-soft [text-wrap:pretty]">
                {c.story}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-10 text-center text-[13px] text-ink-faint sm:mt-12">
          Client names withheld on request.
        </p>
      </div>
    </section>
  );
}
