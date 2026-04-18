'use client';

import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { GooeyFilter } from '@/components/ui/gooey-filter';
import { PixelTrail } from '@/components/ui/pixel-trail';
import { useScreenSize } from '@/hooks/use-screen-size';

export default function GooeyLandingPage() {
  const screenSize = useScreenSize();

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#FAFAFA] text-center text-pretty">
      <GooeyFilter id="gooey-filter-pixel-trail" strength={5} />

      <div
        className="absolute inset-0 z-0"
        style={{ filter: 'url(#gooey-filter-pixel-trail)' }}
      >
        <PixelTrail
          pixelSize={screenSize.lessThan('md') ? 24 : 32}
          fadeDuration={0}
          delay={500}
          pixelClassName="bg-traq-purple"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 flex flex-col items-center gap-8 pointer-events-none">
        <span className="pointer-events-auto rounded-full border border-slate-900/15 bg-white/70 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-slate-700">
          Move your cursor
        </span>

        <h1 className="text-slate-900 text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[1.02] tracking-tight max-w-4xl">
          We wire AI into how your business{' '}
          <em className="not-italic text-traq-purple">actually works.</em>
        </h1>

        <p className="max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed">
          Traq Collective merges AI integration, automation, data intelligence and digital
          presence into one delivery team. Gulf-native, shipped in weeks.
        </p>

        <div className="pointer-events-auto mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-traq-purple px-6 py-3.5 text-sm font-medium text-white shadow-glow transition-all hover:bg-traq-light hover:shadow-glow-strong"
          >
            Book a Free Call
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-900/20 bg-white/80 backdrop-blur px-6 py-3.5 text-sm font-medium text-slate-900 transition-all hover:bg-white hover:border-traq-purple"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-[11px] uppercase tracking-[0.3em] text-slate-500 font-mono">
        traq · motion experiment · gooey pixel trail
      </p>
    </div>
  );
}
