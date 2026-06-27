'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { BENEFITS } from '@/lib/constants';

const ease = [0.22, 1, 0.36, 1] as const;

export default function WhyUs() {
  const reduce = useReducedMotion();
  const card = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="about" className="relative bg-bg-subtle px-5 py-16 sm:px-8 sm:py-28 md:py-32">
      <div className="mx-auto grid max-w-7xl items-start gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="text-left">
          <div className="eyebrow">Why Traq</div>
          <h2 className="section-title mt-4">
            We don&rsquo;t hand you a deck. We get your team doing the work.
          </h2>
          <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
            <div className="chip">
              <span className="chip-dot" />
              Done with you
            </div>
            <div className="chip">Capability that stays</div>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.1 }}
          className="grid gap-3 sm:grid-cols-2 sm:gap-4"
        >
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              variants={card}
              transition={{ duration: 0.5, ease }}
              className="rounded-[18px] border border-border-subtle bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-cardHover sm:rounded-[20px] sm:p-6"
            >
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-traq-purple sm:mb-3.5">
                {`0${i + 1} / Principle`}
              </div>
              <h3 className="m-0 mb-2 text-base font-semibold leading-tight tracking-tight text-ink sm:mb-2.5 sm:text-[17px]">
                {b.title}
              </h3>
              <p className="m-0 text-[13px] leading-relaxed text-ink-soft">{b.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
