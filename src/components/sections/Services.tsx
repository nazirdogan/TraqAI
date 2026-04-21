'use client';

import { useEffect, useRef } from 'react';
import { SERVICES } from '@/lib/constants';

export default function Services() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = rootRef.current?.querySelectorAll<HTMLDivElement>('.service-card') ?? [];
    const handlers: Array<{ el: HTMLDivElement; fn: (e: MouseEvent) => void }> = [];

    cards.forEach((card) => {
      const fn = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      };
      card.addEventListener('mousemove', fn);
      handlers.push({ el: card, fn });
    });

    return () => {
      handlers.forEach(({ el, fn }) => el.removeEventListener('mousemove', fn));
    };
  }, []);

  return (
    <section id="services" className="relative px-5 py-28 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="eyebrow">What we do</div>
          <h2 className="section-title mt-4">
            Six capabilities. <span className="text-gradient">One accountable team.</span>
          </h2>
          <p className="section-sub mx-auto">
            We cover the full path from AI strategy to the production systems your team uses every day.
          </p>
        </div>

        <div ref={rootRef} className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={s.slug} id={s.slug} className="service-card">
              <div className="service-icon">{s.icon}</div>
              <h3 className="m-0 text-[22px] font-semibold leading-tight tracking-tight text-white">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-white/60 [text-wrap:pretty]">
                {s.tagline}
              </p>
              <ul className="mt-5 flex list-none flex-col gap-2 p-0">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[13px] leading-snug text-white/75">
                    <span className="mt-[7px] block h-[5px] w-[5px] flex-none rounded-full bg-traq-light" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
