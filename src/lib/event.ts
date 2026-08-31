/**
 * The 2027 AI Plan session: one place to change the facts.
 *
 * The date, the time, the seat count and the deposit appear across the landing
 * page, the application page, the deposit page, the prep form and the metadata.
 * They live here so a change to any of them is one edit rather than a search,
 * and so the number of confirmed seats shown to the public can never drift from
 * the number Nazir is actually working with.
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
  /** The hard cap. The room is never confirmed past this. */
  capacity: number;
  /**
   * Seats confirmed so far.
   *
   * This number is shown publicly, so it must be true. The playbook is explicit
   * that scarcity here is real and never fabricated: update it as seats are
   * actually confirmed, and leave it at 0 until the first one is. At 0 the page
   * shows the cap alone rather than "0 of 20", which is honest and reads better
   * than an empty room.
   */
  seatsConfirmed: number;
  /** Whether the form is still taking applications. */
  applicationsOpen: boolean;
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
  capacity: 20,
  seatsConfirmed: 0,
  applicationsOpen: true,
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

/**
 * How the seat count is described in public.
 *
 * Before the first confirmation there is nothing true and useful to say beyond
 * the cap, so it says only that. After it, the real count does the work.
 */
export function seatsLine(e: AiPlanEvent = AI_PLAN_EVENT): string {
  if (e.seatsConfirmed <= 0) return `${e.capacity} seats`;
  return `${e.capacity} seats, ${e.seatsConfirmed} confirmed`;
}

export function seatsRemaining(e: AiPlanEvent = AI_PLAN_EVENT): number {
  return Math.max(0, e.capacity - e.seatsConfirmed);
}
