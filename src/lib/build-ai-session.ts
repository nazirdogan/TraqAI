/**
 * "Build AI into Your Business Yourself": every fact the /build-ai page, the
 * thanks page and the calendar file repeat. A change is one edit here.
 *
 * Only SESSION_START_ISO carries a time. The US times on the page are computed
 * from it through Intl, never typed in. 29 October is before US clocks go back
 * (1 November), so 7pm Eastern is -04:00.
 */

export const BUILD_AI_PATH = '/build-ai';
export const SESSION_TITLE = 'Build AI into Your Business Yourself';
export const SESSION_SUBHEAD =
  'A 2-hour live session for business owners. Learn what AI actually is, find where your time and money go, then build AI into that one problem with us, live.';

export const SESSION_START_ISO = '2026-10-29T19:00:00-04:00';
export const SESSION_DURATION_MIN = 120;
export const PRICE_LABEL = '$99';
export const PRICE_VALUE = 99;

/**
 * Live Payment Link on the Traq Collective Stripe account (plink_1UUZFlEaIvjLvSftmyKGxew9,
 * product prod_VVaQpA0N7aP0ok). After payment Stripe redirects to
 * /build-ai/thanks?session_id=... A public URL, so it lives here, not in env.
 */
export const STRIPE_PAYMENT_LINK = 'https://book.stripe.com/fZu14n5xb1wY9j12XYfUQ0C';

/** The date as the copy writes it, in Eastern time. */
export const DATE_LABEL = 'Thursday, October 29';

const LOCATION = 'Online (joining link by email)';

export function sessionEndMs(): number {
  return Date.parse(SESSION_START_ISO) + SESSION_DURATION_MIN * 60_000;
}

export function sessionFinished(now: Date = new Date()): boolean {
  return now.getTime() >= sessionEndMs();
}

const US_ZONES = [
  { tz: 'America/New_York', label: 'ET' },
  { tz: 'America/Chicago', label: 'CT' },
  { tz: 'America/Denver', label: 'MT' },
  { tz: 'America/Los_Angeles', label: 'PT' },
] as const;

/** "7pm" or "7:30pm" in the given zone. */
function clockIn(timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(
    new Date(SESSION_START_ISO),
  );
  const hour = parts.find((p) => p.type === 'hour')?.value ?? '';
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';
  const ampm = (parts.find((p) => p.type === 'dayPeriod')?.value ?? '').toLowerCase();
  return `${hour}${minute === '00' ? '' : `:${minute}`}${ampm}`;
}

/** "7pm ET · 6pm CT · 5pm MT · 4pm PT". */
export function usTimes(): string {
  return US_ZONES.map(({ tz, label }) => `${clockIn(tz)} ${label}`).join(' · ');
}

function icsStamp(ms: number): string {
  return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Escape a value for an iCalendar text field (RFC 5545 section 3.3.11). */
function icsText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

const CALENDAR_DETAILS =
  'Live with Traq Collective. Have a free ChatGPT or Claude account open in another tab. Your joining link arrives by email before the session.';

/** Google Calendar "add event" link. Times are UTC, so it lands right in any zone. */
export function googleCalendarUrl(): string {
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: 'TEMPLATE',
    text: SESSION_TITLE,
    dates: `${icsStamp(Date.parse(SESSION_START_ISO))}/${icsStamp(sessionEndMs())}`,
    details: CALENDAR_DETAILS,
    location: LOCATION,
  })}`;
}

export function sessionIcs(): string {
  const start = Date.parse(SESSION_START_ISO);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Traq Collective//Build AI into Your Business Yourself//EN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:build-ai-${icsStamp(start)}@traqcollective.com`,
    `DTSTAMP:${icsStamp(Date.now())}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(sessionEndMs())}`,
    `SUMMARY:${icsText(SESSION_TITLE)}`,
    `LOCATION:${icsText(LOCATION)}`,
    `DESCRIPTION:${icsText(CALENDAR_DETAILS)}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Starting in 30 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
