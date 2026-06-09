'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { OFFER_NOTE, OFFER_TIERS } from '@/lib/constants';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Offers() {
  const reduce = useReducedMotion();
  const card = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="ways-to-work" className="relative px-5 py-20 sm:px-8 sm:py-28 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-16">
          <div className="eyebrow">Ways to work with us</div>
          <h2 className="section-title mt-4">Three ways to start</h2>
          <p className="section-sub mx-auto">
            Pick the level of support that fits where your team is right now. Pricing comes on a
            call, once we know what you actually need.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.1 }}
          className="grid auto-rows-fr gap-4 sm:gap-5 lg:grid-cols-3"
        >
          {OFFER_TIERS.map((tier) => (
            <motion.div
              key={tier.name}
              variants={card}
              transition={{ duration: 0.5, ease }}
              className="flex flex-col rounded-[20px] border border-border-subtle bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-cardHover sm:rounded-[24px] sm:p-8"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-traq-purple">
                {tier.who}
              </div>
              <h3 className="mt-3 text-[20px] font-semibold leading-tight tracking-tight text-ink sm:text-[22px]">
                {tier.name}
              </h3>
              <ul className="mt-5 flex list-none flex-col gap-3 p-0">
                {tier.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[13px] leading-snug text-ink-soft sm:text-[14px]"
                  >
                    <span className="mt-[7px] block h-[5px] w-[5px] flex-none rounded-full bg-traq-purple" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/book"
                className="mt-7 inline-flex w-fit items-center gap-1.5 text-[14px] font-semibold text-traq-purple transition-colors hover:text-traq-purple-ink"
              >
                Book a call for pricing
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-[15px] leading-relaxed text-ink-soft sm:mt-12 sm:text-base">
          {OFFER_NOTE}
        </p>
      </div>
    </section>
  );
}
