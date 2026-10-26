import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkRate } from '@/lib/intake/ratelimit';
import { clientIp } from '@/lib/intake/turnstile';
import { recordLead } from '@/lib/intake/leadstore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/contact: the inquiry form on the Contact page (public/rebuild/contact.html, served at /contact and /book).
 * It is a static page, so it posts plain JSON.
 *
 * Public by design: anyone on the site can send an inquiry, so there is no login. It is guarded instead by a hidden
 * honeypot field, length limits, the shared submit rate limit, and by only ever emailing our own inboxes, never the
 * sender, so it cannot be used to send mail to other people.
 *
 * Every inquiry goes to hello@traqcollective.com and to TEAM_INTAKE_EMAIL (Nazir), with Reply going to the sender,
 * and is written to the lead sheet as a 'quick' lead with the phone number, so it lands in the pipeline the usual way.
 */

const TOPICS: Record<string, string> = {
  transformation: 'AI transformation',
  training: 'AI training',
  consulting: 'AI consulting',
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
  const phone = field(body, 'phone', 40);
  const topic = TOPICS[field(body, 'topic', 40)];
  const message = field(body, 'message', 4000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !company || !/\d{6,}/.test(phone.replace(/\D/g, '')) || !topic || !message) {
    return NextResponse.json({ error: 'validation_failed' }, { status: 400 });
  }

  await recordLead({ kind: 'quick', email, firstName: name, company, phone, landingPath: '/contact' });

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[contact] dev mode, skipping Resend:', { name, email, company, phone, topic });
      return NextResponse.json({ ok: true, dev: true });
    }
    return NextResponse.json({ error: 'email_not_configured' }, { status: 500 });
  }

  const to = Array.from(new Set(['hello@traqcollective.com', process.env.TEAM_INTAKE_EMAIL].filter((x): x is string => !!x)));
  const fromEmail = process.env.FROM_EMAIL ?? 'Traq Collective <hello@traqcollective.com>';
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#6B6975;vertical-align:top">${label}</td><td style="padding:6px 0">${value}</td></tr>`;
  const html = `<p>New inquiry from the website.</p>
<table style="border-collapse:collapse;font-size:15px">
${row('Name', esc(name))}
${row('Company', esc(company))}
${row('Email', `<a href="mailto:${esc(email)}">${esc(email)}</a>`)}
${row('Phone', `<a href="tel:${esc(phone.replace(/[^\d+]/g, ''))}">${esc(phone)}</a>`)}
${row('About', esc(topic))}
</table>
<p style="margin-top:18px"><b>What they would like help with</b></p>
<p style="white-space:pre-wrap">${esc(message)}</p>
<p style="color:#6B6975">Reply to this email to answer them directly.</p>`;

  const { error } = await new Resend(resendKey).emails.send({
    from: fromEmail,
    to,
    replyTo: email,
    subject: `New inquiry: ${name} (${company}), ${topic}`,
    html,
  });
  if (error) {
    console.error('[contact] resend failed', error);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
