import { Redis } from '@upstash/redis';

/**
 * The shared Upstash client.
 *
 * Both the rate limiter and the lead store need Redis, and instantiating two
 * clients per invocation on a serverless route is wasteful, so the connection
 * lives here and is memoised per warm lambda. Returns null when the env vars
 * are absent (local dev, preview branches) and every caller is expected to
 * degrade rather than throw.
 */
let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}
