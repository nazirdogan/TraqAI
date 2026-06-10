'use client';

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

/**
 * JourneySpine
 *
 * A decorative, scroll-driven "guided spine" that overlays the journey wrapper
 * (Problem -> Services -> Process). It threads a gently serpentine vertical
 * path down the left gutter (desktop) / thin left rail (mobile):
 *
 *  - a pale base path (#E3DCFA) that is always fully drawn
 *  - a solid purple progress path (#5B3FE4) revealed via stroke-dashoffset tied
 *    to the wrapper's scroll progress
 *  - a small travelling dot at the progress frontier
 *  - three section nodes (Problem / What we do / How we work) sitting in the
 *    vertical whitespace gaps between sections; each fills solid once passed
 *
 * The layer is purely decorative (aria-hidden), overlays the empty left gutter
 * (clear of the centred max-w content columns) and never receives pointer
 * events, so it can never cover a heading, card or body copy nor block a click.
 *
 * The SVG draws only the two stretched paths (preserveAspectRatio="none" with a
 * non-scaling stroke keeps the line crisp at any height). The nodes and the
 * travelling dot are HTML circles positioned by percentage, so they stay
 * perfectly round regardless of the viewBox stretch.
 *
 * prefers-reduced-motion: the progress path renders fully drawn and all nodes
 * solid, with no scroll animation and no travelling dot.
 */

// viewBox space. Narrow on purpose: the spine lives in the left gutter, so the
// whole drawing occupies the leftmost slice of the wrapper.
const VB_W = 120;
const VB_H = 1000;

// The serpentine centre-line of the rail: a cubic path that gently weaves
// within the narrow gutter. The weave is subtle so it reads as considered.
const SPINE_D =
  'M 60 0 ' +
  'C 78 110, 30 200, 52 300 ' +
  'C 70 388, 36 470, 58 560 ' +
  'C 76 644, 40 730, 60 820 ' +
  'C 74 892, 52 952, 60 1000';

// Precomputed total length for this exact `d` (sampled offline; no runtime
// getTotalLength read needed). Used for the dash reveal.
const SPINE_LEN = 1005;

// Arc-length lookup table for this exact `d`: 21 points evenly spaced along the
// path, as [x%, y%] of the viewBox. Lets the travelling dot ride the line
// precisely (an HTML element positioned by %), no runtime path sampling.
const SPINE_SAMPLES: ReadonlyArray<readonly [number, number]> = [
  [50, 0],
  [53.43, 5],
  [51.24, 10.02],
  [45.87, 15],
  [40.45, 19.98],
  [38.49, 24.99],
  [43.29, 29.97],
  [47.81, 34.96],
  [46.52, 39.98],
  [43.26, 44.99],
  [42.02, 50.01],
  [46.47, 55],
  [52.42, 59.96],
  [51.43, 64.98],
  [47.57, 69.98],
  [44.86, 74.99],
  [47.02, 80],
  [53.3, 84.97],
  [53.16, 89.99],
  [49.5, 94.99],
  [50, 100],
];

// Node anchors along the path, placed in the whitespace GAPS between sections.
// `t` is the 0..1 position along the journey; (cx, cy) sit on the curve at that
// t in viewBox space, so each node reads as anchored to the spine.
type SpineNode = {
  label: string;
  t: number;
  cx: number;
  cy: number;
};

const NODES: SpineNode[] = [
  // Top of the Problem section.
  { label: 'The problem', t: 0.04, cx: 64, cy: 40 },
  // In the gap between Problem and Services.
  { label: 'What we do', t: 0.42, cx: 54, cy: 420 },
  // In the gap between Services and the How-we-work roadmap.
  { label: 'How we work', t: 0.78, cx: 54, cy: 780 },
];

export default function JourneySpine() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Track scroll across the whole journey wrapper: ~0 when its top nears the
  // bottom of the viewport, ~1 when its bottom leaves the top.
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start 0.85', 'end 0.35'],
  });

  // Smooth the raw progress so the draw feels eased, not jittery.
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Reveal the purple path by shrinking the dash offset from full length to 0.
  const dashOffset = useTransform(progress, [0, 1], [SPINE_LEN, 0]);

  // The travelling dot rides the exact frontier, interpolated from the
  // arc-length sample table so it stays on the line through every weave.
  const dotLeft = useTransform(progress, (p) => `${sampleSpine(clamp01(p))[0]}%`);
  const dotTop = useTransform(progress, (p) => `${sampleSpine(clamp01(p))[1]}%`);

  const motionOn = !reduce;

  return (
    // The spine overlays the journey wrapper. It paints only in the empty left
    // gutter, so it can sit above opaque section backgrounds (z-20) and still
    // never cover content. pointer-events-none guarantees it never blocks a
    // click.
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      {/* Ref target spans the wrapper so scroll progress maps to the whole
          journey. The rail track is pinned to the left and stays narrow. */}
      <div
        ref={wrapperRef}
        className="absolute inset-y-0 left-0 w-[44px] sm:w-[56px] md:w-[64px]"
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          fill="none"
          focusable="false"
        >
          {/* Pale base path: always fully drawn. */}
          <path
            d={SPINE_D}
            stroke="#E3DCFA"
            strokeWidth={2}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Purple progress path. Static + full under reduced motion. */}
          {motionOn ? (
            <motion.path
              d={SPINE_D}
              stroke="#5B3FE4"
              strokeWidth={2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              strokeDasharray={SPINE_LEN}
              style={{ strokeDashoffset: dashOffset }}
            />
          ) : (
            <path
              d={SPINE_D}
              stroke="#5B3FE4"
              strokeWidth={2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {/* Travelling frontier dot (motion only). HTML element so it stays a
            perfect circle despite the viewBox stretch. */}
        {motionOn && (
          <motion.span
            className="absolute h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-traq-purple"
            style={{ top: dotTop, left: dotLeft }}
          />
        )}

        {/* Section nodes: white fill + purple ring, in the whitespace gaps.
            HTML so they render as perfect circles. */}
        {NODES.map((node) =>
          motionOn ? (
            <SpineNodeMarker key={node.label} node={node} progress={progress} />
          ) : (
            <span
              key={node.label}
              className="absolute h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-traq-purple bg-traq-purple"
              style={{
                top: `${(node.cy / VB_H) * 100}%`,
                left: `${(node.cx / VB_W) * 100}%`,
              }}
            />
          )
        )}
      </div>

      {/* Node labels in the left gutter. Shown only at 2xl (>=1536px), where
          even the widest content column (max-w-7xl) leaves ~128px of clear
          gutter, so a label can never sit on a heading, button or body copy.
          Below 2xl the spine is line + nodes only, keeping every layout
          (375 / 768 / 1280) collision-free. */}
      <div className="absolute inset-0 hidden 2xl:block">
        {NODES.map((node) => (
          <span
            key={node.label}
            className="absolute left-[58px] -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-faint"
            style={{ top: `${(node.cy / VB_H) * 100}%` }}
          >
            {node.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * A single section node. White-filled with a purple ring while ahead of the
 * scroll frontier; its solid purple centre fades in once the frontier passes.
 */
function SpineNodeMarker({
  node,
  progress,
}: {
  node: SpineNode;
  progress: ReturnType<typeof useSpring>;
}) {
  // 0 before the frontier reaches the node, 1 just after (a short crossfade).
  const innerOpacity = useTransform(
    progress,
    [node.t - 0.03, node.t + 0.03],
    [0, 1]
  );

  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        top: `${(node.cy / VB_H) * 100}%`,
        left: `${(node.cx / VB_W) * 100}%`,
      }}
    >
      {/* Outer ring + white core (the "purple circle with white middle"). */}
      <span className="relative block h-[15px] w-[15px] rounded-full border-[1.5px] border-traq-purple bg-white">
        {/* Solid purple centre fades in once passed. */}
        <motion.span
          className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-traq-purple"
          style={{ opacity: innerOpacity }}
        />
      </span>
    </span>
  );
}

function clamp01(v: number) {
  return Math.min(Math.max(v, 0), 1);
}

// Linearly interpolate the arc-length table to get the on-line [x%, y%] at a
// given progress t (0..1).
function sampleSpine(t: number): [number, number] {
  const last = SPINE_SAMPLES.length - 1;
  const pos = t * last;
  const i = Math.min(Math.floor(pos), last - 1);
  const f = pos - i;
  const a = SPINE_SAMPLES[i];
  const b = SPINE_SAMPLES[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}
