import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const submission = parsed.data;

  // Submission log — swap this for a real sink once wiring is in place.
  // To enable Resend: set RESEND_API_KEY and send to hello@traqcollective.com
  // via `await resend.emails.send({ from, to, subject, react })`.
  console.info('[contact] new submission', {
    name: `${submission.firstName} ${submission.lastName}`,
    email: submission.email,
    company: submission.company ?? null,
    service: submission.service ?? null,
    length: submission.message.length,
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'contact' });
}
