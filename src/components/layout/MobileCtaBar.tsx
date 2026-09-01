'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { track } from '@/components/analytics/Analytics';

// Pages where a sticky "Book a free call" bar would be redundant or compete with
// the page's own primary action (the booking page, and the application form for
// the capped AI Plan session, where the bar sits over "Apply for a seat").
const HIDDEN_ON = new Set(['/book', '/ai-plan-session', '/ai-plan-session/apply']);

/**
 * MobileCtaBar
 *
 * A slim, premium-white sticky bar pinned to the bottom of the viewport on
 * mobile/tablet only (lg:hidden). It carries a single primary action — Book a
 * free call — so the main conversion is always one tap away across a long page.
 *
 *  - Hidden while the hero (#top) is on screen, so it never duplicates the hero
 *    CTA on the first screen; fades in once the hero has scrolled out of view.
 *  - On pages without a #top hero it falls back to a simple scroll threshold.
 *  - Respects prefers-reduced-motion (no slide; show/hide only).
 *  - Safe-area aware; the body reserves bottom space so it never covers content.
 */
export default function MobileCtaBar() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = typeof document !== 'undefined' ? document.getElementById('top') : null;

    if (hero && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        ([entry]) => setShow(!entry.isIntersecting),
        { threshold: 0 },
      );
      io.observe(hero);
      return () => io.disconnect();
    }

    // Fallback for pages without a #top hero: reveal after a short scroll.
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (pathname && HIDDEN_ON.has(pathname)) return null;

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
        >
          <div className="border-t border-border-subtle bg-white/90 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(20,20,20,0.07)] backdrop-blur-xl">
            <Link
              href="/book"
              onClick={() => track('cta_book_click', { location: 'mobile_sticky' })}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-traq-purple px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-traq-purple-ink active:scale-[0.99]"
            >
              Book a free call
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
