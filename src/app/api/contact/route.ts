import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkRate } from '@/lib/intake/ratelimit';
import { clientIp } from '@/lib/intake/turnstile';
import { recordLead } from '@/lib/intake/leadstore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/contact: the "Send us a note" form on the rebuilt /book page
 * (public/rebuild/book.html, a static page, so it posts plain JSON).
 *
 * Public by design: anyone on the site can send a note, so there is no login.
 * It is guarded instead by a hidden honeypot field, length limits, the shared
 * submit rate limit, and by only ever emailing our own inbox, never the
 * sender, so it cannot be used to send mail to other people.
 *
 * The lead is written to the lead sheet as a 'quick' lead, the same kind as
 * the other short enquiry form, so it lands in the pipeline the usual way.
 */

const INTERESTS: Record<string, string> = {
  transformation: 'The Transformation',
  training: 'Training',
  exploring: 'Just exploring',
};

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}

function field(body: Record<string, unknown>, key: string, max: number): string {
  const v = body[key];
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const gate = await checkRate('submit-hour', ip);
  if (!gate.ok) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfterSec: gate.retryAfterSec },
      { status: 429, headers: { 'Retry-After': String(gate.retryAfterSec) } },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  const body = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;

  // bots fill the hidden field: tell them it worked and send nothing
  if (field(body, 'website', 200)) return NextResponse.json({ ok: true });

  const name = field(body, 'name', 120);
  const email = field(body, 'email', 200);
  const company = field(body, 'company', 160);
  const note = field(body, 'note', 4000);
  const interest = INTERESTS[field(body, 'for', 40)] ?? INTERESTS.exploring;
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'validation_failed' }, { status: 400 });
  }

  await recordLead({ kind: 'quick', email, firstName: name, company, landingPath: '/book' });

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[contact] dev mode, skipping Resend:', { name, email, company, interest });
      return NextResponse.json({ ok: true, dev: true });
    }
    return NextResponse.json({ error: 'email_not_configured' }, { status: 500 });
  }

  const teamEmail = process.env.TEAM_INTAKE_EMAIL ?? 'hello@traqcollective.com';
  const fromEmail = process.env.FROM_EMAIL ?? 'Traq Collective <hello@traqcollective.com>';
  const html = `<p><b>${esc(name)}</b>${company ? ` at <b>${esc(company)}</b>` : ''} sent a note from the website.</p>
<p>Interested in: ${esc(interest)}<br>Email: <a href="mailto:${esc(email)}">${esc(email)}</a></p>
<p style="white-space:pre-wrap">${note ? esc(note) : '<i>No message.</i>'}</p>`;

  const { error } = await new Resend(resendKey).emails.send({
    from: fromEmail,
    to: teamEmail,
    replyTo: email,
    subject: `Website note: ${name}${company ? ` (${company})` : ''}, ${interest}`,
    html,
  });
  if (error) {
    console.error('[contact] resend failed', error);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
