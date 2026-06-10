'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { SERVICES } from '@/lib/constants';
import ServiceIcon from '@/components/ui/ServiceIcon';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Services() {
  const reduce = useReducedMotion();
  const card = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="services" className="relative px-5 py-20 sm:px-8 sm:py-28 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-16">
          <h2 className="section-title">Here&rsquo;s how we solve that</h2>
          <p className="section-sub mx-auto">
            Four ways we put AI to work with you: hands-on training, consulting and strategy,
            implementation, and agentic systems, all built around how your business actually works.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.1 }}
          className="grid auto-rows-fr gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
        >
          {SERVICES.map((s) => (
            <motion.div
              key={s.slug}
              id={s.slug}
              variants={card}
              transition={{ duration: 0.5, ease }}
              className="service-card"
            >
              <div className="service-icon">
                <ServiceIcon slug={s.slug} />
              </div>
              <h3 className="m-0 text-[20px] font-semibold leading-tight tracking-tight text-ink sm:text-[22px]">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-ink-soft [text-wrap:pretty]">
                {s.tagline}
              </p>
              <ul className="mt-5 flex list-none flex-col gap-2 p-0">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2.5 text-[13px] leading-snug text-ink-soft"
                  >
                    <span className="mt-[7px] block h-[5px] w-[5px] flex-none rounded-full bg-traq-purple" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-[15px] leading-relaxed text-ink-soft sm:mt-12 sm:text-base">
          And when something needs building, we build it with you, not in a black box.
        </p>
      </div>
    </section>
  );
}
