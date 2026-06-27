'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { IMPACT_METRICS } from '@/lib/constants';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Impact() {
  const reduce = useReducedMotion();
  const card = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="impact" className="relative px-5 py-16 sm:px-8 sm:py-28 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-16">
          <div className="eyebrow">Measured impact</div>
          <h2 className="section-title mt-4">Why this matters.</h2>
          <p className="section-sub mx-auto">
            Industry research on what training and adoption actually do. Our own numbers are in the
            results above.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.08 }}
          className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {IMPACT_METRICS.map((m) => (
            <motion.div
              key={m.label}
              variants={card}
              transition={{ duration: 0.5, ease }}
              className="flex flex-col rounded-[20px] border border-border-subtle bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-cardHover sm:rounded-[24px] sm:p-8"
            >
              <div className="impact-value">{m.value}</div>
              <div className="mt-3 text-base font-semibold tracking-tight text-ink sm:mt-4 sm:text-[17px]">
                {m.label}
              </div>
              <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-ink-soft">
                {m.description}
              </p>
              <a
                href={m.sourceUrl}
                rel="noopener"
                target="_blank"
                className="mt-5 inline-flex w-fit items-center gap-1 text-[12px] font-medium text-ink-faint underline decoration-border-strong underline-offset-2 transition-colors hover:text-traq-purple"
              >
                {m.source}
                <span aria-hidden="true">&nearr;</span>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
