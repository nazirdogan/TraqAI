/**
 * Who gets a seat at the 2027 AI Plan session.
 *
 * The session ends with a decision: which workflow to change first and which
 * to leave alone. That decision belongs to whoever owns the operation, so the
 * room is kept to the people who can make it. This module is the whole rule.
 * It has no imports on purpose, so it can be read in one screen, tested with
 * nothing but Node, and changed in one place if the rule changes.
 *
 * The rule is applied server-side, in the intake route, after the form has
 * been submitted. Nothing in the browser decides anything.
 */

/** The pills on the form, most senior first. The label is the stored value. */
export const POSITIONS = [
  'Founder, owner or partner',
  'CEO, MD, GM or C-suite',
  'Director or head of a function',
  'Manager or team lead',
  'Specialist or individual contributor',
  'I work at an AI vendor, agency or consultancy',
] as const;

export type Position = (typeof POSITIONS)[number];

/**
 * Two decline reasons rather than one, because the person is told a different
 * thing in each case: a manager is asked to pass the page to whoever owns the
 * decision, a competitor is told plainly that the room is not for our own line
 * of work.
 */
export type SeatOutcome = 'approved' | 'declined_not_leadership' | 'declined_competitor';

const APPROVED: ReadonlySet<Position> = new Set<Position>([
  'Founder, owner or partner',
  'CEO, MD, GM or C-suite',
  'Director or head of a function',
]);

const COMPETITOR: Position = 'I work at an AI vendor, agency or consultancy';

export function decideSeat(position: Position): SeatOutcome {
  if (APPROVED.has(position)) return 'approved';
  if (position === COMPETITOR) return 'declined_competitor';
  return 'declined_not_leadership';
}

export function isApproved(outcome: SeatOutcome): boolean {
  return outcome === 'approved';
}
