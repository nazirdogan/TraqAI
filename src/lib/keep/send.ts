import { Resend } from 'resend';
import { ZOOM_EMAIL_ISO, reminderFromMs, sessionStartMs } from '@/lib/keep-session';
import { markSent, type Buyer, type SentColumn, type Settings } from '@/lib/keep/db';
import { confirmEmail, reminderEmail, replayEmail, zoomEmail, type KeepEmailKind, type RenderedEmail } from '@/lib/keep/emails';

const FROM = 'Naz at Traq Collective <hello@traqcollective.com>';
const REPLY_TO = 'hello@traqcollective.com';

/** Resend's default limit is 2 requests a second; stay under it. */
export const SEND_GAP_MS = 600;
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * "Now" for the schedule. KEEP_TEST_NOW lets a local test pretend it is
 * Saturday; it is ignored on Vercel (VERCEL=1), so production always uses the
 * real clock.
 */
export function nowMs(): number {
  const fake = process.env.VERCEL ? undefined : process.env.KEEP_TEST_NOW;
  return fake ? Date.parse(fake) : Date.now();
}

/**
 * The late-buyer rule for Email 1: which later emails it stands in for.
 * Paid after the Zoom email time with a Zoom link set: Email 1 carries the
 * link, so Email 2 is marked too. Paid inside the final hour: Email 3 as well.
 */
export function confirmCovers(settings: Settings, now = nowMs()): SentColumn[] {
  if (!settings.zoom_url || now < Date.parse(ZOOM_EMAIL_ISO)) return [];
  const cols: SentColumn[] = ['sent_zoom_at'];
  if (now >= reminderFromMs() && now < sessionStartMs()) cols.push('sent_reminder_at');
  return cols;
}

function build(kind: KeepEmailKind, buyer: Buyer, settings: Settings, now: number): RenderedEmail {
  const name = buyer.first_name || 'there';
  if (kind === 'confirm') return confirmEmail(name, confirmCovers(settings, now).length ? settings.zoom_url : null);
  if (kind === 'zoom') return zoomEmail(name, settings.zoom_url!);
  if (kind === 'reminder') return reminderEmail(name, settings.zoom_url!);
  return replayEmail(name, settings.replay_url!, settings.skool_url);
}

const COLUMN: Record<KeepEmailKind, SentColumn> = {
  confirm: 'sent_confirm_at',
  zoom: 'sent_zoom_at',
  reminder: 'sent_reminder_at',
  replay: 'sent_replay_at',
};

/**
 * Send one email to one buyer and, only once Resend has accepted it, stamp the
 * matching sent_* column (plus any later ones Email 1 stood in for).
 *
 * The Resend idempotency key is per buyer and per email, so two overlapping
 * runs, or a Stripe retry racing the cron, cannot both deliver it. If Resend
 * says that key was already used, the email went out earlier and only the
 * stamp was lost, so it is stamped now rather than sent again.
 */
export async function sendTo(resend: Resend, kind: KeepEmailKind, buyer: Buyer, settings: Settings): Promise<'sent' | 'already' | 'failed'> {
  const now = nowMs();
  const email = build(kind, buyer, settings, now);
  const columns = [COLUMN[kind], ...(kind === 'confirm' ? confirmCovers(settings, now) : [])];

  const { error } = await resend.emails.send(
    {
      from: FROM,
      to: buyer.email,
      replyTo: REPLY_TO,
      subject: email.subject,
      html: email.html,
      text: email.text,
      ...(email.attachments ? { attachments: email.attachments } : {}),
      tags: [
        { name: 'funnel', value: 'keep' },
        { name: 'step', value: kind },
      ],
    },
    { idempotencyKey: `keep-${buyer.stripe_session_id}-${kind}` },
  );

  if (error) {
    const reused = /idempot/i.test(`${error.name ?? ''} ${error.message ?? ''}`);
    if (!reused) {
      console.error(`[keep] ${kind} send failed for buyer ${buyer.id}:`, error.name, error.message);
      return 'failed';
    }
    await markSent(buyer.id, columns);
    return 'already';
  }
  await markSent(buyer.id, columns);
  return 'sent';
}
