import type { EmailBlock } from '@/emails/FirstAiAssistantEmail';
import {
  JOIN_PATH,
  REPLAY_PATH,
  SESSION_START_ISO,
  SESSION_TITLE,
  addMinutes,
  dayIn,
  googleCalendarUrl,
  sessionEndMs,
  timeTriple,
} from '@/lib/keep-session';
import { SITE_URL } from '@/lib/seo/schema';

export type KeepEmail = {
  key: string;
  subject: string;
  preview: string;
  heading: string;
  blocks: EmailBlock[];
  /** ISO time to send. Omitted means now. */
  sendAt?: string;
};

export const KEEP_KICKER = 'Traq Collective · The Person They Keep';

const JOIN = `${SITE_URL}${JOIN_PATH}`;
const REPLAY = `${SITE_URL}${REPLAY_PATH}`;
const ICS = `${SITE_URL}/keep/session.ics`;

const BRING: string[] = [
  'Any AI assistant you already use, free or from work, open in a browser tab.',
  'One real task from your own work that you would like done better. Pick something non-confidential, or use practice material.',
  'A laptop if you can, so you can follow along and build as we go.',
];

/**
 * Every email a buyer gets, in order: the confirmation now, then reminders a
 * day, an hour and five minutes before, and the replay the day after. The
 * confirm route sends the first and schedules the rest through Resend at the
 * moment of purchase, so nothing depends on a cron job.
 *
 * Every join link goes through /keep/join rather than straight to Zoom, so the
 * Zoom link can be set or changed after these are scheduled.
 */
export function buyerSequence(firstName: string): KeepEmail[] {
  const name = firstName || 'there';
  const when = `${dayIn('Asia/Dubai')}, ${timeTriple()}`;
  const cal = googleCalendarUrl(`Join here: ${JOIN}\n\nHosted by Naz, Traq Collective.`);
  const start = SESSION_START_ISO;

  return [
    {
      key: 'confirm',
      subject: `You're in: ${SESSION_TITLE}, ${dayIn('Asia/Dubai')}`,
      preview: 'Your place is booked. Here is how to join and what to bring.',
      heading: `${name}, you're in.`,
      blocks: [
        { kind: 'p', text: `${SESSION_TITLE} is live on Zoom on ${when}. Two hours, and the replay is yours afterwards.` },
        { kind: 'button', label: 'Add it to my Google Calendar', href: cal },
        { kind: 'link', label: 'Or download the calendar file (Outlook, Apple)', href: ICS },
        { kind: 'p', text: `Your join link is ${JOIN}. It opens the Zoom meeting on the day. Keep this email; the reminders will carry the same link.` },
        { kind: 'p', text: 'What to bring:' },
        { kind: 'list', items: BRING },
        { kind: 'p', text: 'One thing before Saturday: reply and tell me the task you are thinking of bringing. I read every reply.' },
        { kind: 'p', text: 'See you there,\nNaz' },
        { kind: 'small', text: 'Your Stripe receipt arrives separately. Tickets are non-refundable; if you cannot make it live, you get the replay.' },
      ],
    },
    {
      key: 'day-before',
      sendAt: addMinutes(start, -24 * 60),
      subject: `Tomorrow: ${SESSION_TITLE}`,
      preview: `${timeTriple()}. Pick your task tonight.`,
      heading: 'Tomorrow, live on Zoom.',
      blocks: [
        { kind: 'p', text: `Hi ${name}, a reminder that ${SESSION_TITLE} is tomorrow: ${when}.` },
        { kind: 'p', text: 'The most useful thing you can do tonight is choose your task. Something you do every week that takes longer than it should is ideal.' },
        { kind: 'list', items: BRING },
        { kind: 'button', label: 'Your join link', href: JOIN },
        { kind: 'p', text: 'See you tomorrow,\nNaz' },
      ],
    },
    {
      key: 'hour-before',
      sendAt: addMinutes(start, -60),
      subject: `Starting in an hour: ${SESSION_TITLE}`,
      preview: 'Open your AI assistant and have your task ready.',
      heading: 'We start in an hour.',
      blocks: [
        { kind: 'p', text: `Hi ${name}, we go live at ${timeTriple()}.` },
        { kind: 'p', text: 'Before you join: open your AI assistant in a tab, and have your task (or practice material) to hand.' },
        { kind: 'button', label: 'Join the session', href: JOIN },
        { kind: 'p', text: 'Naz' },
      ],
    },
    {
      key: 'live',
      sendAt: addMinutes(start, -5),
      subject: `We're live in 5 minutes: ${SESSION_TITLE}`,
      preview: 'Join now.',
      heading: 'Starting now.',
      blocks: [
        { kind: 'button', label: 'Join the session', href: JOIN },
        { kind: 'p', text: 'If the button does not work, paste this into your browser: ' + JOIN },
      ],
    },
    {
      key: 'replay',
      sendAt: new Date(sessionEndMs() + 15 * 60 * 60_000).toISOString(),
      subject: `Your replay: ${SESSION_TITLE}`,
      preview: 'The recording, plus the next step.',
      heading: 'Your replay.',
      blocks: [
        { kind: 'p', text: `Hi ${name}, thank you for booking ${SESSION_TITLE}. The replay is on the page below, whether you came live or not.` },
        { kind: 'button', label: 'Watch the replay', href: REPLAY },
        { kind: 'p', text: 'Do one thing this week: run your work brief on a second task, check it the way we did, and add it to your before-and-after.' },
        { kind: 'p', text: 'Questions? Reply to this email.\nNaz' },
      ],
    },
  ];
}

export function notifyText(d: { name: string; email: string; phone?: string; sessionId: string; scheduled: string[] }): { subject: string; text: string } {
  return {
    subject: `New booking: ${SESSION_TITLE} (${d.name || d.email})`,
    text: [
      d.name || '-',
      d.email,
      d.phone ? `Phone: ${d.phone}` : '',
      `Checkout: ${d.sessionId}`,
      `Emails sent or scheduled: ${d.scheduled.join(', ') || 'none'}`,
    ]
      .filter(Boolean)
      .join('\n'),
  };
}
