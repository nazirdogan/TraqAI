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
          {PROBLEMS.map((p) => (
            <motion.div
              key={p.line}
              variants={card}
              transition={{ duration: 0.5, ease }}
              className="rounded-[20px] border border-border-subtle bg-white p-6 shadow-card sm:p-7"
            >
              <p className="m-0 text-[15px] leading-relaxed text-ink sm:text-base">{p.line}</p>
            </motion.div>
          ))}
        </motion.div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-[15px] leading-relaxed text-ink-soft sm:mt-12 sm:text-base">
          If any of these sound like you, you&rsquo;re in the right place. Here&rsquo;s how we help.
        </p>
      </div>
    </section>
  );
}
