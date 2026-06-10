'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { PROBLEMS } from '@/lib/constants';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Problem() {
  const reduce = useReducedMotion();
  const card = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="problem" className="relative bg-bg-subtle px-5 py-20 sm:px-8 sm:py-28 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="eyebrow">Sound familiar?</div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.1 }}
          className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5"
        >
          {PROBLEMS.map((p, i) => (
            <motion.div
              key={p.problem}
              variants={card}
              transition={{ duration: 0.5, ease }}
              className="flex flex-col rounded-[20px] border border-border-subtle bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-cardHover sm:p-7"
            >
              <span className="text-[13px] font-semibold tracking-[0.1em] text-traq-purple">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="m-0 mt-3 text-[16px] font-semibold leading-snug text-ink [text-wrap:pretty] sm:text-[18px]">
                {p.problem}
              </p>
              <p className="m-0 mt-2 text-[13px] leading-relaxed text-ink-soft [text-wrap:pretty] sm:text-sm">
                {p.cost}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* The pivot: turn the problem list into the setup for the solution. */}
        <div className="mx-auto mt-12 max-w-2xl text-center sm:mt-14">
          <p className="m-0 text-lg font-medium leading-snug text-ink [text-wrap:balance] sm:text-xl">
            You don&rsquo;t need more AI tools. You need someone to make the ones you&rsquo;ve
            got actually work, with your team, not for them.
          </p>
          <p className="m-0 mt-3 text-[15px] leading-relaxed text-ink-soft">
            Here&rsquo;s how we help.
          </p>
        </div>
      </div>
    </section>
  );
}
