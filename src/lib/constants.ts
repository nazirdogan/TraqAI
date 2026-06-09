export type Service = {
  slug: string;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
};

export const SERVICES: Service[] = [
  {
    slug: 'ai-training',
    icon: '🎓',
    title: 'AI Training & Workshops',
    tagline: 'Hands-on sessions built around your team’s real work.',
    description:
      'Role-specific, practical workshops that take your people from hesitant to confident. They leave knowing exactly how to use AI in their job, not just what it is.',
    bullets: [
      'Tailored to your team’s actual workflows',
      'Hands-on, not theory',
      'Capability that stays in-house',
    ],
  },
  {
    slug: 'ai-consulting',
    icon: '🧭',
    title: 'Consultation & Strategy',
    tagline: 'Your fractional Head of AI.',
    description:
      'We audit your tools and workflows, find the highest-leverage uses, and give you a clear roadmap. Then we help you act on it.',
    bullets: [
      'AI audit of tools and workflows',
      'A prioritised, practical roadmap',
      'Senior partner embedded with your team',
    ],
  },
  {
    slug: 'ai-implementation',
    icon: '🔧',
    title: 'Implementation & Enablement',
    tagline: 'Wire AI into the tools you already pay for.',
    description:
      'We set up AI inside your real workflows, with the guardrails to use it safely, then make sure the team actually adopts it.',
    bullets: [
      'AI wired into existing tools',
      'Prompts, guardrails and safe usage',
      'Adoption support, not a handover doc',
    ],
  },
  {
    slug: 'agentic-ai',
    icon: '🤖',
    title: 'Agentic AI & Autonomous Infrastructure',
    tagline: 'Build a self-improving company.',
    description:
      'We build AI agents and agentic systems that run and improve on their own. We run a full autonomous operation end to end for a company, and we can build yours.',
    bullets: [
      'AI agents and agentic ecosystems',
      'Autonomous, self-improving workflows',
      'Built with you, not in a black box',
    ],
  },
];

export type ProcessStepData = {
  number: string;
  title: string;
  description: string;
};

export const PROCESS_STEPS: ProcessStepData[] = [
  { number: '0–30', title: 'Audit & map', description: 'We learn your tools, team and workflows, and find where AI saves the most time.' },
  { number: '30–60', title: 'Train your team', description: 'Role-specific, hands-on workshops so your people can actually use the tools.' },
  { number: '60–90', title: 'Implement & embed', description: 'We wire AI into real workflows with guardrails, and the team starts using it.' },
  { number: '90+', title: 'Measure & hand over', description: 'We track adoption and impact. Your team owns it. We stay as much or as little as you want.' },
];

export const FRAMEWORK_NAME = 'The Traq AI Enablement Sprint';

export type Benefit = {
  title: string;
  description: string;
};

export const BENEFITS: Benefit[] = [
  { title: 'Done with you, not to you', description: 'We work inside your context and your tools, alongside your team, not from behind a deck.' },
  { title: 'The capability stays in your team', description: 'We make ourselves redundant. Your people own what we build and learn to run it.' },
  { title: 'Senior operators, embedded', description: 'You work directly with people who do this for real, not a junior analyst on a markup.' },
  { title: 'Every engagement has a number on it', description: 'Hours saved, tools adopted, work shipped. We agree what we’re moving and we measure it.' },
];

export type OfferTier = { name: string; who: string; includes: string[] };
export const OFFER_TIERS: OfferTier[] = [
  { name: 'AI Readiness Audit', who: 'Start here.', includes: ['A fast, fixed-scope look at where AI helps most', 'Pairs with the free AI Readiness Assessment', 'A clear, prioritised next step'] },
  { name: 'Embedded Fractional Head of AI', who: 'Our flagship.', includes: ['We set the strategy, train, and implement', 'Embedded with your team', 'Accountable to outcomes'] },
  { name: 'Ongoing Partner / Oversight', who: 'For teams with some capability.', includes: ['Cadence and governance', 'A senior partner on call', 'Keep momentum without a full engagement'] },
];
export const OFFER_NOTE = 'Fixed scope, so you know what you’re getting. We start by showing value before any long commitment, and you keep everything we build. We take on a limited number of new partners each quarter so every team gets senior attention.';

export type ProblemCard = { line: string };
export const PROBLEMS: ProblemCard[] = [
  { line: 'You pay for ChatGPT and Copilot, but most of the team still doesn’t touch them.' },
  { line: 'You know AI could save hours, but nobody has time to work out where.' },
  { line: 'Every week there’s a new tool, and it’s hard to tell what’s worth it.' },
  { line: 'You don’t want to fall behind while competitors get ahead.' },
];

export type CaseStudy = { metric: string; label: string; who: string; story: string };
export const CASE_STUDIES: CaseStudy[] = [
  { metric: '60%', label: 'less manual data entry', who: 'A UAE logistics company', story: 'We replaced three spreadsheet-driven processes with one AI-assisted workflow the team runs daily.' },
  { metric: '3×', label: 'faster lead response', who: 'A B2B services team', story: 'Automated routing and AI-drafted replies cut first response from hours to minutes.' },
  { metric: '+43%', label: 'more qualified enquiries', who: 'A professional services firm', story: 'A sharper site plus an AI-scored intake meant the team only saw real opportunities.' },
];

export type TechBadgeData = {
  name: string;
  dotColor: string;
};

export const TECH_STACK: TechBadgeData[] = [
  { name: 'OpenAI', dotColor: '#10A37F' },
  { name: 'Anthropic', dotColor: '#D97757' },
  { name: 'Microsoft Copilot', dotColor: '#0078D4' },
  { name: 'Google AI', dotColor: '#F59E0B' },
  { name: 'Gemini', dotColor: '#4285F4' },
  { name: 'Perplexity', dotColor: '#20808D' },
];

export type ImpactMetric = { value: string; label: string; description: string; source: string; sourceUrl: string };
export const IMPACT_METRICS: ImpactMetric[] = [
  { value: '78%', label: 'bring their own AI to work', description: 'Most employees already use AI, usually without guidance or guardrails.', source: 'Microsoft Work Trend Index, 2024', sourceUrl: 'https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part' },
  { value: '43% → 72%', label: 'comfort doubles after training', description: 'Structured training nearly doubles the share of people comfortable using AI.', source: 'Slack', sourceUrl: 'https://slack.com/blog/productivity/try-this-experiment-with-your-team-at-work-ai-microlearning' },
  { value: '79% vs 67%', label: '5+ hours of training is the tipping point', description: 'People who get more than five hours of training become regular AI users at far higher rates.', source: 'BCG, 2025', sourceUrl: 'https://www.bcg.com/publications/2025/ai-at-work-momentum-builds-but-gaps-remain' },
  { value: '+14–34%', label: 'productivity lift', description: 'A study of 5,179 support agents found AI raised output 14% on average, and 34% for newer staff.', source: 'Brynjolfsson, Li & Raymond, NBER/QJE', sourceUrl: 'https://www.nber.org/papers/w31161' },
  { value: '+81%', label: 'higher job satisfaction', description: 'Daily AI users report far better satisfaction, focus and productivity.', source: 'Slack Workforce Index, 2025', sourceUrl: 'https://slack.com/blog/news/the-new-ai-advantage' },
  { value: '48%', label: 'name training as the #1 need', description: 'Employees rank training as the single most important factor for adopting AI.', source: 'McKinsey, 2025', sourceUrl: 'https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/superagency-in-the-workplace-empowering-people-to-unlock-ais-full-potential-at-work' },
];

export type TrustedPlatform = {
  name: string;
  dot: string;
};

export const TRUSTED_PLATFORMS: TrustedPlatform[] = [
  { name: 'OpenAI', dot: '#10A37F' },
  { name: 'Anthropic', dot: '#D97757' },
  { name: 'Microsoft Copilot', dot: '#0078D4' },
  { name: 'Google AI', dot: '#F59E0B' },
  { name: 'Gemini', dot: '#4285F4' },
  { name: 'Perplexity', dot: '#20808D' },
];

export const SERVICE_DROPDOWN_OPTIONS = [
  'AI Training & Workshops',
  'Consultation & Strategy',
  'Implementation & Enablement',
  'Agentic AI & Autonomous Infrastructure',
  'Just exploring',
] as const;

export const COMPANY = {
  name: 'Traq Collective',
  email: 'hello@traqcollective.com',
  phone: '+971 50 868 7196',
  whatsapp: '+971 50 868 7196',
  location: 'Remote-first · Global delivery',
  tagline: 'We help your team actually use the AI you already pay for.',
};
