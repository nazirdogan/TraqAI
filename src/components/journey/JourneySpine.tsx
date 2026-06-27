'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * JourneySpine
 *
 * A full-height "guided spine" down the LEFT edge of the page. The purple
 * frontier sits at the vertical centre of the viewport, so as you scroll the
 * line visibly fills top -> bottom and each stage node fills solid the moment
 * its section reaches the middle of the screen.
 *
 *  - pale always-on track + purple fill (scaleY = frontier)
 *  - a dot riding the frontier
 *  - stage nodes MEASURED from real sections (by id); each is a hollow ring that
 *    fills SOLID purple once the frontier passes it
 *  - aria-hidden + pointer-events-none, in the left margin (never covers content)
 *  - prefers-reduced-motion: full purple rail + all nodes solid, no tracking
 */

type Stage = { id: string; label: string };

const STAGES: Stage[] = [
  { id: 'problem', label: 'The problem' },
  { id: 'services', label: 'How we help' },
  { id: 'how-we-work', label: 'How we work' },
  { id: 'impact', label: 'The impact' },
  { id: 'contact', label: "Let's talk" },
];

type MeasuredNode = { label: string; f: number };

export default function JourneySpine() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const geom = useRef({ top: 0, height: 1 });
  const [nodes, setNodes] = useState<MeasuredNode[]>([]);
  const [frontier, setFrontier] = useState(reduce ? 1 : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      if (reduce) {
        setFrontier(1);
        return;
      }
      const { top, height } = geom.current;
      const center = window.scrollY + window.innerHeight / 2;
      setFrontier(Math.min(Math.max((center - top) / height, 0), 1));
    };

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const height = el.offsetHeight || 1;
      geom.current = { top, height };
      const measured: MeasuredNode[] = [];
      for (const s of STAGES) {
        const sec = document.getElementById(s.id);
        if (!sec) continue;
        const r = sec.getBoundingClientRect();
        const nodeTop = r.top + window.scrollY - top + Math.min(r.height * 0.16, 88);
        measured.push({ label: s.label, f: nodeTop / height });
      }
      setNodes(measured);
      update();
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    STAGES.forEach((s) => {
      const sec = document.getElementById(s.id);
      if (sec) ro.observe(sec);
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, [reduce]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
      ref={ref}
      aria-hidden="true"
    >
      {/* Rail column pinned to the left margin (clear of px-5 content padding). */}
      <div className="absolute inset-y-0 left-3 w-[2px] sm:left-5 lg:left-8 2xl:left-10">
        <div className="absolute inset-0 rounded-full bg-[#E3DCFA]" />
        <div
          className="absolute inset-0 origin-top rounded-full bg-traq-purple"
          style={{ transform: `scaleY(${frontier})` }}
        />

        {!reduce && (
          <span
            className="absolute left-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-traq-purple shadow-[0_0_0_5px_rgba(91,63,228,0.12)]"
            style={{ top: `${frontier * 100}%` }}
          />
        )}

        {nodes.map((n) => {
          const active = reduce || frontier >= n.f;
          return (
            <span
              key={n.label}
              className="absolute left-1/2 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-traq-purple transition-colors duration-300"
              style={{ top: `${n.f * 100}%`, backgroundColor: active ? '#5B3FE4' : '#FFFFFF' }}
            />
          );
        })}
      </div>

      {/* Stage labels, shown only at 2xl where the centred content leaves a clear
          gutter, so they never sit over content. */}
      <div className="absolute inset-0 hidden 2xl:block">
        {nodes.map((n) => {
          const active = reduce || frontier >= n.f;
          return (
            <span
              key={n.label}
              className={
                'absolute left-[52px] -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ' +
                (active ? 'text-traq-purple-ink' : 'text-ink-faint')
              }
              style={{ top: `${n.f * 100}%` }}
            >
              {n.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
