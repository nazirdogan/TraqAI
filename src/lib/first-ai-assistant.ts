/**
 * "Your First AI Assistant": one place for every fact the funnel repeats.
 *
 * Dates, Meet links, prices and Stripe Payment Links appear on the landing
 * page, the confirmation page, the build page, the welcome pages, the emails
 * and the calendar files. They live here so a change is one edit.
 *
 * Times are stored in UTC. Dubai is UTC+4 all year; the UK is UTC+1 until the
 * clocks go back on Sun 25 Oct 2026 and UTC+0 after, which the formatters
 * below handle through Intl rather than by hand.
 */

export const FAA_PATH = '/first-ai-assistant';
export const FAA_NAME = 'Your First AI Assistant';
export const BUILD_NAME = 'Build Your AI Assistant, Live';
export const HOST_EMAIL = 'hello@traqcollective.com';
/** Soft gate for the Starter Kit page, shared with buyers by link. */
export const KIT_KEY = 'vip-oct26';
export const SETUP_BOOKING_URL = 'https://calendly.com/nazir-traqcollective/new-meeting';

/** Set to a file in /public (e.g. '/videos/first-ai-assistant.mp4') once the VSL is edited. */
export const VSL_SRC: string | null = null;
export const VSL_POSTER = '/first-ai-assistant/vsl-poster.jpg';

export type FreeSession = {
  id: string;
  /** UTC start. Each session runs 60 minutes. */
  startIso: string;
  meetUrl: string;
  /** VIP-only Q&A straight after, on its own link. */
  vipMeetUrl: string;
};

export const FREE_SESSIONS: FreeSession[] = [
  {
    id: 'mon19',
    startIso: '2026-10-19T18:00:00Z',
    meetUrl: 'https://meet.google.com/eei-eihs-zaw',
    vipMeetUrl: 'https://meet.google.com/mdh-inra-uzx',
  },
  {
    id: 'wed21',
    startIso: '2026-10-21T18:00:00Z',
    meetUrl: 'https://meet.google.com/dev-mqdf-kye',
    vipMeetUrl: 'https://meet.google.com/uav-krrg-gsk',
  },
];

export const FREE_SESSION_MINUTES = 60;
export const VIP_QA_MINUTES = 25;

export const BUILD = {
  startIso: '2026-10-24T13:00:00Z',
  endIso: '2026-10-24T16:00:00Z',
  meetUrl: 'https://meet.google.com/dno-cbgn-aey',
  capacity: 15,
  /** Launch price ends Fri 23 Oct, 23:59 Dubai. */
  launchEndsIso: '2026-10-23T19:59:59Z',
};

export const OFFICE_HOURS = [
  { startIso: '2026-10-25T16:00:00Z', minutes: 60, meetUrl: 'https://meet.google.com/pxb-oson-yqh' },
  { startIso: '2026-10-27T17:00:00Z', minutes: 60, meetUrl: 'https://meet.google.com/rgb-rckg-awr' },
];

// ---------------------------------------------------------------------------
// Replays
// ---------------------------------------------------------------------------

/**
 * Google Drive file ID of each recording. The replay agent sets these the
 * morning after each session (Drive sharing: anyone with the link can view).
 * Null means "not up yet", and the replay page says so.
 */
export const REPLAYS: Record<string, string | null> = {
  mon19: null,
  wed21: null,
  build: null,
};

/** Soft gate for the build replay, shared with build buyers by link. */
export const BUILD_KEY = 'build-oct26';

/** Free replays stay up 48 hours from the replay email (sent 22h after the start). */
export const FREE_REPLAY_HOURS_FROM_START = 22 + 48;
/** VIP Pass holders keep them for 7 days. */
export const VIP_REPLAY_HOURS_FROM_START = 24 * 8;
/** Build buyers keep the build replay until the support window ends. */
export const BUILD_REPLAY_UNTIL_ISO = '2026-11-08T19:59:59Z';

export function replayEmbedUrl(id: string): string {
  return `https://drive.google.com/file/d/${id}/preview`;
}

// ---------------------------------------------------------------------------
// Currency and prices
// ---------------------------------------------------------------------------

export type Currency = 'gbp' | 'usd' | 'aed';

const AED_COUNTRIES = new Set(['AE', 'SA', 'QA', 'KW', 'BH', 'OM']);
const GBP_COUNTRIES = new Set([
  'GB', 'IE', 'IM', 'JE', 'GG', 'GI',
  // Europe is charged in pounds: one price, no euro VAT registration.
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IT', 'LV', 'LT',
  'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'NO', 'CH', 'IS',
]);

export function currencyFor(country: string | null | undefined, override?: string | null): Currency {
  const o = (override ?? '').toLowerCase();
  if (o === 'gbp' || o === 'usd' || o === 'aed') return o;
  const c = (country ?? '').toUpperCase();
  if (AED_COUNTRIES.has(c)) return 'aed';
  if (GBP_COUNTRIES.has(c)) return 'gbp';
  return 'usd';
}

export type Sku = 'vip' | 'build' | 'build_std' | 'build_vip' | 'setup' | 'bundle';

/** Amounts in whole units, for display. */
export const PRICES: Record<Sku, Record<Currency, number>> = {
  vip: { usd: 9, gbp: 7, aed: 33 },
  build: { usd: 99, gbp: 79, aed: 365 },
  build_std: { usd: 125, gbp: 99, aed: 459 },
  build_vip: { usd: 90, gbp: 72, aed: 332 },
  setup: { usd: 749, gbp: 595, aed: 2750 },
  bundle: { usd: 799, gbp: 629, aed: 2900 },
};

export const LINKS: Record<Sku, Record<Currency, string>> = {
  vip: {
    usd: 'https://buy.stripe.com/7sY7sL8JnejKan50PQfUQ0h',
    gbp: 'https://buy.stripe.com/14AaEX7Fj8Zq52L8iifUQ0i',
    aed: 'https://buy.stripe.com/28E6oH4t7ejK2UD1TUfUQ0j',
  },
  build: {
    usd: 'https://book.stripe.com/dRmaEX1gVgrS8eX0PQfUQ0k',
    gbp: 'https://book.stripe.com/14AfZh2kZa3u2UD9mmfUQ0l',
    aed: 'https://book.stripe.com/9B67sLgbPgrS8eXaqqfUQ0m',
  },
  build_std: {
    usd: 'https://book.stripe.com/dRmeVd0cR2B2br9buufUQ0n',
    gbp: 'https://book.stripe.com/3cIaEXf7La3u0Mv566fUQ0o',
    aed: 'https://book.stripe.com/dRm14naRv1wY9j1gOOfUQ0p',
  },
  build_vip: {
    usd: 'https://book.stripe.com/4gM00jcZD3F69j16aafUQ0q',
    gbp: 'https://book.stripe.com/eVqaEX2kZa3ubr9422fUQ0r',
    aed: 'https://book.stripe.com/3cIdR95xbcbCfHpcyyfUQ0s',
  },
  setup: {
    usd: 'https://book.stripe.com/dRmeVdcZD4Ja1QzcyyfUQ0t',
    gbp: 'https://book.stripe.com/bJe00j7Fj6RidzhgOOfUQ0u',
    aed: 'https://book.stripe.com/aFaeVd0cRgrS8eXeGGfUQ0v',
  },
  bundle: {
    usd: 'https://book.stripe.com/28EeVdgbP2B21Qz9mmfUQ0w',
    gbp: 'https://book.stripe.com/bJeaEX0cRfnOan5eGGfUQ0x',
    aed: 'https://book.stripe.com/bJebJ14t72B2dzhdCCfUQ0y',
  },
};

export function money(amount: number, cur: Currency): string {
  if (cur === 'aed') return `AED ${amount.toLocaleString('en-GB')}`;
  const sym = cur === 'gbp' ? '£' : '$';
  return `${sym}${amount.toLocaleString('en-GB')}`;
}

export function price(sku: Sku, cur: Currency): string {
  return money(PRICES[sku][cur], cur);
}

/** True until the launch price ends. */
export function launchPriceOpen(now: Date = new Date()): boolean {
  return now.getTime() <= Date.parse(BUILD.launchEndsIso);
}

/** The build SKU a visitor should be sold right now (launch or standard). */
export function buildSku(now: Date = new Date()): Sku {
  return launchPriceOpen(now) ? 'build' : 'build_std';
}

export function buildIsOver(now: Date = new Date()): boolean {
  return now.getTime() > Date.parse(BUILD.startIso);
}

// ---------------------------------------------------------------------------
// Sessions and time formatting
// ---------------------------------------------------------------------------

export function sessionById(id: string | null | undefined): FreeSession | undefined {
  return FREE_SESSIONS.find((s) => s.id === id);
}

/** A session takes sign-ups until 15 minutes after it starts. */
export function sessionOpen(s: FreeSession, now: Date = new Date()): boolean {
  return now.getTime() < Date.parse(s.startIso) + 15 * 60_000;
}

export function openSessions(now: Date = new Date()): FreeSession[] {
  return FREE_SESSIONS.filter((s) => sessionOpen(s, now));
}

function fmt(iso: string, timeZone: string, opts: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone, ...opts }).format(new Date(iso));
}

/** "Mon 19 Oct" in Dubai. */
export function dayLabel(iso: string): string {
  return fmt(iso, 'Asia/Dubai', { weekday: 'short', day: 'numeric', month: 'short' });
}

/** "Monday 19 October". */
export function dayLabelLong(iso: string): string {
  return fmt(iso, 'Asia/Dubai', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function timeIn(iso: string, timeZone: string): string {
  return fmt(iso, timeZone, { hour: '2-digit', minute: '2-digit', hour12: false });
}

/** "22:00 Dubai · 19:00 UK · 14:00 New York". */
export function timeTriple(iso: string): string {
  return `${timeIn(iso, 'Asia/Dubai')} Dubai · ${timeIn(iso, 'Europe/London')} UK · ${timeIn(iso, 'America/New_York')} New York`;
}

export function addMinutes(iso: string, minutes: number): string {
  return new Date(Date.parse(iso) + minutes * 60_000).toISOString();
}

/** Google Calendar "add event" link. */
export function googleCalendarUrl(opts: { title: string; startIso: string; endIso: string; details: string; location: string }): string {
  const z = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    dates: `${z(opts.startIso)}/${z(opts.endIso)}`,
    details: opts.details,
    location: opts.location,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

// ---------------------------------------------------------------------------
// Proof: published numbers only, each with its source.
// ---------------------------------------------------------------------------

export const PROOF: { stat: string; line: string; source: string; href: string }[] = [
  {
    stat: '26 min',
    line: 'saved per person, per day, when the UK government gave 20,000 civil servants an AI assistant. About 13 working days a year.',
    source: 'GOV.UK Copilot experiment, 2025',
    href: 'https://www.gov.uk/government/publications/microsoft-365-copilot-experiment-cross-government-findings-report/microsoft-365-copilot-experiment-cross-government-findings-report-html',
  },
  {
    stat: '40%',
    line: 'faster on everyday business writing, with quality rated 18% higher, in a controlled study of 453 professionals.',
    source: 'Noy & Zhang, Science, 2023',
    href: 'https://news.mit.edu/2023/study-finds-chatgpt-boosts-worker-productivity-writing-0714',
  },
  {
    stat: '+34%',
    line: 'for the least experienced people, the biggest jump of anyone, in a study of 5,179 support agents. Beginners gain most.',
    source: 'Brynjolfsson, Li & Raymond, NBER',
    href: 'https://www.nber.org/papers/w31161',
  },
  {
    stat: '117',
    line: 'emails a day reach the average worker, who is interrupted roughly every two minutes.',
    source: 'Microsoft Work Trend Index, 2025',
    href: 'https://www.microsoft.com/en-us/worklab/work-trend-index/breaking-down-infinite-workday',
  },
];
