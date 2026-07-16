/**
 * Mode picker for the daily content agent.
 *
 * Prints today's mode so the brain (agent.md) knows what to produce:
 *   - monthly-refresh : the 1st of the month. Refresh the oldest/weakest guide.
 *   - weekly-guide    : Mondays (except when it is also monthly-refresh day).
 *   - daily-note      : every other day. One short field note.
 *
 * Run: `node scripts/content-agent/mode.mjs`  ->  prints e.g. "daily-note"
 * Override for testing: `CONTENT_MODE=weekly-guide node scripts/content-agent/mode.mjs`
 */

export function pickMode(date = new Date()) {
  const override = process.env.CONTENT_MODE;
  if (override) return override;

  const dayOfMonth = date.getUTCDate();
  const weekday = date.getUTCDay(); // 0 = Sunday, 1 = Monday

  if (dayOfMonth === 1) return 'monthly-refresh';
  if (weekday === 1) return 'weekly-guide';
  return 'daily-note';
}

// When run directly, print the mode for today.
if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdout.write(pickMode());
}
