'use client';

import { useEffect, useState } from 'react';
import { PRICE_LABEL, STRIPE_PAYMENT_LINK } from '@/lib/keep-session';

/**
 * Mobile-only booking bar. Slides up once the hero has scrolled away and
 * gets out of the way again while the final call to action is on screen, so
 * the same button is never shown twice at once.
 *
 * It is fixed and moved with a transform, so showing it never shifts the page.
 */
export default function StickyBar({ heroId, finalId }: { heroId: string; finalId: string }) {
  const [heroVisible, setHeroVisible] = useState(true);
  const [finalVisible, setFinalVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    const final = document.getElementById(finalId);
    if (!hero || !final || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setHeroVisible(e.isIntersecting);
        if (e.target === final) setFinalVisible(e.isIntersecting);
      }
    });
    io.observe(hero);
    io.observe(final);
    return () => io.disconnect();
  }, [heroId, finalId]);

  const shown = !heroVisible && !finalVisible;

  return (
    <div
      aria-hidden={!shown}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-white/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 motion-reduce:transition-none lg:hidden ${
        shown ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <div className="leading-tight">
          <div className="text-[20px] font-semibold text-ink">{PRICE_LABEL}</div>
          <div className="text-[13px] text-ink-faint">Replay included</div>
        </div>
        <a
          href={STRIPE_PAYMENT_LINK || '#'}
          tabIndex={shown ? 0 : -1}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-traq-purple px-6 text-[15px] font-semibold text-white transition-colors hover:bg-traq-purple-ink"
        >
          Book your place
        </a>
      </div>
    </div>
  );
}
