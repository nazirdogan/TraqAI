'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Who is actually in the room. For a cold, first-time-meeting-us audience,
 * this needs to land early rather than wait until the bottom of the page —
 * see the "how you get one" section for the fuller procedural version of the
 * same facts (I read applications myself, the cap is real).
 */
export default function HostCredibility() {
  const reduce = useReducedMotion();
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10 xl:px-16">
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease }}
        className="mx-auto grid max-w-6xl items-center gap-8 sm:gap-10 lg:grid-cols-[240px_1fr] lg:gap-14"
      >
        <div className="mx-auto w-full max-w-[220px] overflow-hidden rounded-[24px] border border-border-subtle bg-white shadow-card lg:mx-0">
          <div className="relative aspect-[4/5] w-full">
            {photoOk ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/nazir-session.jpg"
                alt="Nazir, founder of Traq Collective"
                className="h-full w-full object-cover"
                onError={() => setPhotoOk(false)}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-traq-tint">
                <span className="text-[36px] font-semibold tracking-tight text-traq-purple">N</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="eyebrow eyebrow-accent">Who&rsquo;s running it</div>
          <p className="mt-4 text-[19px] font-medium leading-snug tracking-tight text-ink sm:text-[23px]">
            You&rsquo;ll be working with me, not a facilitator hired for the day.
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">
            {"I'm Nazir, and I built Traq Collective on doing this work myself rather than handing it off. I read every application for this session personally, and I'm the one moving table to table while you score your own workflow. That's the real reason it's capped at twenty: past that, I can't give every table the same two hours."}
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-traq-purple transition-colors hover:text-traq-purple-ink"
          >
            More about Traq Collective
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
