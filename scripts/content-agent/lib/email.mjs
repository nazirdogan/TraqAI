/**
 * Minimal Resend email sender for the daily content agent's alerts.
 *
 * Uses the Resend REST API directly (no SDK) so this script has zero extra
 * dependencies. Reads RESEND_API_KEY, ALERT_EMAIL (recipient) and optionally
 * ALERT_FROM (defaults to the site's transactional sender).
 *
 * Never throws: an alert failure must not crash the run. It logs and returns a
 * boolean so the caller can note it.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export async function sendAlert({ subject, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ALERT_EMAIL;
  const from = process.env.ALERT_FROM || 'Traq Content Agent <hello@traqcollective.com>';

  if (!apiKey || !to) {
    console.warn('[email] RESEND_API_KEY or ALERT_EMAIL missing; skipping alert.');
    return false;
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, text }),
    });
    if (!res.ok) {
      console.warn(`[email] Resend returned ${res.status}: ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[email] failed to send alert: ${String(err)}`);
    return false;
  }
}
