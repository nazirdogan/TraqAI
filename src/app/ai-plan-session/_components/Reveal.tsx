'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * The motion system for the session landing page. Two moments, and only two:
 *
 * - `mode="load"`: the hero's one orchestrated entrance. Runs once, on page
 *   load, with each piece offset by `delay` so the eyebrow, headline, body,
 *   button and facts card arrive in reading order rather than all at once.
 * - `mode="scroll"` (default): a section rises and fades as it enters the
 *   viewport, once. `Group` and `Item` do the same for a set of cards, each a
 *   beat after the last, so a grid reads as a sequence rather than a wall.
 *
 * Reduced motion still runs the same animations, with no offset and no
 * duration, so the finished state simply appears. It is done that way rather
 * than by skipping the motion element, because the server renders the hidden
 * start state inline and React does not repair a style mismatch on hydration:
 * a plain element would stay at opacity 0. Animating to the end, instantly,
 * is what guarantees the content shows.
 *
 * The ease is the site's own, shared with the home page.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.6;

type Tag = 'div' | 'section' | 'ol' | 'ul' | 'li' | 'p' | 'h1' | 'h2';

const TAGS = {
  div: motion.div,
  section: motion.section,
  ol: motion.ol,
  ul: motion.ul,
  li: motion.li,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
} as const;

type RevealProps = {
  children: ReactNode;
  as?: Tag;
  className?: string;
  mode?: 'load' | 'scroll';
  /** Seconds before this piece starts. */
  delay?: number;
  /** Where it rises from, in pixels. */
  y?: number;
  /** Where it slides from horizontally, for the one card that arrives from the side. */
  x?: number;
};

export function Reveal({
  children,
  as = 'div',
  className,
  mode = 'scroll',
  delay = 0,
  y = 22,
  x = 0,
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as];

  const hidden = { opacity: 0, y: reduce ? 0 : y, x: reduce ? 0 : x };
  const shown = { opacity: 1, y: 0, x: 0 };
  const transition = reduce ? { duration: 0 } : { duration: DURATION, delay, ease: EASE };

  if (mode === 'load') {
    return (
      <Tag className={className} initial={hidden} animate={shown} transition={transition}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: reduce ? '0px' : '-80px 0px' }}
      transition={transition}
    >
      {children}
    </Tag>
  );
}

/**
 * A set of things that arrive one after another. The group carries the
 * viewport trigger; each `Item` inherits the variant names from it, so an
 * item never needs its own trigger and cannot fire out of step with its
 * siblings.
 */
const GROUP: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const GROUP_STILL: Variants = { hidden: {}, shown: {} };

const ITEM: Variants = {
  hidden: { opacity: 0, y: 22 },
  shown: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
};
const ITEM_STILL: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0 } },
};

export function Group({
  children,
  as = 'div',
  className,
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as];
  return (
    <Tag
      className={className}
      variants={reduce ? GROUP_STILL : GROUP}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: reduce ? '0px' : '-60px 0px' }}
    >
      {children}
    </Tag>
  );
}

export function Item({
  children,
  as = 'div',
  className,
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as];
  return (
    <Tag className={className} variants={reduce ? ITEM_STILL : ITEM}>
      {children}
    </Tag>
  );
}
