import Link from 'next/link';
import FadeUp from '@/components/ui/FadeUp';
import { ArrowRight } from 'lucide-react';

export default function CTABanner() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeUp>
          <div className="relative overflow-hidden rounded-3xl border border-traq-light/25 bg-bg-card p-10 sm:p-14 lg:p-16">
            <div
              className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[120%] -translate-x-1/2 rounded-full bg-traq-purple/35 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-40 right-0 h-80 w-96 rounded-full bg-traq-light/25 blur-3xl"
              aria-hidden="true"
            />
            <div className="grid-overlay" aria-hidden="true" />

            <div className="relative max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-traq-light">
                The window is now
              </p>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Your competitors are already using AI.{' '}
                <span className="text-gradient">Are you?</span>
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                Book a free call and we&rsquo;ll give you a plain-language overview of exactly
                where AI fits into your business — and, just as importantly, where it doesn&rsquo;t.
                No pitch. No obligation.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/#contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-traq-purple px-6 py-3.5 text-sm font-medium text-white shadow-glow transition-all hover:bg-traq-light hover:shadow-glow-strong active:scale-[0.98]"
                >
                  Book a Free Call
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/#services"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border-strong bg-white/[0.02] px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/[0.06] hover:border-traq-light"
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
