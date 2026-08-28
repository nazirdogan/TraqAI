import { Ratelimit } from '@upstash/ratelimit';
import { getRedis } from '@/lib/intake/redis';

type Bucket = 'chat-burst' | 'chat-hour' | 'submit-hour';

const limiters = new Map<Bucket, Ratelimit>();

function getLimiter(bucket: Bucket): Ratelimit | null {
  const cached = limiters.get(bucket);
  if (cached) return cached;
  const r = getRedis();
  if (!r) return null;
  const limiter = new Ratelimit({
    redis: r,
    prefix: `traq-intake:${bucket}`,
    limiter:
      bucket === 'chat-burst'
        ? Ratelimit.slidingWindow(10, '30 s')
        : bucket === 'chat-hour'
          ? Ratelimit.slidingWindow(50, '1 h')
          : Ratelimit.slidingWindow(5, '1 h'),
    analytics: false,
  });
  limiters.set(bucket, limiter);
  return limiter;
}

export type RateResult = { ok: boolean; retryAfterSec: number };

export async function checkRate(bucket: Bucket, identifier: string): Promise<RateResult> {
  const limiter = getLimiter(bucket);
  if (!limiter) {
    // No Upstash configured — allow traffic. Production should set env vars.
    return { ok: true, retryAfterSec: 0 };
  }
  try {
    const { success, reset } = await limiter.limit(identifier);
    const retryAfterSec = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
    return { ok: success, retryAfterSec };
  } catch (err) {
    // Upstash unreachable or erroring (e.g. deleted DB) — fail open so a
    // rate-limiter outage never blocks the lead pipeline. Turnstile still
    // gates abuse on the forms.
    console.warn(
      '[ratelimit] limiter error, failing open:',
      err instanceof Error ? err.message : err,
    );
    return { ok: true, retryAfterSec: 0 };
  }
}
