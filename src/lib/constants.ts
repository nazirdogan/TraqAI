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
    slug: 'ai-integration-development',
    icon: '🧠',
    title: 'AI Integration & Development',
    tagline: 'Off-the-shelf models or bespoke systems — plugged into how you already work.',
    description:
      'We connect the leading AI providers to the platforms that run your business, and where off-the-shelf stops being enough, we design and build custom AI systems around your domain, data and compliance surface.',
    bullets: [
      'OpenAI, Anthropic, Azure, Google AI + bespoke models',
      'Internal AI assistants, copilots and inference pipelines',
      'Pilot live in 1–3 weeks — cloud or on-premise',
    ],
  },
  {
    slug: 'process-automation',
    icon: '⚙️',
    title: 'Process Automation',
    tagline: 'Kill the repetitive work. Keep the judgement.',
    description:
      'We map the repetitive human steps in your business and replace them with reliable, auditable automations your team can trust.',
    bullets: [
      'Lead routing and auto follow-up',
      'WhatsApp, email and form workflows',
      'Fewer mistakes, faster turnaround',
    ],
  },
  {
    slug: 'data-intelligence',
    icon: '📊',
    title: 'Data Intelligence',
    tagline: 'Turn raw data into decisions.',
    description:
      'We build the pipelines and dashboards that surface what matters — so the team stops arguing with spreadsheets and starts acting on evidence.',
    bullets: [
      'AI-enriched analytics pipelines',
      'Data warehouse and BI integrations',
      'Insight dashboards for operators',
    ],
  },
  {
    slug: 'erp-systems',
    icon: '🏗️',
    title: 'ERP Systems',
    tagline: 'Custom ERPs for the operations spreadsheets are buckling under.',
    description:
      'We design and build bespoke ERP systems — or extend the one you already run — so operations, finance, inventory and people finally live in one platform your team actually uses.',
    bullets: [
      'Custom-built or extend SAP, Odoo, NetSuite, Dynamics',
      'Operations, finance, inventory and HR in one place',
      'Designed around your workflow, not a generic template',
    ],
  },
  {
    slug: 'business-websites',
    icon: '🌐',
    title: 'Business Websites & Redesigns',
    tagline: 'Conversion-focused sites that respect your brand.',
    description:
      'Clear messaging, sharp visual design, and engineering that keeps the site fast, measurable and easy to evolve.',
    bullets: [
      'Clear messaging and modern design',
      'Landing pages and funnels built to convert',
      'Mobile-ready and analytics-instrumented',
    ],
  },
  {
    slug: 'secure-ai-consultation',
    icon: '🔒',
    title: 'Secure AI & Consultation',
    tagline: 'Ship AI without handing over your data.',
    description:
      'A privacy-first architecture plus ongoing guidance so AI becomes a durable capability inside your business — not a vendor lock-in.',
    bullets: [
      'Encryption at rest and in transit',
      'RBAC, SSO and full audit logging',
      'Team training and hands-on support',
    ],
  },
];

export type ProcessStepData = {
  number: string;
  title: string;
  description: string;
};

export const PROCESS_STEPS: ProcessStepData[] = [
  {
    number: '01',
    title: 'Understand Your Business',
    description:
      'We start by mapping how your team actually works today. Then we identify where AI or automation would create real, measurable leverage.',
  },
  {
    number: '02',
    title: 'Design the Solution',
    description:
      'We architect a tailored stack — models, integrations, security, data flows — and share a clear plan before a single line of code is written.',
  },
  {
    number: '03',
    title: 'Build & Pilot',
    description:
      'Your team gets a working pilot in 1–3 weeks. We iterate in public with you, not behind a curtain, until it genuinely fits the workflow.',
  },
  {
    number: '04',
    title: 'Launch & Support',
    description:
      'We roll the system into production, train your team, and stay on as a technical partner to evolve the platform as your business grows.',
  },
];

export type Benefit = {
  title: string;
  description: string;
};

export const BENEFITS: Benefit[] = [
  {
    title: 'Practical Over Theoretical',
    description:
      'We ship working systems, not slide decks. Every project ends with something your team actually uses.',
  },
  {
    title: 'Full-Stack Capability',
    description:
      'AI, automation, data, infrastructure and front-end — one team, one accountable delivery surface.',
  },
  {
    title: 'Security & Data Ownership',
    description:
      'Your data stays yours. We architect for privacy, compliance, and zero vendor lock-in from day one.',
  },
  {
    title: 'Results You Can Measure',
    description:
      'Every engagement has a number on it. Time saved, revenue moved, response time cut — we prove it.',
  },
];

export type TechBadgeData = {
  name: string;
  dotColor: string;
};

export const TECH_STACK: TechBadgeData[] = [
  { name: 'OpenAI', dotColor: '#10A37F' },
  { name: 'Anthropic', dotColor: '#D97757' },
  { name: 'Azure OpenAI', dotColor: '#3B82F6' },
  { name: 'Google AI', dotColor: '#F59E0B' },
  { name: 'AWS', dotColor: '#FF9900' },
  { name: 'GCP', dotColor: '#4285F4' },
  { name: 'Meta Llama', dotColor: '#7C63F0' },
  { name: 'Supabase', dotColor: '#3ECF8E' },
];

export type ImpactMetric = {
  value: string;
  label: string;
  description: string;
  industry: string;
};

export const IMPACT_METRICS: ImpactMetric[] = [
  {
    value: '60%',
    label: 'Less manual data entry',
    description:
      'A logistics client replaced three spreadsheet-driven processes with a single AI-assisted workflow.',
    industry: 'Logistics',
  },
  {
    value: '3×',
    label: 'Faster lead response',
    description:
      'Automated routing and AI-drafted replies cut the first-response window from hours to minutes.',
    industry: 'B2B SaaS',
  },
  {
    value: '+43%',
    label: 'Increase in qualified enquiries',
    description:
      'A redesigned site plus AI-scored intake form meant the sales team only ever saw real opportunities.',
    industry: 'Professional Services',
  },
];

export type PipelineStep = {
  icon: string;
  label: string;
  description: string;
  status: string;
};

export const HERO_PIPELINE: PipelineStep[] = [
  {
    icon: '🧠',
    label: 'AI Model Integration',
    description: 'OpenAI, Anthropic and Azure routed through one layer.',
    status: 'Live',
  },
  {
    icon: '⚙️',
    label: 'Workflow Automation',
    description: 'Tickets, leads and follow-ups running on autopilot.',
    status: 'Active',
  },
  {
    icon: '📊',
    label: 'Data Intelligence',
    description: 'Daily insight reports generated without a human hand.',
    status: 'Syncing',
  },
  {
    icon: '🌐',
    label: 'Digital Presence',
    description: 'A site that converts, built to be measured.',
    status: 'Shipped',
  },
];

export type TrustedPlatform = {
  name: string;
  dot: string;
};

export const TRUSTED_PLATFORMS: TrustedPlatform[] = [
  { name: 'OpenAI', dot: '#10A37F' },
  { name: 'Anthropic', dot: '#D97757' },
  { name: 'Azure', dot: '#0078D4' },
  { name: 'Google AI', dot: '#F59E0B' },
  { name: 'AWS', dot: '#FF9900' },
  { name: 'GCP', dot: '#4285F4' },
  { name: 'Meta Llama', dot: '#7C63F0' },
];

export type HeroStat = {
  value: string;
  label: string;
};

export const HERO_STATS: HeroStat[] = [
  { value: '1–3wk', label: 'pilot delivery' },
  { value: '40%+', label: 'avg time saved' },
  { value: '6', label: 'AI platforms' },
];

export const SERVICE_DROPDOWN_OPTIONS = [
  'AI Integration & Development',
  'Process Automation',
  'Data Intelligence',
  'ERP Systems',
  'Business Websites & Redesigns',
  'Secure AI & Consultation',
  'Full-stack package',
  'Just exploring',
] as const;

export const COMPANY = {
  name: 'Traq Collective',
  email: 'hello@traqcollective.com',
  phone: '+1 (555) 018-4412',
  whatsapp: '+1 (555) 018-4412',
  location: 'Remote-first · Global delivery',
  tagline: 'We wire AI into how your business actually works.',
};

export const DELIVERY_TIMELINE = [
  { label: 'Discovery', range: 'Week 1', width: '16%' },
  { label: 'Build + Pilot', range: 'Weeks 2–4', width: '38%' },
  { label: 'Production', range: 'Weeks 5–8', width: '46%' },
];
