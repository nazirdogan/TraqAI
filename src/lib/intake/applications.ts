import { getRedis } from '@/lib/intake/redis';
import type { AiPlanPrep, AiPlanSessionApplication } from '@/lib/intake/types';

/**
 * Durable storage for 2027 AI Plan session applications.
 *
 * The seats are capped and every application is read by hand, so an email that
 * lands in spam is a seat quietly lost. Redis is the record; the two emails are
 * the notification. It is the store the codebase already has wired up (the rate
 * limiter shares this client), so no new dependency arrives just to keep a list
 * of twenty-odd applications safe.
 *
 * Writes fail open. A storage outage must never cost an application, so a
 * failure here is logged and the route still sends both emails.
 */

const LIST_KEY = 'traq:ai-plan-session:applications';

/**
 * How many applications the list keeps. Far above the twenty seats on offer,
 * and enough that a second or third cohort does not push the first out before
 * anyone has read it.
 */
const MAX_STORED = 1000;

export type StoredApplication = AiPlanSessionApplication & {
  id: string;
  /** ISO 8601, set server-side. A client clock is not evidence of anything. */
  submittedAt: string;
};

export function buildApplicationRecord(
  application: AiPlanSessionApplication,
): StoredApplication {
  return {
    ...application,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };
}

/** Append one application. Resolves true only when the row is safely stored. */
export async function saveApplication(record: StoredApplication): Promise<boolean> {
  const redis = getRedis();
  if (!redis) {
    console.warn('[applications] no Upstash credentials, application not persisted:', record.id);
    return false;
  }
  try {
    await redis.lpush(LIST_KEY, JSON.stringify(record));
    await redis.ltrim(LIST_KEY, 0, MAX_STORED - 1);
    return true;
  } catch (err) {
    console.warn('[applications] write failed:', err instanceof Error ? err.message : err);
    return false;
  }
}

/**
 * Every stored application, newest first.
 *
 * Upstash decodes stored JSON on the way back out, so a row can arrive as an
 * already-parsed object or as the raw string, depending on how it was written.
 * Both shapes are handled, and a row that survives as neither is skipped rather
 * than taking the whole list down with it.
 */
export async function listApplications(limit = MAX_STORED): Promise<StoredApplication[]> {
  const redis = getRedis();
  if (!redis) return [];
  let rows: unknown[];
  try {
    rows = await redis.lrange<unknown>(LIST_KEY, 0, limit - 1);
  } catch (err) {
    console.warn('[applications] read failed:', err instanceof Error ? err.message : err);
    return [];
  }

  const out: StoredApplication[] = [];
  for (const row of rows) {
    if (typeof row === 'string') {
      try {
        out.push(JSON.parse(row) as StoredApplication);
      } catch {
        continue;
      }
    } else if (row && typeof row === 'object') {
      out.push(row as StoredApplication);
    }
  }
  return out;
}

// --- Pre-session task submissions -----------------------------------------

const PREP_LIST_KEY = 'traq:ai-plan-session:prep';

export type StoredPrep = AiPlanPrep & {
  id: string;
  submittedAt: string;
};

export function buildPrepRecord(prep: AiPlanPrep): StoredPrep {
  return { ...prep, id: crypto.randomUUID(), submittedAt: new Date().toISOString() };
}

/**
 * Kept in its own list rather than mixed in with applications.
 *
 * They arrive weeks apart, from different people (every applicant applies, only
 * confirmed attendees prep), and the internal page reads them side by side to
 * show who has sent theirs. One list holding both would need filtering on every
 * read to answer either question.
 */
export async function savePrep(record: StoredPrep): Promise<boolean> {
  const redis = getRedis();
  if (!redis) {
    console.warn('[applications] no Upstash credentials, prep not persisted:', record.id);
    return false;
  }
  try {
    await redis.lpush(PREP_LIST_KEY, JSON.stringify(record));
    await redis.ltrim(PREP_LIST_KEY, 0, MAX_STORED - 1);
    return true;
  } catch (err) {
    console.warn('[applications] prep write failed:', err instanceof Error ? err.message : err);
    return false;
  }
}

export async function listPreps(limit = MAX_STORED): Promise<StoredPrep[]> {
  const redis = getRedis();
  if (!redis) return [];
  let rows: unknown[];
  try {
    rows = await redis.lrange<unknown>(PREP_LIST_KEY, 0, limit - 1);
  } catch (err) {
    console.warn('[applications] prep read failed:', err instanceof Error ? err.message : err);
    return [];
  }
  const out: StoredPrep[] = [];
  for (const row of rows) {
    if (typeof row === 'string') {
      try {
        out.push(JSON.parse(row) as StoredPrep);
      } catch {
        continue;
      }
    } else if (row && typeof row === 'object') {
      out.push(row as StoredPrep);
    }
  }
  return out;
}
