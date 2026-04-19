import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

type Bucket = 'chat-burst' | 'chat-hour' | 'submit-hour';

let redis: Redis | null = null;
const limiters = new Map<Bucket, Ratelimit>();

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

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
  const { success, reset } = await limiter.limit(identifier);
  const retryAfterSec = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
  return { ok: success, retryAfterSec };
}
