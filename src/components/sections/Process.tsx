'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { FRAMEWORK_NAME, PROCESS_STEPS } from '@/lib/constants';

const ease = [0.22, 1, 0.36, 1] as const;

// The roadmap is the spine's "landing": a compact, gently weaving descending
// path with the four milestones as nodes, each label a card offset from its
// dot. Kept tight so it adds no extra scroll. Geometry is expressed in a fixed
// viewBox; nodes alternate left/right of the centre weave.
const ROAD_VB_W = 100;
const ROAD_VB_H = 520;

// A short serpentine that weaves down the centre, crossing x=50 exactly at each
// milestone (the four even row centres at 12.5 / 37.5 / 62.5 / 87.5%) and
// bulging out between them. So the dots, centred per row, sit on the weave.
const ROAD_D =
  'M 50 10 ' +
  'C 66 35, 66 40, 50 65 ' +
  'C 34 100, 34 160, 50 195 ' +
  'C 66 230, 66 290, 50 325 ' +
  'C 34 360, 34 420, 50 455 ' +
  'C 60 480, 56 490, 50 510';

const ROAD_LEN = 517;

// Per-milestone label side + the pale "future" treatment for 90+. The dot sits
// on the weave centre of each row; the card offsets to the alternating side.
type RoadNode = {
  side: 'left' | 'right';
  future?: boolean;
};

const ROAD_NODES: RoadNode[] = [
  { side: 'right' },
  { side: 'left' },
  { side: 'right' },
  { side: 'left', future: true },
];

export default function Process() {
  const reduce = useReducedMotion();

  const heading = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0 },
  };
  const card = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="how-we-work"
      className="relative bg-bg-subtle px-5 py-20 sm:px-8 sm:py-28 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center sm:mb-16">
          <div className="eyebrow">How we work</div>
          <h2 className="section-title mt-4">{FRAMEWORK_NAME}</h2>
          <p className="section-sub mx-auto">
            A 90-day, time-boxed engagement with concrete deliverables. You see real progress in
            weeks, and your team owns the result.
          </p>
        </div>

        {/* The weaving roadmap. The SVG path is the spine continuing down; the
            milestone cards are offset from each dot with a clear gap. */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.14 }}
          className="relative mx-auto mt-8 max-w-3xl sm:mt-12"
        >
          {/* The serpentine path layer, sized to the rows below it so the curve
              threads exactly through every node. Shown from sm+ where the
              two-column weave layout applies; on mobile the cards stack full
              width with an inline node chip, so the weave is hidden. */}
          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
            viewBox={`0 0 ${ROAD_VB_W} ${ROAD_VB_H}`}
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            {/* Pale base. */}
            <path
              d={ROAD_D}
              stroke="#E3DCFA"
              strokeWidth={2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            {/* Solid purple draw-on, revealed once the roadmap scrolls in.
                Static + full under reduced motion. */}
            {reduce ? (
              <path
                d={ROAD_D}
                stroke="#5B3FE4"
                strokeWidth={2}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ) : (
              <motion.path
                d={ROAD_D}
                stroke="#5B3FE4"
                strokeWidth={2}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                strokeDasharray={ROAD_LEN}
                initial={{ strokeDashoffset: ROAD_LEN }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 1.4, ease }}
              />
            )}
          </svg>

          {/* Milestone rows. Each row holds the node (centred on the weave) and
              an offset label card on the alternating side. */}
          <div className="relative">
            {PROCESS_STEPS.map((s, i) => {
              const node = ROAD_NODES[i];
              const cardSide = node.side;
              return (
                <motion.div
                  key={s.number}
                  variants={card}
                  transition={{ duration: 0.5, ease }}
                  className="relative mb-4 grid items-center gap-x-6 last:mb-0 sm:mb-0 sm:min-h-[130px] sm:grid-cols-2"
                >
                  {/* Node dot, centred over the weave. */}
                  <span
                    className="absolute left-1/2 top-1/2 z-[1] hidden -translate-x-1/2 -translate-y-1/2 sm:block"
                    aria-hidden="true"
                  >
                    <RoadDot number={s.number} future={node.future} reduce={!!reduce} />
                  </span>

                  {/* Label card, offset to one side with a clear gap. On mobile
                      the grid collapses to one column so the card stacks
                      cleanly under the (hidden) weave. */}
                  <div
                    className={
                      cardSide === 'left'
                        ? 'sm:col-start-1 sm:pr-10 sm:text-right'
                        : 'sm:col-start-2 sm:pl-10 sm:text-left'
                    }
                  >
                    <div
                      className={
                        'rounded-[18px] border border-border-subtle bg-white p-5 shadow-card sm:p-6 ' +
                        (node.future ? 'border-dashed' : '')
                      }
                    >
                      <div
                        className={
                          'flex items-center gap-2 ' +
                          (cardSide === 'left' ? 'sm:justify-end' : 'sm:justify-start')
                        }
                      >
                        {/* Inline node badge for mobile (where the weave dot is
                            hidden) and as a number chip on desktop. */}
                        <span className="inline-flex sm:hidden">
                          <RoadDot number={s.number} future={node.future} reduce={!!reduce} compact />
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-traq-purple">
                          Day {s.number}
                        </span>
                      </div>
                      <h3 className="m-0 mt-2 text-base font-semibold leading-tight tracking-tight text-ink sm:text-[18px]">
                        {s.title}
                      </h3>
                      <p className="m-0 mt-1.5 text-[13px] leading-relaxed text-ink-soft [text-wrap:pretty] sm:text-[14px]">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * A milestone node: solid purple by default, pale outline for the "90+" future
 * node. White-on-purple number when solid; purple-on-tint when future.
 */
function RoadDot({
  number,
  future,
  reduce,
  compact,
}: {
  number: string;
  future?: boolean;
  reduce: boolean;
  compact?: boolean;
}) {
  const base =
    'flex items-center justify-center rounded-full text-[11px] font-semibold leading-none tracking-[-0.01em] ' +
    (compact ? 'h-9 w-9 sm:h-9 sm:w-9' : 'h-12 w-12 sm:h-14 sm:w-14 sm:text-[13px]');

  if (future) {
    return (
      <motion.span
        initial={reduce ? false : { scale: 0.8, opacity: 0 }}
        whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease }}
        className={base + ' border-[1.5px] border-dashed border-traq-purple bg-traq-tint text-traq-purple-ink'}
      >
        {number}
      </motion.span>
    );
  }

  return (
    <motion.span
      initial={reduce ? false : { scale: 0.8, opacity: 0 }}
      whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, ease }}
      className={base + ' bg-traq-purple text-white'}
    >
      {number}
    </motion.span>
  );
}
