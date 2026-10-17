/**
 * "The Person They Keep": every fact the /keep page, the thanks page, the
 * calendar file and the share card repeat. A change is one edit here.
 *
 * Only SESSION_START_ISO carries a time. The UK and US Eastern times on the
 * page are computed from it through Intl, never typed in, so the clocks going
 * back in the UK on Sun 25 Oct (the day after) cannot make them wrong.
 */

export const KEEP_PATH = '/keep';
export const SESSION_TITLE = 'The Person They Keep';
export const SESSION_SUBHEAD =
  'A 2-hour live session on using AI at work, so you become the person your team relies on when everything is changing.';

// 21:00 Dubai is 18:00 in the UK (still on BST that Saturday) and 13:00 US Eastern.
export const SESSION_START_ISO = '2026-10-24T21:00:00+04:00';
export const SESSION_DURATION_MIN = 120;
export const PRICE_LABEL = '£19';

/** Inlined at build time, so a change on Vercel needs a redeploy. */
export const STRIPE_PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? '';

// TODO(Naz): confirm the handle for the "session has finished" line.
export const INSTAGRAM_HANDLE = 'traqcollective';

// TODO(Naz): the free work brief template. The thanks page hides the link
// while this is null.
export const TEMPLATE_URL: string | null = null;

// TODO(Naz): set to '/keep/naz.jpg' once the photo is in public/keep/. While
// null the host section shows a neutral placeholder of the same size.
export const HOST_PHOTO: string | null = null;

/** The date as the copy writes it. Kept verbatim with the eyebrow. */
export const DATE_LABEL = 'Saturday 24 October';

export function sessionEndMs(): number {
  return Date.parse(SESSION_START_ISO) + SESSION_DURATION_MIN * 60_000;
}

export function sessionFinished(now: Date = new Date()): boolean {
  return now.getTime() >= sessionEndMs();
}

const ZONES = [
  { tz: 'Asia/Dubai', label: 'Dubai' },
  { tz: 'Europe/London', label: 'UK' },
  { tz: 'America/New_York', label: 'US Eastern' },
] as const;

function fmt(timeZone: string, opts: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone, ...opts }).format(new Date(SESSION_START_ISO));
}

/**
 * "13:00 Dubai · 10:00 UK · 05:00 US Eastern".
 *
 * A zone whose calendar date differs from Dubai's gets its weekday appended,
 * so an early Dubai start never reads as Saturday in New York when it is
 * still Friday night there.
 */
export function timeTriple(): string {
  const dubaiDay = fmt('Asia/Dubai', { weekday: 'short' });
  return ZONES.map(({ tz, label }) => {
    const time = fmt(tz, { hour: '2-digit', minute: '2-digit', hour12: false });
    const day = fmt(tz, { weekday: 'short' });
    return `${time}${day === dubaiDay ? '' : ` (${day})`} ${label}`;
  }).join(' · ');
}

/** Escape a value for an iCalendar text field (RFC 5545 section 3.3.11). */
function icsText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function icsStamp(ms: number): string {
  return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function sessionIcs(): string {
  const start = Date.parse(SESSION_START_ISO);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Traq Collective//The Person They Keep//EN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:keep-${icsStamp(start)}@traqcollective.com`,
    `DTSTAMP:${icsStamp(Date.now())}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(sessionEndMs())}`,
    `SUMMARY:${icsText(SESSION_TITLE)}`,
    `LOCATION:${icsText('Online (Zoom link by email)')}`,
    `DESCRIPTION:${icsText('Your Zoom link arrives by email before Saturday.')}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Starting in 30 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
