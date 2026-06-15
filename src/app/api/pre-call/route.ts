import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { clientIp } from '@/lib/intake/turnstile';
import PreCallLeadEmail from '@/emails/PreCallLeadEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  name: z.string().min(1).max(200),
  teamSize: z.string().min(1),
  aiRelationship: z.string().min(1),
  bottleneck: z.string().min(1),
  timeline: z.string().min(1),
  budget: z.string().min(1),
});

export async function POST(request: Request) {
  const ip = clientIp(request);
  void ip;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation_failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const resendKey = process.env.RESEND_API_KEY;
  const teamEmail = process.env.TEAM_INTAKE_EMAIL ?? 'hello@traqcollective.com';
  const fromEmail = process.env.FROM_EMAIL ?? 'Traq Collective <hello@traqcollective.com>';

  if (!resendKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[pre-call] dev mode — skipping Resend. Data:', data);
      return NextResponse.json({ ok: true, dev: true });
    }
    return NextResponse.json({ error: 'email_not_configured' }, { status: 500 });
  }

  const resend = new Resend(resendKey);

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: teamEmail,
      subject: `Pre-call intake: ${data.name} — ${data.timeline} · ${data.budget}`,
      react: PreCallLeadEmail({ data }),
    });
    if (error) {
      return NextResponse.json({ error: 'email_send_failed', detail: error }, { status: 502 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'email_send_failed';
    return NextResponse.json({ error: 'email_send_failed', detail: message }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'pre-call' });
}
