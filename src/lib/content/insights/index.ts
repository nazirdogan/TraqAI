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
 * (same sources, urls and years). Internal links to AI training, AI consulting
 * and the about page.
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
 * "AI readiness: is your company ready? (checklist)": a real, usable readiness
 * checklist across tools, team, training, leadership and use cases. Targets
 * "AI readiness assessment / checklist". Cites the verified BYO-AI, training
 * tipping-point and training-need stats from IMPACT_METRICS (same sources, urls
 * and years). CTA into a free strategy call (/book); internal links to AI
 * consulting and the team-adoption guide.
 */
const aiReadinessChecklist: Article = {
  slug: 'ai-readiness-checklist',
  title: 'AI readiness checklist: is your company ready for AI? | Traq Collective',
  metaDescription:
    'A practical AI readiness checklist across tools, team, training, leadership and use cases. Score where you stand, see what to fix first, and book a free call for a tailored plan.',
  targetQuery: 'AI readiness assessment / checklist',
  h1: 'AI readiness: is your company ready? (a checklist)',
  datePublished: '2026-06-10',
  dateModified: '2026-06-10',
  author: 'Nazir Dogan',
  intro:
    'AI readiness is how prepared your company is to put AI to work across five things: the tools you have, your team confidence, training done, leadership buy-in, and clear use cases. This checklist scores each one so you can see where you stand and what to fix first. Most companies have the tools and lack the rest.',
  bodySections: [
    {
      h2: 'What does AI readiness actually mean?',
      body:
        'AI readiness means your company can adopt AI and get real value from it, not just buy licences. It covers five dimensions: the tools in place, how confident the team feels, whether people have been trained, whether leaders back the change, and whether you have picked specific use cases. A ready company scores well across all five. A company with tools but no training or use cases is not ready, it is just paying for software.',
    },
    {
      h2: 'What is an AI readiness checklist?',
      body:
        'An AI readiness checklist is a short set of questions across the five readiness dimensions that gives you an honest picture of where you stand today. You answer each one, count where you are strong and where you are weak, then act on the gaps. Use the checklist below. Each section gives the things a ready company can tick off.',
    },
    {
      h2: 'Tools: do you have the right AI in place?',
      body:
        'Start here because it is usually the easiest. Tool readiness means your team has access to capable AI, the accounts are paid and provisioned, and the data and security side is sorted. Most companies score well here and still get nothing back, because tools without training and use cases sit idle. Tick what is true today.',
      points: [
        'Your team has access to a capable AI assistant (ChatGPT, Copilot, Claude or similar)',
        'Licences are paid for and actually provisioned to the people who need them',
        'The tools connect to the systems people already use (email, docs, CRM)',
        'You know which data is safe to use and which is off limits',
        'Someone owns the tool stack and keeps it current',
      ],
    },
    {
      h2: 'Team: is your team confident using AI?',
      body:
        'Team readiness is about confidence and habit, not headcount. A ready team has people who reach for AI on real tasks without being told, who can spot a good use from a bad one, and who help colleagues get started. If most of your team has never opened the tool you pay for, this is your weakest dimension and the one with the most upside.',
      points: [
        'Most of the team uses AI on real work at least weekly',
        'People know which tasks AI helps with and which it does not',
        'At least one person per team is a confident, go-to AI user',
        'Staff are not quietly using personal AI accounts to fill the gap',
        'People feel safe to experiment without fear of getting it wrong',
      ],
    },
    {
      h2: 'Training: has your team been trained properly?',
      body:
        'Training readiness means people have had hands-on practice on their own work, not a single demo they forgot by Monday. The evidence is blunt: structured training nearly doubles comfort with AI, and more than five hours of it is the tipping point to regular use. If your training so far has been one all-hands or a shared link, count this dimension as not ready.',
      points: [
        'People have practised on their own real tasks, not generic examples',
        'Training is role-specific, so each team learns its own use cases',
        'Most users have had more than five hours of hands-on practice',
        'There is a short prompt library tied to actual jobs',
        'New starters get brought up to speed, so the capability does not decay',
      ],
    },
    {
      h2: 'Leadership: do your leaders back the change?',
      body:
        'Leadership readiness is the dimension companies most often skip and most quietly fail on. A ready leadership team has named someone accountable for AI, set a clear expectation that people will use it, and made room in the week for learning. If AI is treated as a side project nobody owns, adoption stalls no matter how good the tools are.',
      points: [
        'Someone senior owns AI adoption and is accountable for it',
        'Leaders use AI themselves and talk about it openly',
        'There is a clear, friendly expectation that the team will adopt AI',
        'People are given time to learn, not asked to do it on top of everything',
        'There is a budget line for tools and training, not just hope',
      ],
    },
    {
      h2: 'Use cases: have you picked where AI helps most?',
      body:
        'Use-case readiness means you have named the specific, high-value tasks where AI saves real time, rather than waving at AI in general. Ready companies can point to two or three use cases per team with an obvious payoff and a way to measure it. Vague ambition is the enemy here. If you cannot name the tasks, you are not ready to roll out.',
      points: [
        'You have named two or three high-value use cases per team',
        'Each use case is frequent, time-consuming and low-risk to get wrong',
        'You know roughly how many hours each one could save',
        'You measure weekly active use, not just licence count',
        'There is a plan to find the next use case once the first ones land',
      ],
    },
    {
      h2: 'How do you score your AI readiness?',
      body:
        'Score each of the five dimensions out of its checklist items, then read your bands. Strong in four or five dimensions means you are ready to scale adoption. Strong in two or three means you are building and should fix the weak ones first. Strong in zero or one means you are early, and the fastest win is usually training and use cases, since the tools are likely already there.',
      points: [
        'Ready: strong in four or five dimensions, scale what works',
        'Building: strong in two or three, fix the weakest dimension next',
        'Early: strong in zero or one, start with training and use cases',
        'For a scored result and a tailored plan, book a free call and we will score it with you',
      ],
    },
    {
      h2: 'What should you do after the AI readiness checklist?',
      body:
        'Act on your weakest dimension first, because readiness is set by your lowest score, not your average. If tools are fine but training and use cases are weak, that is where the time goes. The fastest way to turn this checklist into a score and a tailored next step is to talk it through, so book a free call and we will map it with you.',
      points: [
        'Book a free call to turn this checklist into a scored result and a plan',
        'Fix your lowest-scoring dimension first, not your average',
        'Start narrow: a few use cases, a small group, real practice',
        'Book a free call if you want a partner to map it with you',
      ],
    },
  ],
  stats: [
    {
      claim:
        'Most employees already bring their own AI to work, usually without guidance, so the readiness gap is rarely about access. It is about training, use cases and ownership.',
      value: '78%',
      source: 'Microsoft Work Trend Index',
      url: 'https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part',
      year: '2024',
    },
    {
      claim:
        'More than five hours of training is the tipping point to regular AI use, which is why the training dimension decides readiness more than the tools do.',
      value: '79% vs 67%',
      source: 'BCG',
      url: 'https://www.bcg.com/publications/2025/ai-at-work-momentum-builds-but-gaps-remain',
      year: '2025',
    },
    {
      claim:
        'Comfort using AI nearly doubles after structured training, so a low score on the training dimension is the fastest one to lift.',
      value: '43% → 72%',
      source: 'Slack',
      url: 'https://slack.com/blog/productivity/try-this-experiment-with-your-team-at-work-ai-microlearning',
      year: '2024',
    },
    {
      claim:
        'Employees rank training as the single most important thing they need to adopt AI, ahead of any new tool, which is why a tools-only company still scores low on readiness.',
      value: '48%',
      source: 'McKinsey',
      url: 'https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/superagency-in-the-workplace-empowering-people-to-unlock-ais-full-potential-at-work',
      year: '2025',
    },
  ],
  faqs: [
    {
      q: 'How do I know if my company is ready for AI?',
      a: 'Score yourself across five dimensions: tools, team confidence, training, leadership buy-in and use cases. If you are strong in four or five, you are ready to scale. Strong in two or three means you are building, so fix the weakest first. Strong in zero or one means you are early. If you want a scored result and a tailored plan, book a free call and we will work through it with you.',
    },
    {
      q: 'What are the dimensions of AI readiness?',
      a: 'There are five: the tools you have in place, how confident your team feels, whether people have been trained properly, whether leadership backs the change, and whether you have named specific use cases. Readiness is set by your weakest dimension, not your average, so a company with great tools but no training or use cases is not yet ready.',
    },
    {
      q: 'We already pay for ChatGPT and Copilot, are we ready?',
      a: 'Tools are only one of five dimensions, so paying for them does not make you ready on its own. Most companies score well on tools and poorly on training, use cases and leadership ownership. If most of the team rarely opens the tool, the readiness gap is confidence and use cases, not software. Training is usually the fastest fix.',
    },
    {
      q: 'How long does it take to become AI ready?',
      a: 'Most companies move from early to building within a few weeks once they start with training and a couple of clear use cases. Becoming ready to scale across the wider team usually follows a 30, 60, 90 day path from quick wins to lasting habits. The tools are often already in place, so the timeline is set by training and adoption, not procurement.',
    },
  ],
  related: [
    { label: 'Book a free AI readiness call', href: '/book' },
    { label: 'Consultation & Strategy', href: '/services/ai-consulting' },
    { label: 'How to get your team using AI', href: '/insights/how-to-get-your-team-using-ai' },
  ],
};

/**
 * "What a fractional Head of AI does, and when you need one": captures the
 * "fractional Head of AI / when to hire" search but leads with the Embedded AI
 * Partner framing (with you, not a hire). Mirrors and links the standalone
 * /fractional-head-of-ai page. Uses a real comparison table (high AI-citation
 * value) and cites the verified BYO-AI, training tipping-point and training-need
 * stats from IMPACT_METRICS. The term is captured and reframed, never adopted as
 * how Traq describes itself.
 */
const fractionalHeadOfAi: Article = {
  slug: 'what-a-fractional-head-of-ai-does',
  title: 'What a fractional Head of AI does, and when you need one | Traq Collective',
  metaDescription:
    'A fractional Head of AI sets your AI strategy, picks the tools, leads the rollout and owns guardrails part-time. Here is what the role covers, when to hire, and why most teams are better served by an embedded AI partner.',
  targetQuery: 'what is a fractional Head of AI / when to hire',
  h1: 'What a fractional Head of AI does, and when you need one',
  datePublished: '2026-06-10',
  dateModified: '2026-06-10',
  author: 'Nazir Dogan',
  intro:
    'A fractional Head of AI is a senior, part-time leader who sets your AI strategy, picks the tools, leads the rollout and owns guardrails, without the cost of a full-time hire. Traq delivers that work as an embedded AI partner: we do it with your team, not as a role on your org chart, and we leave the capability with your people.',
  bodySections: [
    {
      h2: 'What does a fractional Head of AI do?',
      body:
        'A fractional Head of AI does the leadership work of a full-time AI executive, but part-time and for a fixed scope. They set the AI strategy, decide which tools to back, sequence the work by payoff, lead training and rollout, and own the guardrails for safe use. The word fractional just means part-time, so you get senior direction without funding a full executive seat all year. It is how most mid-market teams search for the help they actually need.',
      points: [
        'Sets the AI strategy and sequences the work by payoff',
        'Chooses the tools and vendors that fit your context',
        'Leads training and rollout so adoption actually happens',
        'Owns guardrails, safe use and outcomes you can measure',
        'Reports progress in hours saved and tools adopted, not slideware',
      ],
    },
    {
      h2: 'Why an embedded AI partner is usually a better fit',
      body:
        'We deliver every part of that role, but as a partner working with you, not as a new hire working for you. An embedded AI partner sits alongside your team in your own tools, sets the direction together, and stays accountable to outcomes. You get the seniority of a Head of AI without a job title, a headcount to manage, or a year-long commitment to one person. Your team keeps everything we build and learns to run it without us. That is the difference between hiring leadership and partnering for it.',
    },
    {
      h2: 'When do you need a fractional Head of AI?',
      body:
        'You need this kind of senior AI leadership when you have bought the tools but adoption has stalled, when nobody owns AI and the work keeps slipping, or when leadership wants a clear plan rather than scattered experiments. If your team is busy and your AI licences are sitting idle, that gap is what a fractional Head of AI, or an embedded partner, is there to close.',
      points: [
        'You pay for AI tools but most of the team does not use them',
        'No one senior owns AI, so the work never gets prioritised',
        'You want a clear, sequenced roadmap, not one-off pilots',
        'You need guardrails before people put real data into AI',
        'You want the capability to stay in-house, not depend on an agency',
      ],
    },
    {
      h2: 'When should you hire a full-time Head of AI instead?',
      body:
        'Hire full-time when the volume of AI work genuinely fills a year. If you are shipping AI products, running a large data and ML function, or making AI central to what you sell, a permanent executive earns their seat. Most mid-market teams are not there yet. They have months of high-value enablement work, not years of executive headcount, so a part-time partner gets them moving faster and cheaper. You can always hire the role later once the work justifies it.',
    },
    {
      h2: 'How much does a fractional Head of AI cost?',
      body:
        'Far less than a full-time hire. Instead of a six-figure salary plus benefits and equity every year, you pay for a scoped, part-time engagement sized to the work. We start with a fast, fixed-scope audit so you see value before any long commitment, then agree a cadence that fits. We agree what we are moving and put a number on it, and you keep everything we build.',
    },
    {
      h2: 'How is this different from a one-off AI consultant?',
      body:
        'A consultant typically hands you a plan and leaves. An embedded AI partner owns the outcome with you: we set the strategy, lead the rollout, train your team and stay accountable for adoption, working alongside you part-time. It is leadership and delivery together, so the plan actually gets used and the habits stick after we step back.',
    },
  ],
  tables: [
    {
      heading: 'Fractional Head of AI vs a full-time hire vs an embedded partner',
      intro:
        'All three give you senior AI leadership. The difference is how fast you see value, what you spend, the risk you take on, and where the capability ends up.',
      caption:
        'A fractional Head of AI compared with a full-time hire and an embedded AI partner across time to value, cost, risk, flexibility and whether the capability stays in your team',
      columns: ['Consideration', 'Embedded AI partner (Traq)', 'Fractional Head of AI', 'Full-time hire'],
      rows: [
        [
          'Time to value',
          'Days. We embed and start in week one',
          'Weeks, once the contract and scope are set',
          'Months of search, hiring and onboarding',
        ],
        [
          'Cost',
          'A scoped engagement, sized to the work',
          'A part-time retainer, lower than a salary',
          'A full executive salary, benefits and equity, every year',
        ],
        [
          'Risk',
          'A fixed-scope audit proves value before any long commitment',
          'Lower than a hire, but tied to one external person',
          'A permanent bet on one hire before you know the fit',
        ],
        [
          'Flexibility',
          'Scale the cadence up or down as needs change',
          'Adjustable, within the retainer terms',
          'A fixed headcount and overhead, hard to unwind',
        ],
        [
          'Capability stays in your team',
          'We build it into your people and make ourselves redundant',
          'Depends on the person and how they work',
          'Capability tied to one person who may move on',
        ],
      ],
    },
  ],
  stats: [
    {
      claim:
        'Most employees already bring their own AI to work, usually without guidance, so the leadership job is rarely about access. It is about direction, training and guardrails.',
      value: '78%',
      source: 'Microsoft Work Trend Index',
      url: 'https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part',
      year: '2024',
    },
    {
      claim:
        'Comfort using AI nearly doubles after structured training, which is why leading the rollout, not just buying tools, is what a fractional Head of AI is really for.',
      value: '43% → 72%',
      source: 'Slack',
      url: 'https://slack.com/blog/productivity/try-this-experiment-with-your-team-at-work-ai-microlearning',
      year: '2024',
    },
    {
      claim:
        'Employees rank training as the single most important thing they need to adopt AI, ahead of any new tool, so the role pays off most when it owns enablement.',
      value: '48%',
      source: 'McKinsey',
      url: 'https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/superagency-in-the-workplace-empowering-people-to-unlock-ais-full-potential-at-work',
      year: '2025',
    },
  ],
  faqs: [
    {
      q: 'What is a fractional Head of AI?',
      a: 'A fractional Head of AI is a senior, part-time leader who sets your AI strategy, picks the tools, leads the rollout and owns guardrails. Fractional just means part-time, so you get executive-level direction without a full-time salary. Traq delivers that same work as an embedded AI partner: we do it with your team and leave the capability in-house, rather than becoming a permanent role on your org chart.',
    },
    {
      q: 'When should I hire a fractional Head of AI?',
      a: 'When you have bought AI tools but adoption has stalled, nobody senior owns AI, or leadership wants a clear plan rather than scattered pilots. If your licences are sitting idle while the team stays busy, that is the gap this kind of leadership closes. Most mid-market teams have months of enablement work, not years of executive headcount, so a part-time partner moves faster than a full-time hire.',
    },
    {
      q: 'Fractional Head of AI or a full-time hire, which do I need?',
      a: 'Hire full-time only when AI work genuinely fills a year, for example if you are shipping AI products or running a large ML function. Most teams are not there yet. They have high-value enablement work that a part-time partner can deliver faster and far cheaper, with the capability left in your people. You can hire the permanent role later once the volume of work justifies the seat.',
    },
    {
      q: 'How much does a fractional Head of AI cost?',
      a: 'Far less than a full-time executive. Instead of a six-figure salary plus benefits and equity each year, you pay for a scoped, part-time engagement sized to the work. Traq starts with a fixed-scope audit so you see value first, then agrees a cadence that fits. Book a call and we will scope an embedded partnership to your situation.',
    },
  ],
  related: [
    { label: 'Embedded AI Partner', href: '/fractional-head-of-ai' },
    { label: 'Consultation & Strategy', href: '/services/ai-consulting' },
    { label: 'How to get your team using AI', href: '/insights/how-to-get-your-team-using-ai' },
  ],
};

/**
 * "How agentic workflows actually work": a plain-language explainer of agentic
 * AI and autonomous workflows for business. Targets "agentic AI / autonomous
 * workflows for business". References the anonymized autonomous operation Traq
 * runs ("a company we operate", never named). Cites the verified BYO-AI,
 * productivity-lift and satisfaction stats from IMPACT_METRICS (same sources,
 * urls and years). Internal links to the agentic AI service, implementation and
 * the team-adoption guide.
 */
const howAgenticWorkflowsWork: Article = {
  slug: 'how-agentic-workflows-work',
  title: 'How agentic workflows actually work: a plain-language guide | Traq Collective',
  metaDescription:
    'A plain-language explainer of agentic AI and autonomous workflows for business: what an AI agent is, how agentic workflows run multi-step work on their own, where they help, and how to roll them out safely.',
  targetQuery: 'agentic AI / autonomous workflows for business',
  h1: 'How agentic workflows actually work',
  datePublished: '2026-06-10',
  dateModified: '2026-06-10',
  author: 'Nazir Dogan',
  intro:
    'An agentic workflow is software that takes a goal and carries out the steps to reach it on its own: pulling data, making decisions, using tools, and escalating to a person only when something needs judgement. Agentic AI chains these agents together so whole processes run without someone driving each step.',
  bodySections: [
    {
      h2: 'What is agentic AI in plain English?',
      body:
        'Agentic AI is the difference between asking and doing. A chatbot answers when you prompt it. An AI agent is handed a goal and works out the steps to reach it, then carries them out. It reads the input, decides what to do next, uses the tools it needs, and only stops to ask a person when something genuinely needs judgement. The model is the engine, but the agent is the engine plus a plan, a set of tools, and the freedom to act.',
      points: [
        'A goal, not a single question, kicks the work off',
        'The agent plans the steps rather than waiting for each instruction',
        'It uses real tools: email, documents, a CRM, an API',
        'It escalates the exceptions to a person instead of guessing',
      ],
    },
    {
      h2: 'How does an agentic workflow actually run?',
      body:
        'An agentic workflow runs as a loop: read the situation, decide the next step, act, check the result, repeat until the goal is met or a person is needed. Several agents can hand off to each other, so one handles intake, another does the research, another drafts the output, and a person signs off the parts that matter. The work moves through the steps on its own, the way a well-run team passes a task down the line.',
      points: [
        'Read: the agent takes in the goal and the current state',
        'Decide: it picks the next step from what it can see',
        'Act: it calls a tool or hands off to another agent',
        'Check: it reviews the result and corrects course',
        'Escalate: a person handles anything outside the guardrails',
      ],
    },
    {
      h2: 'What does an autonomous operation look like in practice?',
      body:
        'We do not just advise on this. We run a full autonomous operation end to end for a company we operate, where agents handle the day-to-day work and escalate only what needs a human call. That gives us a live system to learn from, so the workflows we build for clients are grounded in what holds up in production rather than a tidy diagram. The agents do the volume, and a small team stays on the exceptions and the judgement.',
    },
    {
      h2: 'How is agentic AI different from traditional automation?',
      body:
        'Traditional automation follows a script you write in advance, and it breaks the moment something falls outside that script. Agentic AI takes a goal, reasons through the steps, reads messy real-world input the way a person would, and asks for help when it is unsure. It also improves as you refine the goals, where a rules-based script stays fixed until someone rewrites it. The table below sets the two side by side.',
    },
    {
      h2: 'Where do agentic workflows help a business first?',
      body:
        'Start where the work is high volume, repeatable, and currently eats a person\'s day. Intake and triage, research and summarisation, drafting first versions, routing requests, and reconciling data across systems all suit agents well. Keep regulated decisions and anything that needs accountability with a person for now. A good first workflow is one where the agent does the legwork and a human approves the outcome, so you get the time back without losing control.',
      points: [
        'Triage and routing of incoming requests or leads',
        'Research, summarising long threads, and prepping briefs',
        'Drafting first versions a person then reviews',
        'Reconciling and cleaning data across tools',
      ],
    },
    {
      h2: 'How do you roll out agentic workflows safely?',
      body:
        'Start narrow with one workflow that is well understood and high volume, prove it runs reliably, then expand. Keep visibility and control throughout, with clear guardrails and human checkpoints where they matter, so autonomy never means losing oversight. Train the team that works alongside the agents, because the value shows up when people trust the system and handle the exceptions well. Build it with your team, in your context, not in a black box.',
      points: [
        'Pick one high-volume, well-understood workflow to start',
        'Set guardrails and human checkpoints before you switch it on',
        'Measure reliability on real work before you widen the scope',
        'Train the people who own the exceptions and the sign-off',
      ],
    },
  ],
  tables: [
    {
      heading: 'Agentic AI vs traditional automation',
      intro:
        'Both reduce manual work, but they fail and improve in very different ways. Agentic workflows reason; scripts follow rules.',
      caption:
        'A comparison of agentic AI and traditional rules-based automation across how work is defined, how each handles the unexpected, unstructured input, improvement over time, and the human role.',
      columns: ['Dimension', 'Agentic AI', 'Traditional automation'],
      rows: [
        [
          'How work is defined',
          'You give it a goal and it decides the steps',
          'You script every step in advance',
        ],
        [
          'Handling the unexpected',
          'Reasons through new cases and asks for help when unsure',
          'Breaks the moment something falls outside the script',
        ],
        [
          'Unstructured input',
          'Reads emails, documents and chat the way a person would',
          'Needs clean, structured data in a fixed format',
        ],
        [
          'Improvement over time',
          'Gets better as you give feedback and refine the goals',
          'Stays fixed until someone rewrites the script',
        ],
        [
          'The human role',
          'People handle the exceptions and the judgement calls',
          'People babysit failures and patch the rules',
        ],
      ],
    },
  ],
  stats: [
    {
      claim:
        'Most employees already bring their own AI to work, usually without guidance, so the appetite for agents that do real work is there before any rollout starts.',
      value: '78%',
      source: 'Microsoft Work Trend Index',
      url: 'https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part',
      year: '2024',
    },
    {
      claim:
        'A study of 5,179 support agents found AI raised output 14% on average and 34% for newer staff, a clear sign of what happens when AI carries the routine work.',
      value: '+14–34%',
      source: 'Brynjolfsson, Li & Raymond, NBER/QJE',
      url: 'https://www.nber.org/papers/w31161',
      year: '2023',
    },
    {
      claim:
        'Daily AI users report far higher job satisfaction, focus and productivity, which is what you want when agents take the repetitive volume off people.',
      value: '+81%',
      source: 'Slack Workforce Index',
      url: 'https://slack.com/blog/news/the-new-ai-advantage',
      year: '2025',
    },
  ],
  faqs: [
    {
      q: 'What is the difference between an AI agent and a chatbot?',
      a: 'A chatbot responds when you prompt it. An AI agent is given a goal and carries out the steps to reach it on its own, using tools, making decisions, and only escalating when something needs a person. Agentic workflows chain several agents so an entire process runs without someone driving each step.',
    },
    {
      q: 'Are agentic workflows safe to run without a person watching?',
      a: 'They are safe when you build them that way. You start narrow on one well-understood workflow, set clear guardrails and human checkpoints, and prove reliability on real work before you widen the scope. The agent handles the routine volume; your people stay on the exceptions and the decisions that need judgement, so you keep oversight throughout.',
    },
    {
      q: 'How is agentic AI different from the automation we already have?',
      a: 'Traditional automation follows a script you write in advance and breaks when something falls outside it. Agentic AI takes a goal, reasons through the steps, reads messy real-world input, and asks for help when it is unsure. It also improves as you refine the goals, where a rules-based script stays fixed until someone rewrites it.',
    },
    {
      q: 'Have you actually run an autonomous operation, or just advised on one?',
      a: 'We run a full autonomous operation end to end for a company we operate, where agents handle the day-to-day work and escalate only what needs judgement. That gives us a live system to learn from, so the agentic workflows we build for clients are grounded in what holds up in production, not a diagram on a slide.',
    },
  ],
  related: [
    { label: 'Agentic AI & Autonomous Infrastructure', href: '/services/agentic-ai' },
    { label: 'Implementation & Enablement', href: '/services/ai-implementation' },
    { label: 'How to get your team using AI', href: '/insights/how-to-get-your-team-using-ai' },
  ],
};

/**
 * Ordered list of published articles. Cornerstone guides and comparison pages
 * are added in the following Phase 3 tasks; the index and [slug] route are
 * written to be empty-safe so this can start as an empty array.
 */
export const ARTICLES: Article[] = [
  getTeamUsingAi,
  aiReadinessChecklist,
  fractionalHeadOfAi,
  howAgenticWorkflowsWork,
];

/** Look up an article by slug. Returns undefined when not found. */
export function getBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

/** All article slugs, for generateStaticParams. */
export function getAllSlugs(): string[] {
  return ARTICLES.map((article) => article.slug);
}
