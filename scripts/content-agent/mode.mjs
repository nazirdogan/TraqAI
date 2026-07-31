/**
 * Mode picker for the daily content agent.
 *
 * Prints today's mode so the brain (agent.md) knows what to produce:
 *   - monthly-refresh : the 1st of the month. Refresh the oldest/weakest guide.
 *   - weekly-guide    : Mondays. Take the next commercial query from the
 *                       target-query backlog. Also the day the topic pipeline
 *                       gets refilled, so it never runs dry.
 *   - news-note       : Tuesdays and Fridays. What actually happened in AI this
 *                       week, explained for a small business.
 *   - daily-note      : every other day. Next planned topic from the pipeline.
 *
 * The week is deliberately mixed. An all-evergreen feed goes stale and never
 * catches "what changed" searches; an all-news feed chases vendor announcements
 * and wins no commercial queries. Two news days a week keeps the site current
 * without turning the feed into a press-release reprinter.
 *
 * Run: `node scripts/content-agent/mode.mjs`  ->  prints e.g. "daily-note"
 * Override for testing: `CONTENT_MODE=news-note node scripts/content-agent/mode.mjs`
 */

/** Weekdays that get a news round-up. 2 = Tuesday, 5 = Friday. */
export const NEWS_DAYS = [2, 5];

export function pickMode(date = new Date()) {
  const override = process.env.CONTENT_MODE;
  if (override) return override;

  const dayOfMonth = date.getUTCDate();
  const weekday = date.getUTCDay(); // 0 = Sunday, 1 = Monday

  if (dayOfMonth === 1) return 'monthly-refresh';
  if (weekday === 1) return 'weekly-guide';
  if (NEWS_DAYS.includes(weekday)) return 'news-note';
  return 'daily-note';
}

/**
 * Days per week that consume a planned pipeline topic (not Monday, not news
 * days). Used to report runway honestly: 72 queued topics is 18 weeks at 4
 * per week, not 10 weeks at 7.
 */
export const PIPELINE_DAYS_PER_WEEK = 7 - 1 - NEWS_DAYS.length;

// When run directly, print the mode for today.
if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdout.write(pickMode());
}
