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

// 8pm Dubai is 5pm in the UK (still on BST that Saturday) and 12pm US Eastern.
export const SESSION_START_ISO = '2026-10-24T20:00:00+04:00';
export const SESSION_DURATION_MIN = 120;
export const PRICE_LABEL = '£19';

/** Inlined at build time, so a change on Vercel needs a redeploy. */
export const STRIPE_PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? '';

// TODO(Naz): confirm the handle for the "session has finished" line.
export const INSTAGRAM_HANDLE = 'traqcollective';

// TODO(Naz): the free work brief template. The thanks page hides the link
// while this is null.
export const TEMPLATE_URL: string | null = '/keep/brief';

// TODO(Naz): set to '/keep/naz.jpg' once the photo is in public/keep/. While
// null the host section shows a neutral placeholder of the same size.
export const HOST_PHOTO: string | null = null;

/** The live Payment Link. The confirm route only accepts checkouts from it. */
export const KEEP_PAYMENT_LINK_ID = 'plink_1URHJQEaIvjLvSftQEf43vFh';

/**
 * Soft gate on /keep/join and /keep/replay. Buyers get links carrying it in
 * their emails; it only stops someone guessing the URL from the landing page.
 */
export const ACCESS_KEY = 'k-ceb114db3e';

// TODO(Naz): paste the Zoom meeting link. Emails already sent point at
// /keep/join, which redirects here, so this can be set after people buy.
export const ZOOM_URL: string | null = null;

// The recording, once it is up. /keep/replay links to it; until then that
// page says the replay is on its way.
export const REPLAY_URL: string | null = null;

export const JOIN_PATH = `${KEEP_PATH}/join?k=${ACCESS_KEY}`;
export const REPLAY_PATH = `${KEEP_PATH}/replay?k=${ACCESS_KEY}`;

/** The date as the copy writes it. Kept verbatim with the eyebrow. */
export const DATE_LABEL = 'Saturday 24 October';

export function sessionEndMs(): number {
  return Date.parse(SESSION_START_ISO) + SESSION_DURATION_MIN * 60_000;
}

export function addMinutes(iso: string, minutes: number): string {
  return new Date(Date.parse(iso) + minutes * 60_000).toISOString();
}

/** "Saturday 24 October" for any zone, so a US reader's day is right too. */
export function dayIn(timeZone: string): string {
  return fmt(timeZone, { weekday: 'long', day: 'numeric', month: 'long' });
}

/** Google Calendar "add event" link for the session. */
export function googleCalendarUrl(details: string): string {
  const z = (ms: number) => icsStamp(ms);
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: 'TEMPLATE',
    text: SESSION_TITLE,
    dates: `${z(Date.parse(SESSION_START_ISO))}/${z(sessionEndMs())}`,
    details,
    location: 'Online (Zoom link by email)',
  })}`;
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

/** "8pm" or "8:30pm" in the given zone. */
export function clockIn(timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(
    new Date(SESSION_START_ISO),
  );
  const hour = parts.find((p) => p.type === 'hour')?.value ?? '';
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';
  const ampm = (parts.find((p) => p.type === 'dayPeriod')?.value ?? '').toLowerCase();
  return `${hour}${minute === '00' ? '' : `:${minute}`}${ampm}`;
}

/**
 * "8pm Dubai · 5pm UK · 12pm US Eastern".
 *
 * A zone whose calendar date differs from Dubai's gets its weekday appended,
 * so an early Dubai start never reads as Saturday in New York when it is
 * still Friday night there.
 */
export function timeTriple(): string {
  const dubaiDay = fmt('Asia/Dubai', { weekday: 'short' });
  return ZONES.map(({ tz, label }) => {
    const time = clockIn(tz);
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
