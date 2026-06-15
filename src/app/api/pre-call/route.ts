import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

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

function buildHtml(d: z.infer<typeof schema>): string {
  const row = (label: string, val: string) =>
    `<tr><td style="padding:8px 0;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-family:Inter,sans-serif">${label}</td><td style="padding:8px 0 8px 16px;color:#0f172a;font-size:14px;font-family:Inter,sans-serif">${val}</td></tr>`;

  return `<!DOCTYPE html><html><body style="background:#f5f5f7;margin:0;padding:24px;font-family:Inter,system-ui,sans-serif">
<div style="background:#fff;border-radius:12px;padding:32px;max-width:560px;margin:0 auto">
  <h2 style="color:#0f172a;font-size:20px;font-weight:600;margin:0 0 6px 0">Pre-call intake</h2>
  <p style="color:#6b7280;font-size:13px;margin:0 0 20px 0">Submitted by ${d.name} ahead of their call.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0"/>
  <table style="width:100%;border-collapse:collapse">
    ${row('Team size', d.teamSize)}
    ${row('Current relationship with AI', d.aiRelationship)}
    ${row('Biggest bottleneck right now', d.bottleneck)}
    ${row('How quickly can they move', d.timeline)}
    ${row('Monthly budget', d.budget)}
  </table>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0"/>
  <p style="color:#6b7280;font-size:12px;margin:0">Submitted via traqcollective.com/pre-call. Review before the call.</p>
</div>
</body></html>`;
}

export async function POST(request: Request) {
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
      html: buildHtml(data),
    });
    if (error) {
      console.error('[pre-call] Resend error:', error);
      return NextResponse.json({ error: 'email_send_failed', detail: error }, { status: 502 });
    }
  } catch (err) {
    console.error('[pre-call] send exception:', err);
    const message = err instanceof Error ? err.message : 'email_send_failed';
    return NextResponse.json({ error: 'email_send_failed', detail: message }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'pre-call' });
}
