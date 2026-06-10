'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Founder() {
  const reduce = useReducedMotion();
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <section id="founder" className="relative bg-bg-subtle px-5 py-20 sm:px-8 sm:py-28 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease }}
        className="mx-auto grid max-w-5xl items-center gap-8 sm:gap-10 lg:grid-cols-[280px_1fr] lg:gap-16"
      >
        {/* Founder photo at /nazir.jpg, with a graceful initials fallback if it
            ever fails to load. */}
        <div
          data-asset="founder-photo"
          className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[24px] border border-border-subtle bg-white shadow-card"
        >
          <div className="relative aspect-[4/5] w-full">
            {photoOk ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/nazir.jpg"
                alt="Nazir, founder of Traq Collective"
                className="h-full w-full object-cover"
                onError={() => setPhotoOk(false)}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-traq-tint">
                <span className="text-[44px] font-semibold tracking-tight text-traq-purple">N</span>
                <span className="mt-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-faint">
                  Photo coming soon
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Credibility line: first person, ICP-targeted.
            ASSET DEPENDENCY (spec section 12): a couple of real credibility facts to expand this. */}
        <div data-asset="founder-bio" className="text-left">
          <div className="eyebrow">Meet Nazir</div>
          <p className="mt-5 text-[20px] font-medium leading-snug tracking-tight text-ink sm:text-[26px] sm:leading-snug">
            Hi, I&rsquo;m Nazir. I build AI systems and train teams to use them every day, including a
            full autonomous operation I run end to end. When you work with Traq, you work with me, not
            a junior analyst.
          </p>
          <Link
            href="/#how-we-work"
            className="mt-7 inline-flex w-fit items-center gap-1.5 text-[14px] font-semibold text-traq-purple transition-colors hover:text-traq-purple-ink"
          >
            More about how we work
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
