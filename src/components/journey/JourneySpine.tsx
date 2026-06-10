'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

/**
 * JourneySpine
 *
 * A decorative, scroll-driven "guided spine" that runs full-height down the
 * LEFT edge of the page and narrates the journey: it draws on as you scroll,
 * with a node lighting up at each named stage (The problem -> How we help ->
 * How we work -> Proof -> Let's talk).
 *
 * Robustness:
 *  - The rail is a 2px column: a pale always-on track plus a purple fill that
 *    scaleY's from 0..1 with scroll progress (scale-independent, no SVG dash
 *    math), and a dot riding the frontier.
 *  - Node Y positions are MEASURED from the real stage sections (by id) relative
 *    to the wrapper, recomputed on resize, so they always sit at their section
 *    regardless of dynamic content height.
 *  - The layer is aria-hidden + pointer-events-none and lives in the left margin
 *    (clear of the centred max-w content), so it never covers or blocks content.
 *  - prefers-reduced-motion: full purple rail + all nodes solid, no draw, no dot.
 *
 * Mounted as the first child of a `relative` wrapper that spans the whole page;
 * `useScroll({ target })` on this overlay (which fills the wrapper) maps scroll
 * to the page.
 */

type Stage = { id: string; label: string };

const STAGES: Stage[] = [
  { id: 'problem', label: 'The problem' },
  { id: 'services', label: 'How we help' },
  { id: 'how-we-work', label: 'How we work' },
  { id: 'proof', label: 'Proof' },
  { id: 'contact', label: "Let's talk" },
];

type MeasuredNode = { label: string; top: number; f: number };

export default function JourneySpine() {
  const reduce = useReducedMotion();
  const motionOn = !reduce;
  const ref = useRef<HTMLDivElement>(null);

  const [nodes, setNodes] = useState<MeasuredNode[]>([]);
  const [p, setP] = useState(reduce ? 1 : 0);

  // Measure each stage section's offset within the wrapper, and recompute on
  // resize / content height changes.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const elTop = el.getBoundingClientRect().top;
      const height = el.offsetHeight || 1;
      const measured: MeasuredNode[] = [];
      for (const s of STAGES) {
        const sec = document.getElementById(s.id);
        if (!sec) continue;
        const r = sec.getBoundingClientRect();
        // Sit the node a little way into the section, not exactly on its edge.
        const top = r.top - elTop + Math.min(r.height * 0.16, 88);
        measured.push({ label: s.label, top, f: top / height });
      }
      setNodes(measured);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    STAGES.forEach((s) => {
      const sec = document.getElementById(s.id);
      if (sec) ro.observe(sec);
    });
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Scroll progress across the whole wrapper (this overlay fills it).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  useMotionValueEvent(progress, 'change', (v) => setP(v));

  const dotTop = useTransform(progress, [0, 1], ['0%', '100%']);

  return (
    <div className="pointer-events-none absolute inset-0 z-20" ref={ref} aria-hidden="true">
      {/* The rail column, pinned to the left margin. 2px wide; nodes/dot centre
          on it. Sits left of the px-5 content padding so it never touches text. */}
      <div className="absolute inset-y-0 left-3 w-[2px] sm:left-5 lg:left-8 2xl:left-10">
        {/* Pale always-on track. */}
        <div className="absolute inset-0 rounded-full bg-[#E3DCFA]" />

        {/* Purple fill: scaleY with scroll (or full under reduced motion). */}
        {motionOn ? (
          <motion.div
            className="absolute inset-0 origin-top rounded-full bg-traq-purple"
            style={{ scaleY: progress }}
          />
        ) : (
          <div className="absolute inset-0 rounded-full bg-traq-purple" />
        )}

        {/* Travelling frontier dot. */}
        {motionOn && (
          <motion.span
            className="absolute left-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-traq-purple shadow-[0_0_0_4px_rgba(91,63,228,0.12)]"
            style={{ top: dotTop }}
          />
        )}

        {/* Stage nodes (measured to their sections). */}
        {nodes.map((n) => {
          const active = !motionOn || p >= n.f - 0.001;
          return (
            <span
              key={n.label}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ top: n.top }}
            >
              <span className="relative block h-[15px] w-[15px] rounded-full border-[1.5px] border-traq-purple bg-white">
                <motion.span
                  className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-traq-purple"
                  initial={false}
                  animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.4 }}
                  transition={{ duration: 0.25 }}
                />
              </span>
            </span>
          );
        })}
      </div>

      {/* Stage labels, shown only at 2xl where the centred content (max-w-7xl)
          leaves a clear left gutter — so a label can never sit over content.
          Below 2xl it's the line + nodes only (collision-free at 375/768/1280). */}
      <div className="absolute inset-0 hidden 2xl:block">
        {nodes.map((n) => {
          const active = !motionOn || p >= n.f - 0.001;
          return (
            <span
              key={n.label}
              className={
                'absolute left-[52px] -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ' +
                (active ? 'text-traq-purple-ink' : 'text-ink-faint')
              }
              style={{ top: n.top }}
            >
              {n.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
