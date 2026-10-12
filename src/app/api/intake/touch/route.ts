import { NextResponse } from 'next/server';
import { z } from 'zod';
import { clickAttributionSchema } from '@/lib/intake/types';
import { checkRate } from '@/lib/intake/ratelimit';
import { clientIp } from '@/lib/intake/turnstile';
import { recordLead } from '@/lib/intake/leadstore';
import { TOUCH_KINDS, isSameSiteOrigin, shouldRecordTouch } from '@/lib/intake/touch';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Records a touch: a Calendly booking, or a tap on the phone or WhatsApp link.
 *
 * Called with navigator.sendBeacon from the browser, so the request survives
 * the page handing over to the dialler or WhatsApp. Nothing the caller does
 * depends on the response, so every outcome answers quickly and quietly; the
 * only thing that matters is whether a row reached the sheet.
 *
 * No Turnstile: a beacon cannot wait for a challenge, and a lost booking row
 * costs more than an occasional junk one. The guards are a same-site Origin,
 * a plausible gclid on taps, the shared rate limiter, and a strict schema.
 */

const touchSchema = z.object({
  kind: z.enum(TOUCH_KINDS),
  click: clickAttributionSchema.optional(),
  /** The page the touch happened on, e.g. "/book" or "/lp/ai-consultant-dubai". */
  path: z.string().trim().max(200).optional(),
  /** Bookings carry the assessment result through, when there was one. */
  score: z.number().int().min(0).max(100).optional(),
  band: z.string().trim().max(40).optional(),
});

export async function POST(request: Request) {
  // Beacons normally carry an Origin; older browsers may send only a Referer.
  // A request that names another site is refused. One that names none is let
  // through, because dropping a real booking row costs more than a junk row.
  const from = request.headers.get('origin') ?? request.headers.get('referer');
  if (from && !isSameSiteOrigin(from, request.headers.get('host'))) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const gate = await checkRate('touch-hour', clientIp(request));
  if (!gate.ok) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let body: unknown;
  try {
    // sendBeacon posts text/plain, so read the raw text rather than trusting
    // the content type.
    body = JSON.parse(await request.text());
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const parsed = touchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation_failed' }, { status: 400 });
  }

  const touch = parsed.data;
  if (!shouldRecordTouch(touch.kind, touch.click)) {
    // An organic tap: nothing to attribute, so no row. Not an error.
    return NextResponse.json({ ok: true, recorded: false });
  }

  const recorded = await recordLead({
    kind: touch.kind,
    band: touch.band,
    score: touch.score,
    source: touch.path,
    ...(touch.click ?? {}),
  });

  return NextResponse.json({ ok: true, recorded });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'intake/touch' });
}
