/**
 * Supabase access for the /keep emails, over PostgREST with the service role
 * key. Server only. Both tables have RLS on and no policies, so nothing but
 * this key can read or write them (supabase/keep.sql).
 *
 * Plain fetch rather than supabase-js: five small queries do not justify a
 * dependency.
 */

export type Buyer = {
  id: string;
  stripe_session_id: string;
  email: string;
  first_name: string;
  created_at: string;
  sent_confirm_at: string | null;
  sent_zoom_at: string | null;
  sent_reminder_at: string | null;
  sent_replay_at: string | null;
};

export type Settings = { zoom_url: string | null; replay_url: string | null; skool_url: string | null };

export type SentColumn = 'sent_confirm_at' | 'sent_zoom_at' | 'sent_reminder_at' | 'sent_replay_at';

function config(): { base: string; headers: Record<string, string> } {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing');
  // New-style secret keys (sb_secret_...) go in `apikey` only; a legacy
  // service_role JWT also goes in Authorization.
  const headers: Record<string, string> = { apikey: key, 'content-type': 'application/json' };
  if (!key.startsWith('sb_')) headers.authorization = `Bearer ${key}`;
  return { base: `${url.replace(/\/$/, '')}/rest/v1`, headers };
}

async function rest<T>(path: string, init: RequestInit & { prefer?: string } = {}): Promise<T> {
  const { base, headers } = config();
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: { ...headers, ...(init.prefer ? { prefer: init.prefer } : {}) },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`supabase ${res.status} on ${path.split('?')[0]}: ${(await res.text()).slice(0, 200)}`);
  const body = await res.text();
  return (body ? JSON.parse(body) : null) as T;
}

const COLS = 'id,stripe_session_id,email,first_name,created_at,sent_confirm_at,sent_zoom_at,sent_reminder_at,sent_replay_at';

/**
 * Save a buyer once per Checkout Session and return the stored row. A Stripe
 * retry of the same event finds the existing row instead of making another.
 */
export async function upsertBuyer(b: { stripe_session_id: string; email: string; first_name: string }): Promise<Buyer> {
  await rest('/keep_buyers?on_conflict=stripe_session_id', {
    method: 'POST',
    body: JSON.stringify(b),
    prefer: 'resolution=ignore-duplicates,return=minimal',
  });
  const rows = await rest<Buyer[]>(`/keep_buyers?stripe_session_id=eq.${encodeURIComponent(b.stripe_session_id)}&select=${COLS}`);
  if (!rows[0]) throw new Error('buyer row missing after insert');
  return rows[0];
}

/** Buyers still owed the email behind `column`, oldest first. */
export async function pendingBuyers(column: SentColumn, limit: number): Promise<Buyer[]> {
  const extra = column === 'sent_confirm_at' ? '' : '&sent_confirm_at=not.is.null';
  return rest<Buyer[]>(`/keep_buyers?${column}=is.null${extra}&select=${COLS}&order=created_at.asc&limit=${limit}`);
}

/** Stamp one or more sent_* columns. Called only after Resend accepts the send. */
export async function markSent(id: string, columns: SentColumn[], at = new Date().toISOString()): Promise<void> {
  const body = Object.fromEntries(columns.map((c) => [c, at]));
  await rest(`/keep_buyers?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(body), prefer: 'return=minimal' });
}

export async function getSettings(): Promise<Settings> {
  const rows = await rest<Settings[]>('/keep_settings?select=zoom_url,replay_url,skool_url&limit=1');
  const s = rows[0] ?? { zoom_url: null, replay_url: null, skool_url: null };
  // The table editor leaves '' behind when a cell is cleared; treat it as unset.
  const clean = (v: string | null) => (v && v.trim() ? v.trim() : null);
  return { zoom_url: clean(s.zoom_url), replay_url: clean(s.replay_url), skool_url: clean(s.skool_url) };
}
