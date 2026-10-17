import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Verify a Stripe webhook signature header (`Stripe-Signature`) against the
 * raw request body, the same check the official SDK runs: an HMAC-SHA256 of
 * `${t}.${body}` with the endpoint secret must match one of the v1 values,
 * and the timestamp must be within the tolerance to stop replays.
 */
export function verifyStripeSignature(rawBody: string, header: string | null, secret: string, toleranceSec = 300, nowSec = Math.floor(Date.now() / 1000)): boolean {
  if (!header) return false;
  let t: number | null = null;
  const v1: string[] = [];
  for (const part of header.split(',')) {
    const [k, v] = part.split('=', 2);
    if (k === 't') t = Number(v);
    if (k === 'v1' && v) v1.push(v);
  }
  if (!t || !Number.isFinite(t) || v1.length === 0) return false;
  if (Math.abs(nowSec - t) > toleranceSec) return false;

  const expected = Buffer.from(createHmac('sha256', secret).update(`${t}.${rawBody}`, 'utf8').digest('hex'), 'utf8');
  return v1.some((sig) => {
    const got = Buffer.from(sig, 'utf8');
    return got.length === expected.length && timingSafeEqual(got, expected);
  });
}

/** Build a header the way Stripe does. Used by tests only. */
export function signForTest(rawBody: string, secret: string, t = Math.floor(Date.now() / 1000)): string {
  return `t=${t},v1=${createHmac('sha256', secret).update(`${t}.${rawBody}`, 'utf8').digest('hex')}`;
}
