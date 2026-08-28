/**
 * Durable lead storage.
 *
 * Every intake route sends email through Resend and, until now, did nothing
 * else. That meant the `gclid` that src/lib/attribution.ts carefully preserves
 * from the ad click through to the form ended its life inside an email body,
 * and an inbox cannot be uploaded to Google Ads as an offline conversion. A
 * Sprint closing ninety days after the click was invisible to the account, so
 * Smart Bidding never learned which clicks were worth buying.
 *
 * The store is a Google Sheet, written through an Apps Script web app (see
 * docs/2026-08-28-lead-sheet-setup.md). That target was chosen because the same
 * sheet is three things at once: the row the route writes, the surface the
 * pipeline is worked by hand on, and the file Google Ads pulls from on a
 * scheduled offline conversion import. Nothing has to be exported or synced
 * between them, and there is no external database to be deleted again.
 *
 * Set LEAD_SHEET_WEBHOOK_URL on Vercel to switch it on. Unset, every call here
 * is a no-op, so local dev and preview branches write nothing.
 *
 * Every function fails open. A storage outage must never cost a lead.
 */

export type LeadKind = 'assessment' | 'assessment_partial' | 'quick' | 'chat';

/** The click that produced the lead, kept as discrete fields. */
export type ClickAttribution = {
  gclid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPath?: string;
};

export type LeadInput = ClickAttribution & {
  kind: LeadKind;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  /** Assessment only: readiness band, score out of 60, and the unscored budget answer. */
  band?: string;
  score?: number;
  budget?: string;
  /** Which page produced the lead, e.g. a paid-search landing page slug. */
  source?: string;
};

/**
 * Append a lead to the sheet. Resolves true when the row was written.
 *
 * Callers await this so the request lands before a serverless function is
 * frozen, not because they can act on the result. A three second ceiling keeps
 * a hanging Apps Script from holding the form's response open; the lead is
 * already safe in email by the time this matters.
 */
export async function recordLead(input: LeadInput): Promise<boolean> {
  const endpoint = process.env.LEAD_SHEET_WEBHOOK_URL;
  if (!endpoint) return false;

  const row = {
    ts: new Date().toISOString(),
    ...input,
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(3000),
      // Apps Script answers a POST with a 302 to script.googleusercontent.com.
      redirect: 'follow',
    });
    if (!res.ok) {
      console.warn('[leadstore] sheet responded', res.status);
      return false;
    }
    return true;
  } catch (err) {
    // A dropped row is bad. A 500 on the form because a sheet blinked is worse.
    console.warn('[leadstore] write failed:', err instanceof Error ? err.message : err);
    return false;
  }
}
