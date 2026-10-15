import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import FirstAiAssistantEmail from '@/emails/FirstAiAssistantEmail';
import { checkRate } from '@/lib/intake/ratelimit';
import { clientIp, verifyTurnstile } from '@/lib/intake/turnstile';
import { recordLead } from '@/lib/intake/leadstore';
import { FAA_PATH, sessionById, sessionOpen } from '@/lib/first-ai-assistant';
import { freeSessionSequence, lastCallEmail, notifyBody, type FaaEmail } from '@/lib/first-ai-assistant-emails';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  name: z.string().trim().min(2, 'Add your name').max(80),
  email: z.string().trim().email('Check your email address').max(160),
  whatsapp: z.string().trim().max(30).optional().or(z.literal('')),
  country: z.string().trim().min(2, 'Choose your country').max(60),
  role: z.string().trim().min(2, 'Choose the closest one').max(80),
  emailType: z.string().trim().min(2, 'Choose one').max(60),
  session: z.string().trim().min(2).max(20),
  consent: z.literal(true, { errorMap: () => ({ message: 'Tick this so we can send your link and reminders' }) }),
  click: z
    .object({
      gclid: z.string().max(200).optional(),
      utmSource: z.string().max(200).optional(),
      utmMedium: z.string().max(200).optional(),
      utmCampaign: z.string().max(200).optional(),
      utmContent: z.string().max(200).optional(),
      utmTerm: z.string().max(200).optional(),
      landingPath: z.string().max(300).optional(),
    })
    .optional(),
});

const FROM = 'Naz at Traq Collective <hello@traqcollective.com>';
const NOTIFY = process.env.FAA_NOTIFY_EMAIL ?? 'nazir@traqcollective.com';

/**
 * Free-session sign-up.
 *
 * Saves the person to the lead sheet, emails the confirmation, and schedules
 * every reminder through Resend at sign-up time (24h, 3h, "we're live" 5 min
 * before, the follow-up 90 min after, and the launch-price last call). Nothing
 * depends on a cron job. A reminder whose time has already passed is skipped.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);
  const gate = await checkRate('submit-hour', ip);
  if (!gate.ok) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': String(gate.retryAfterSec) } });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const parsed = schema.safeParse(body.signUp ?? null);
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation_failed', issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  // Turnstile only when the server is configured for it, so a missing secret
  // can never block a real person from signing up.
  if (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(String(body.turnstileToken ?? ''), ip);
    if (!ok) return NextResponse.json({ error: 'turnstile_failed' }, { status: 403 });
  }

  const d = parsed.data;
  const session = sessionById(d.session);
  if (!session || !sessionOpen(session)) {
    return NextResponse.json({ error: 'session_closed' }, { status: 409 });
  }

  const [firstName, ...rest] = d.name.split(/\s+/);

  await recordLead({
    kind: 'first_ai_assistant',
    email: d.email,
    firstName,
    lastName: rest.join(' ') || undefined,
    phone: d.whatsapp || undefined,
    company: d.role,
    band: d.country,
    budget: d.emailType,
    source: `faa-${session.id}`,
    ...(d.click ?? {}),
  });

  const next = `${FAA_PATH}/youre-in?s=${session.id}&n=${encodeURIComponent(firstName)}`;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[faa] dev mode, no Resend. Sign-up:', d.email, session.id);
      return NextResponse.json({ ok: true, dev: true, next });
    }
    // The lead is in the sheet; never strand the person on an error.
    console.error('[faa] RESEND_API_KEY missing in production');
    return NextResponse.json({ ok: true, emailed: false, next });
  }

  const resend = new Resend(key);
  const now = Date.now();
  const emails: FaaEmail[] = [...freeSessionSequence(session, firstName), lastCallEmail(firstName)].filter(
    // Skip anything due in the past or within the next 10 minutes (the "live"
    // nudge for someone signing up mid-session would arrive after the fact).
    (e) => !e.sendAt || Date.parse(e.sendAt) > now + 10 * 60_000,
  );

  const results = await Promise.allSettled(
    emails.map((e) =>
      resend.emails.send({
        from: FROM,
        to: d.email,
        replyTo: 'hello@traqcollective.com',
        subject: e.subject,
        react: FirstAiAssistantEmail({ preview: e.preview, heading: e.heading, blocks: e.blocks }),
        ...(e.sendAt ? { scheduledAt: e.sendAt } : {}),
        tags: [
          { name: 'funnel', value: 'first_ai_assistant' },
          { name: 'step', value: e.key },
        ],
      }),
    ),
  );

  const failed = results
    .map((r, i) => ({ r, key: emails[i].key }))
    .filter(({ r }) => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.error))
    .map(({ r, key }) => ({ key, error: r.status === 'rejected' ? String(r.reason) : JSON.stringify(r.value.error) }));
  if (failed.length) console.error('[faa] some emails failed', failed);

  const n = notifyBody({ name: d.name, email: d.email, country: d.country, role: d.role, emailType: d.emailType, whatsapp: d.whatsapp || undefined, session });
  try {
    await resend.emails.send({ from: FROM, to: NOTIFY, replyTo: d.email, subject: n.subject, text: n.text });
  } catch (err) {
    console.error('[faa] notify failed', err);
  }

  return NextResponse.json({ ok: true, emailed: failed.length === 0, next });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'first-ai-assistant/register' });
}
