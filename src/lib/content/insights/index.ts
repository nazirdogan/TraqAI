/**
 * /insights article registry.
 *
 * One typed Article object per guide. The registry exports an ordered array
 * (newest-first display order is the page's concern, this is authoring order)
 * plus a getBySlug lookup used by the [slug] route. Keep articles as plain data
 * so the same object drives the page body, the BlogPosting schema, the FAQPage
 * schema and the /insights index.
 *
 * AEO rules every article must follow (see the Phase 3 plan + spec §7.3):
 * - intro is a definition-first, standalone 40-60 word answer block
 * - bodySections use H2/H3 phrased as real search queries
 * - cite >= 3 stats with source + url + year (reuse IMPACT_METRICS sources)
 * - faqs mirror a visible FaqBlock and the FAQPage JSON-LD
 * - related links point to 2-3 real internal pages
 * - dates: datePublished and dateModified are ISO strings
 */

/** A single cited statistic. Reuse the verified IMPACT_METRICS sources. */
export type ArticleStat = {
  /** Plain-language claim the stat backs up. */
  claim: string;
  /** The headline figure, e.g. "78%". */
  value: string;
  /** Publisher / study name, e.g. "Microsoft Work Trend Index". */
  source: string;
  /** Link to the source. */
  url: string;
  /** Publication year, e.g. "2024". */
  year: string;
};

/** One body section. body is a single paragraph; points renders an optional list. */
export type ArticleSection = {
  /** H2 phrased as a real search query where possible. */
  h2: string;
  /** The section answer paragraph. Lead with a direct, standalone answer. */
  body: string;
  /** Optional bullet list rendered under the body. */
  points?: string[];
};

/** A comparison table. Rendered as a real <table>; high AI-citation value. */
export type ArticleTable = {
  /** Heading above the table. */
  heading: string;
  /** Short supporting line under the heading. */
  intro?: string;
  /** Accessible caption describing the comparison. */
  caption: string;
  /** Column headers, including the row-label column first. */
  columns: string[];
  /** Each row: first cell is the row label, the rest are cells. */
  rows: string[][];
};

export type ArticleFaq = { q: string; a: string };

export type ArticleRelatedLink = { label: string; href: string };

export type Article = {
  /** URL slug: /insights/{slug}. */
  slug: string;
  /** Document <title> / SEO title. */
  title: string;
  /** Meta description. */
  metaDescription: string;
  /** The primary query this guide targets. */
  targetQuery: string;
  /** The page H1. */
  h1: string;
  /** ISO date string, e.g. "2026-06-10". */
  datePublished: string;
  /** ISO date string, e.g. "2026-06-10". */
  dateModified: string;
  /** Author display name. */
  author: 'Nazir Dogan';
  /** Definition-first, standalone 40-60 word intro. The first extractable block. */
  intro: string;
  /** Ordered body sections. */
  bodySections: ArticleSection[];
  /** Optional comparison tables rendered as real <table>s. */
  tables?: ArticleTable[];
  /** Cited stats (>= 3), each with source + url + year. */
  stats?: ArticleStat[];
  /** FAQs mirrored into a visible FaqBlock and FAQPage JSON-LD. */
  faqs: ArticleFaq[];
  /** 2-3 internal related links. */
  related: ArticleRelatedLink[];
};

/**
 * "How to actually get your team using AI": a practical adoption playbook.
 * Targets "how to get employees to use AI / AI adoption playbook". Cites the
 * verified BYO-AI, training-comfort and training-need stats from IMPACT_METRICS
 * (same sources, urls and years). Internal links to AI training and the free
 * AI Readiness Assessment.
 */
const getTeamUsingAi: Article = {
  slug: 'how-to-get-your-team-using-ai',
  title: 'How to get your team using AI: a practical adoption playbook | Traq Collective',
  metaDescription:
    'A step-by-step playbook for getting employees to actually use AI: start from real work, train people properly, set light guardrails, and measure adoption so the habits stick.',
  targetQuery: 'how to get employees to use AI / AI adoption playbook',
  h1: 'How to actually get your team using AI',
  datePublished: '2026-06-10',
  dateModified: '2026-06-10',
  author: 'Nazir Dogan',
  intro:
    'Getting your team using AI means turning tools they already have into daily habits. You pick a few high-value tasks, train people on their own work, set light guardrails, and track who is actually using it. Most teams have the tools. The gap is confidence and a clear reason to start.',
  bodySections: [
    {
      h2: 'Why is my team not using the AI tools we pay for?',
      body:
        'Most teams under-use AI because nobody showed them how it fits their job, not because they refuse to. People are busy, the tools feel generic, and a single lunch-and-learn does not change how anyone works on Monday. The result is a paid licence that sits idle while a few keen people quietly use their own AI in the gaps.',
      points: [
        'No clear, role-specific reason to open the tool',
        'A one-off demo with nothing to practise on afterwards',
        'Worry about getting it wrong, sharing the wrong data, or looking slow',
        'No visible example from someone in the same role',
      ],
    },
    {
      h2: 'What does an AI adoption playbook look like?',
      body:
        'A practical AI adoption playbook is a short, repeatable sequence: find the work worth automating, pick the people to start with, train on their real tasks, set guardrails, then measure use and keep going. It is run in weeks, not quarters, and it starts narrow so people get a win fast and tell their colleagues.',
      points: [
        'Step 1: Map the tasks that eat the most time in each team',
        'Step 2: Pick two or three starting use cases with an obvious payoff',
        'Step 3: Choose a small first group, including one respected sceptic',
        'Step 4: Train on their own work, not on generic examples',
        'Step 5: Set light guardrails so people know what is safe',
        'Step 6: Measure weekly active use and share the wins',
      ],
    },
    {
      h2: 'How do you pick the first AI use cases?',
      body:
        'Pick use cases that are frequent, time-consuming, and low-risk to get wrong. Drafting first replies, summarising long threads, cleaning up notes, and prepping research all qualify. Avoid anything that touches sensitive data or a regulated decision in week one. A good first use case saves a real hour this week and is easy to copy across the team.',
    },
    {
      h2: 'How should you train your team to use AI?',
      body:
        'Train people on the tasks they do every day, with their own files and their own workflows open in front of them. Skip the theory about how the model works. Give each role a handful of prompts that map to real jobs, then have people practise live until they get a result they trust. Comfort comes from reps, and reps need more than a single session.',
      points: [
        'Run hands-on sessions by role, not one generic all-hands',
        'Give people a short prompt library tied to their actual tasks',
        'Practise on live work, so the value is obvious that day',
        'Aim for more than five hours of practice over the first month',
      ],
    },
    {
      h2: 'What guardrails do you need before rolling out AI?',
      body:
        'You need a one-page set of rules people can actually remember: which tools are approved, what data must never be pasted in, when a human has to check the output, and who to ask when unsure. Keep it short and friendly so it removes fear rather than adding bureaucracy. Most hesitation comes from not knowing what is allowed, so saying it plainly speeds adoption up.',
    },
    {
      h2: 'How do you measure whether AI adoption is working?',
      body:
        'Measure weekly active users per team, the tasks people now run with AI, and the hours those tasks used to take. Adoption is a usage number, not a licence count. Review it every week at first, celebrate the people leading the way, and feed what is working back into training. When usage stalls, it usually means the next use case is unclear, so go find it with the team.',
      points: [
        'Weekly active users by team and role',
        'Number of real tasks now run with AI',
        'Estimated hours saved on those tasks',
        'Where usage stalled, and the next use case to unblock it',
      ],
    },
  ],
  stats: [
    {
      claim:
        'Most employees already bring their own AI to work, usually without guidance, so the demand is there before any rollout starts.',
      value: '78%',
      source: 'Microsoft Work Trend Index',
      url: 'https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part',
      year: '2024',
    },
    {
      claim:
        'Comfort using AI nearly doubles after structured training, which is why training, not access, is the real lever for adoption.',
      value: '43% → 72%',
      source: 'Slack',
      url: 'https://slack.com/blog/productivity/try-this-experiment-with-your-team-at-work-ai-microlearning',
      year: '2024',
    },
    {
      claim:
        'Employees rank training as the single most important thing they need to adopt AI, ahead of any new tool.',
      value: '48%',
      source: 'McKinsey',
      url: 'https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/superagency-in-the-workplace-empowering-people-to-unlock-ais-full-potential-at-work',
      year: '2025',
    },
  ],
  faqs: [
    {
      q: 'How long does it take to get a team using AI?',
      a: 'Most teams feel a difference within the first few weeks. If you start with two or three high-value tasks and train people on their own work, the first group is using AI the same week. Building it into daily habits across the wider team usually takes a 30, 60, 90 day path from quick wins to lasting use.',
    },
    {
      q: 'Should we mandate AI use or let it spread on its own?',
      a: 'Neither extreme works well. Mandates create resentment and box-ticking, and pure word of mouth leaves most people behind. The middle path is to make a clear ask, train people properly, show role-specific wins, and measure use. When people see a colleague save an hour, adoption spreads without force.',
    },
    {
      q: 'What if some of the team resists using AI?',
      a: 'Start by including one respected sceptic in your first group and training them on a task they personally find tedious. Resistance usually drops once the tool saves them real time on their own work. Keep guardrails clear so the worry about doing it wrong goes away, and let early wins do the persuading.',
    },
    {
      q: 'Do we need to train everyone at once?',
      a: 'No. Start with a small group and a few use cases, get a clear win, then expand. Training everyone in one go spreads attention thin and gives you no chance to learn what works. A narrow start with real practice beats a company-wide session that nobody applies the next day.',
    },
  ],
  related: [
    { label: 'AI Training & Workshops', href: '/services/ai-training' },
    { label: 'Consultation & Strategy', href: '/services/ai-consulting' },
    { label: 'About Traq Collective', href: '/about' },
  ],
};

/**
 * Ordered list of published articles. Cornerstone guides and comparison pages
 * are added in the following Phase 3 tasks; the index and [slug] route are
 * written to be empty-safe so this can start as an empty array.
 */
export const ARTICLES: Article[] = [getTeamUsingAi];

/** Look up an article by slug. Returns undefined when not found. */
export function getBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

/** All article slugs, for generateStaticParams. */
export function getAllSlugs(): string[] {
  return ARTICLES.map((article) => article.slug);
}
