import type { EmailBlock } from '@/emails/FirstAiAssistantEmail';
import {
  BUILD,
  BUILD_NAME,
  FAA_NAME,
  FAA_PATH,
  FREE_SESSION_MINUTES,
  addMinutes,
  dayLabelLong,
  googleCalendarUrl,
  timeTriple,
  type FreeSession,
} from '@/lib/first-ai-assistant';
import { SITE_URL } from '@/lib/seo/schema';

export type FaaEmail = {
  key: string;
  subject: string;
  preview: string;
  heading: string;
  blocks: EmailBlock[];
  /** ISO time to send. Omitted means now. */
  sendAt?: string;
};

const BUILD_URL = `${SITE_URL}${FAA_PATH}/build`;

/**
 * Every email a free-session sign-up receives, in order, with the time each one
 * goes (confirm, 24h, 3h, live, after, replay). The route sends the first now and
 * schedules the rest through Resend (up to 30 days ahead), so
 * nothing depends on a cron job or on anyone remembering.
 */
export function freeSessionSequence(s: FreeSession, firstName: string): FaaEmail[] {
  const when = `${dayLabelLong(s.startIso)}, ${timeTriple(s.startIso)}`;
  const endIso = addMinutes(s.startIso, FREE_SESSION_MINUTES);
  const cal = googleCalendarUrl({
    title: `${FAA_NAME} (free live session)`,
    startIso: s.startIso,
    endIso,
    details: `Join on Google Meet: ${s.meetUrl}\n\nHosted by Naz, Traq Collective.`,
    location: s.meetUrl,
  });
  const ics = `${SITE_URL}/api/first-ai-assistant/ics?s=${s.id}`;
  const name = firstName || 'there';
  const replayUrl = `${SITE_URL}${FAA_PATH}/replay?s=${s.id}`;

  return [
    {
      key: 'confirm',
      subject: `You're in: ${FAA_NAME}, ${dayLabelLong(s.startIso)}`,
      preview: `Your seat is saved. Here is the link and how to add it to your calendar.`,
      heading: `${name}, your seat is saved.`,
      blocks: [
        { kind: 'p', text: `${FAA_NAME} is live on ${when}. Sixty minutes, on Google Meet, in plain English.` },
        { kind: 'button', label: 'Add it to my Google Calendar', href: cal },
        { kind: 'link', label: 'Or download the calendar file (Outlook, Apple)', href: ics },
        { kind: 'p', text: `Your join link: ${s.meetUrl}. Join from a laptop if you can, so you can see the screen clearly. The session is recorded for the replay, so keep your camera and microphone off if you prefer; questions go in the chat.` },
        { kind: 'p', text: 'What you will see:' },
        {
          kind: 'list',
          items: [
            'The three jobs AI does brilliantly for you today, and the two it still gets wrong.',
            'A morning briefing like mine, built live, from zero.',
            'How to keep your emails and your data private.',
            'A simple plan for your first seven days.',
            'And the one setting that stops AI writing like a robot.',
          ],
        },
        { kind: 'p', text: 'One small thing before then: reply and tell me the one job you would most like AI to take off your plate. I read every reply, and I will use them in the session.' },
        { kind: 'p', text: 'See you there,\nNaz' },
      ],
    },
    {
      key: 'r24',
      sendAt: addMinutes(s.startIso, -24 * 60),
      subject: `Tomorrow: ${FAA_NAME}`,
      preview: 'Tomorrow, 60 minutes, here is your link.',
      heading: 'See you tomorrow.',
      blocks: [
        { kind: 'p', text: `Quick reminder, ${name}: ${FAA_NAME} is tomorrow, ${when}.` },
        { kind: 'button', label: 'Save the join link', href: s.meetUrl },
        { kind: 'p', text: 'You do not need to install anything or know anything technical. Bring the inbox that drives you mad. That is the whole brief.' },
        { kind: 'p', text: 'Naz' },
      ],
    },
    {
      key: 'r3',
      sendAt: addMinutes(s.startIso, -180),
      subject: `In 3 hours: ${FAA_NAME}`,
      preview: 'Three hours to go.',
      heading: 'Three hours to go.',
      blocks: [
        { kind: 'p', text: `We start at ${timeTriple(s.startIso)}.` },
        { kind: 'button', label: 'Join on Google Meet', href: s.meetUrl },
        { kind: 'p', text: 'Stay to the end: the last ten minutes are the setting that makes AI write like you, not like a robot.' },
        { kind: 'p', text: 'Naz' },
      ],
    },
    {
      key: 'live',
      sendAt: addMinutes(s.startIso, -5),
      subject: 'We go live in 5 minutes',
      preview: 'Click to join.',
      heading: 'Starting in 5 minutes.',
      blocks: [
        { kind: 'button', label: 'Join now', href: s.meetUrl },
        { kind: 'small', text: `If the button does not work: ${s.meetUrl}` },
      ],
    },
    {
      key: 'after',
      sendAt: addMinutes(s.startIso, 90),
      subject: 'What we built (and your next step)',
      preview: 'The recap, the replay, and the live build on Saturday.',
      heading: `Thank you, ${name}.`,
      blocks: [
        { kind: 'p', text: 'Whether you made it tonight or not, here is where things stand. The replay reaches you within 24 hours.' },
        { kind: 'p', text: `If you want your own assistant set up, properly and with me, that is what ${BUILD_NAME} is for. Three hours online on ${dayLabelLong(BUILD.startIso)}, ${timeTriple(BUILD.startIso)}. Fifteen seats, so I can help everyone.` },
        {
          kind: 'list',
          items: [
            'You connect Claude to your own email and calendar, step by step.',
            'You leave with a morning briefing, reply drafts in your voice, meeting prep and an evening close-out.',
            'You get the setup files, the replay, a 14-day support group and two group office hours.',
          ],
        },
        { kind: 'button', label: 'Save my seat at the launch price', href: BUILD_URL },
        { kind: 'small', text: 'The launch price ends on Friday at 23:59 Dubai time. You will need Claude Pro (about $20 a month, paid to Anthropic) and Gmail or Google Workspace. Microsoft 365 works if your IT admin approves the connection.' },
        { kind: 'p', text: 'Naz' },
      ],
    },
    {
      key: 'replay',
      sendAt: addMinutes(s.startIso, 22 * 60),
      subject: 'Your replay is up (48 hours)',
      preview: 'The full session, plus the one setting most people skip.',
      heading: 'The replay is up.',
      blocks: [
        { kind: 'p', text: `Here is the full recording of ${FAA_NAME}. It stays up for 48 hours.` },
        { kind: 'button', label: 'Watch the replay', href: replayUrl },
        { kind: 'p', text: 'If you only watch one part, watch the end: the voice setting is what makes the drafts sound like you instead of a robot.' },
        { kind: 'p', text: `And if you would rather have it set up on your own inbox, with me, that is ${BUILD_NAME} on ${dayLabelLong(BUILD.startIso)}. Fifteen seats.` },
        { kind: 'link', label: 'See the live build', href: BUILD_URL },
        { kind: 'p', text: 'Naz' },
      ],
    },
  ];
}

/** Sent to everyone once, the morning the launch price ends. */
export function lastCallEmail(firstName: string): FaaEmail {
  const name = firstName || 'there';
  return {
    key: 'lastcall',
    sendAt: '2026-10-23T06:00:00Z',
    subject: 'Launch price ends tonight',
    preview: 'Saturday, three hours, your own assistant set up with me.',
    heading: `${name}, last call for the launch price.`,
    blocks: [
      { kind: 'p', text: `${BUILD_NAME} is tomorrow, ${timeTriple(BUILD.startIso)}. The launch price ends tonight at 23:59 Dubai time.` },
      { kind: 'p', text: 'Fifteen seats in total, so everyone leaves with it working.' },
      { kind: 'button', label: 'See the build and save a seat', href: BUILD_URL },
      { kind: 'p', text: 'Naz' },
    ],
  };
}

/** The internal heads-up to Naz. */
export function notifyBody(r: { name: string; email: string; country: string; role: string; emailType: string; whatsapp?: string; session: FreeSession }): { subject: string; text: string } {
  return {
    subject: `New sign-up: ${r.name} (${r.country}), ${dayLabelLong(r.session.startIso)}`,
    text: [
      `Name: ${r.name}`,
      `Email: ${r.email}`,
      `WhatsApp: ${r.whatsapp || '-'}`,
      `Country: ${r.country}`,
      `Role: ${r.role}`,
      `Email they use: ${r.emailType}`,
      `Session: ${dayLabelLong(r.session.startIso)}, ${timeTriple(r.session.startIso)}`,
    ].join('\n'),
  };
}
