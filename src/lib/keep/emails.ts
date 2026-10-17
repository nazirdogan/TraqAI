/**
 * The four emails for The Person They Keep, as HTML plus a plain-text twin.
 *
 * Every time comes from lib/keep-session.ts; nothing converted is typed here.
 * No images, no tracking pixels, no rewritten links: plain HTML with inline
 * styles so it reads the same in Gmail, Outlook and Apple Mail.
 */
import { SESSION_TITLE, ZOOM_EMAIL_ISO, dubaiDay, sessionIcs, timeList } from '@/lib/keep-session';

export type KeepEmailKind = 'confirm' | 'zoom' | 'reminder' | 'replay';

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
  attachments?: { filename: string; content: string; contentType: string }[];
};

const BRIEF_URL = 'https://traqcollective.com/keep/brief';
const BG = '#E3E6DE';
const INK = '#18191B';
const ACCENT = '#6B3ECF';

// ---------------------------------------------------------------------------
// A tiny block model, so each email is written once and rendered twice.
// ---------------------------------------------------------------------------

type Block =
  | { p: string } // paragraph; may contain {link} placeholders filled by `links`
  | { button: string; href: string }
  | { sign: string[] };

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Paragraph text with bare URLs turned into links. */
function linkify(s: string): string {
  return esc(s).replace(/https?:\/\/[^\s<]+[^\s<.,;:)]/g, (url) => `<a href="${url}" style="color:${ACCENT};font-weight:600;word-break:break-all;">${url}</a>`);
}

function render(subject: string, blocks: Block[]): Omit<RenderedEmail, 'attachments'> {
  const htmlBlocks = blocks
    .map((b) => {
      if ('p' in b) return `<p style="margin:0 0 16px 0;">${linkify(b.p)}</p>`;
      if ('button' in b)
        return `<p style="margin:4px 0 20px 0;"><a href="${esc(b.href)}" style="display:inline-block;background:${ACCENT};color:#FFFFFF;text-decoration:none;font-weight:600;padding:13px 24px;border-radius:999px;">${esc(b.button)}</a></p>`;
      return `<p style="margin:8px 0 0 0;">${b.sign.map(esc).join('<br>')}</p>`;
    })
    .join('\n');

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${BG};">
<div style="background:${BG};padding:24px 12px;">
<div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:14px;padding:28px 24px;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:${INK};">
${htmlBlocks}
</div>
</div>
</body>
</html>`;

  const text = blocks
    .map((b) => {
      if ('p' in b) return b.p;
      if ('button' in b) return `${b.button}: ${b.href}`;
      return b.sign.join('\n');
    })
    .join('\n\n');

  return { subject, html, text: `${text}\n` };
}

// ---------------------------------------------------------------------------
// The emails
// ---------------------------------------------------------------------------

const WHEN = () => `${dubaiDay()}, ${timeList()}. Two hours.`;

/**
 * Email 1. `zoomUrl` is passed only when the late-buyer rule applies (they paid
 * after the Zoom email went out); it then replaces the "arrives on" line.
 */
export function confirmEmail(firstName: string, zoomUrl: string | null): RenderedEmail {
  const subject = `You're in: ${SESSION_TITLE}, ${dubaiDay(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}`;
  const where = zoomUrl
    ? `Where: Zoom. Join here: ${zoomUrl}`
    : `Where: Zoom. Your link arrives by email on ${dubaiDay(ZOOM_EMAIL_ISO)}.`;
  const body = render(subject, [
    { p: `Hi ${firstName},` },
    { p: `You're booked for ${SESSION_TITLE}, a 2-hour live session on using AI at work.` },
    { p: `When: ${WHEN()}` },
    { p: where },
    {
      p: "Before Saturday, do one thing: pick one real task from your work week that takes too long, like a report, a weekly summary or an email you dread. We'll build your work brief on it live. Use practice material or work that isn't confidential.",
    },
    { p: `While you wait, here's the template we'll use: ${BRIEF_URL}` },
    { p: "Can't make it live? Everyone who booked gets the replay." },
    { p: 'The calendar invite is attached.' },
    { sign: ['Naz', 'Traq Collective'] },
  ]);
  return {
    ...body,
    attachments: [
      {
        filename: 'the-person-they-keep.ics',
        content: Buffer.from(sessionIcs('Zoom (link by email)'), 'utf8').toString('base64'),
        contentType: 'text/calendar; charset=utf-8; method=PUBLISH',
      },
    ],
  };
}

/** Email 2: the Zoom link, two days before. */
export function zoomEmail(firstName: string, zoomUrl: string): RenderedEmail {
  return render('Your Zoom link for Saturday', [
    { p: `Hi ${firstName},` },
    { p: `Here's your link for ${SESSION_TITLE}:` },
    { button: 'Join on Zoom', href: zoomUrl },
    { p: zoomUrl },
    { p: WHEN() },
    { p: 'Bring two things: one real work task, and any AI assistant you already use, free or from work, open in another tab.' },
    { p: "Please don't share the link. It's for people who booked." },
    { sign: ['See you Saturday,', 'Naz'] },
  ]);
}

/** Email 3: an hour before. */
export function reminderEmail(firstName: string, zoomUrl: string): RenderedEmail {
  return render('We start in an hour', [
    { p: `Hi ${firstName},` },
    { p: `${SESSION_TITLE} starts in an hour: ${timeList()}.` },
    { p: `Join here: ${zoomUrl}` },
    { p: 'Have your task and your AI assistant ready. The room opens 10 minutes early.' },
    { sign: ['Naz'] },
  ]);
}

/** Email 4: the replay. The Skool line appears only when skool_url is set. */
export function replayEmail(firstName: string, replayUrl: string, skoolUrl: string | null): RenderedEmail {
  const blocks: Block[] = [
    { p: `Hi ${firstName},` },
    { p: `Thanks for booking. Here's the replay: ${replayUrl}` },
    { p: `The work brief template: ${BRIEF_URL}` },
    {
      p: 'One thing to do this week: run the brief on your task, check every number, then write your before-and-after in two lines: how long it took before, and how long it takes now.',
    },
  ];
  if (skoolUrl) blocks.push({ p: `If you want to keep going, there's a weekly live call in The AI Operator: ${skoolUrl}` });
  blocks.push({ sign: ['Naz'] });
  return render(`Your replay: ${SESSION_TITLE}`, blocks);
}
