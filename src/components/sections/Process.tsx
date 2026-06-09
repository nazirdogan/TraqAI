'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { FRAMEWORK_NAME, PROCESS_STEPS } from '@/lib/constants';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Process() {
  const reduce = useReducedMotion();
  const step = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="how-we-work"
      className="relative bg-bg-subtle px-5 py-20 sm:px-8 sm:py-28 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-16">
          <div className="eyebrow">How we work</div>
          <h2 className="section-title mt-4">{FRAMEWORK_NAME}</h2>
          <p className="section-sub mx-auto">
            A 90-day, time-boxed engagement with concrete deliverables. You see real progress in
            weeks, and your team owns the result.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.12 }}
          className="relative mt-10 grid gap-8 sm:mt-14 sm:gap-10 md:mt-20 md:grid-cols-2 md:gap-8 lg:grid-cols-4"
        >
          <div className="process-rail" aria-hidden="true" />
          {PROCESS_STEPS.map((s) => (
            <motion.div
              key={s.number}
              variants={step}
              transition={{ duration: 0.5, ease }}
              className="relative z-[1] text-center md:text-left"
            >
              <div className="process-node mx-auto md:mx-0">{s.number}</div>
              <h3 className="m-0 mb-2 text-base font-semibold leading-tight tracking-tight text-ink sm:text-[18px]">
                {s.title}
              </h3>
              <p className="m-0 text-[13px] leading-relaxed text-ink-soft [text-wrap:pretty] sm:text-[14px]">
                {s.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
