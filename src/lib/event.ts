/**
 * The 2027 AI Plan session: one place to change the facts.
 *
 * The date, the time, the cap and the deposit appear across the landing page,
 * the sign-up page, the deposit page, the prep form and the metadata. They live
 * here so a change to any of them is one edit rather than a search.
 *
 * The number of seats taken is deliberately not here. It is read live from
 * Stripe (lib/seats.ts), because a constant that has to be raised by hand as
 * deposits clear is a constant that will be wrong.
 *
 * See docs/2026-08-31-ai-plan-session-setup.md for the operating runbook.
 */

export type AiPlanEvent = {
  name: string;
  /** ISO date, local to Dubai. */
  date: string;
  /** 24h local start and end, Gulf Standard Time. */
  startTime: string;
  endTime: string;
  city: string;
  /**
   * What the public page says about the venue. The exact address goes out to
   * confirmed attendees only, which is both normal for a capped session and one
   * more reason a seat has to be confirmed rather than just turned up to.
   */
  venueNote: string;
  /**
   * The hard cap. The room is never confirmed past this. Set the same number
   * as the Payment Link's payment limit in Stripe, which is what makes it hard.
   */
  capacity: number;
  /**
   * Whether the sign-up form is open. Flip it off to close the room by hand;
   * it also closes on its own once the seats taken in Stripe reach capacity.
   */
  signUpOpen: boolean;
  /** The refundable hold that secures a confirmed seat, in dirhams. */
  depositAed: number;
  /** How much notice releases a seat with the deposit returned. */
  cancellationNoticeHours: number;
};

export const AI_PLAN_EVENT: AiPlanEvent = {
  name: 'The 2027 AI Plan',
  date: '2026-09-29',
  startTime: '14:00',
  endTime: '16:00',
  city: 'Dubai',
  venueNote:
    'A private boardroom in Dubai. The exact address goes out to confirmed attendees the week before.',
  capacity: 15,
  signUpOpen: true,
  depositAed: 100,
  cancellationNoticeHours: 48,
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** "Tuesday 29 September 2026". Built from the ISO date so the two cannot disagree. */
export function eventDateLong(e: AiPlanEvent = AI_PLAN_EVENT): string {
  const [y, m, d] = e.date.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DAYS[dt.getUTCDay()]} ${d} ${MONTHS[m - 1]} ${y}`;
}

/** "29 September". For the tighter spots. */
export function eventDateShort(e: AiPlanEvent = AI_PLAN_EVENT): string {
  const [, m, d] = e.date.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

/** "2.00pm to 4.00pm". */
export function eventTimeRange(e: AiPlanEvent = AI_PLAN_EVENT): string {
  return `${clockLabel(e.startTime)} to ${clockLabel(e.endTime)}`;
}

function clockLabel(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}.00${suffix}` : `${hour}.${String(m).padStart(2, '0')}${suffix}`;
}

/** ISO 8601 with the Gulf offset, for the Event schema. */
export function eventIsoStart(e: AiPlanEvent = AI_PLAN_EVENT): string {
  return `${e.date}T${e.startTime}:00+04:00`;
}

export function eventIsoEnd(e: AiPlanEvent = AI_PLAN_EVENT): string {
  return `${e.date}T${e.endTime}:00+04:00`;
}
