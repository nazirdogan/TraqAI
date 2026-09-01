/**
 * Paid-search landing pages.
 *
 * One page per Google Ads ad group, built to the funnel blueprint (section 3).
 * Every page shares the same structure and differs only in the top third, so a
 * visitor lands on copy that repeats the query they typed. That query match is
 * the Quality Score lever and the trust signal in one.
 *
 * These pages are deliberately stripped: no navbar, no footer links out, no
 * sticky CTA bar. The only ways off the page are converting or closing the tab.
 * Chrome is suppressed by ChromeGate, which keys off the /lp prefix.
 *
 * Copy marked "approved" below is verbatim from 00-CANONICAL/01-Positioning.md
 * and must not be paraphrased into a new variant.
 */

export type LpSlug =
  | 'corporate-ai-training-dubai'
  | 'ai-training-cost-uae'
  | 'ai-consultant-dubai'
  | 'ai-governance-policy-uae';

export type LandingPage = {
  slug: LpSlug;
  /** Ad group this page is the destination for. */
  adGroup: string;
  /** Small uppercase label above the H1. */
  eyebrow: string;
  /** Repeats the search query almost verbatim. */
  h1: string;
  /** The approved positioning line. Identical on every page. */
  promise: string;
  /** The approved hero paragraph, trimmed to the ad group. */
  intro: string;
  /**
   * Which block comes first under the hero. The cost-intent page leads with the
   * offer, because that visitor came to size the thing and bounces if the first
   * screen is a quiz. The governance page leads with the deliverables, because
   * someone searching for an acceptable use policy came for the document and
   * will not sit through a readiness quiz before being shown one exists.
   * Structure is otherwise identical.
   */
  leadWith: 'assessment' | 'offer' | 'governance';
  /** <title> and meta description for the page. */
  title: string;
  description: string;
};

/** The three qualifiers, shown above the fold so the wrong visitor self-selects out. */
export const QUALIFIERS: { label: string; fits: boolean }[] = [
  { label: 'For teams of 10 to 200', fits: true },
  { label: 'Not individual courses', fits: false },
  { label: 'UAE and remote', fits: true },
];

export const LANDING_PAGES: Record<LpSlug, LandingPage> = {
  'corporate-ai-training-dubai': {
    slug: 'corporate-ai-training-dubai',
    adGroup: 'Commercial intent',
    eyebrow: 'Corporate AI training, UAE',
    h1: 'Corporate AI training in Dubai, for teams of 10 to 200',
    promise: 'You’ve got the AI tools. We help your team actually use them.',
    intro:
      'Most teams have AI tools they barely touch, so we come in, train your people, and wire AI into the way you already work, until the tools you pay for start saving real time. In person across Dubai and Abu Dhabi, or remote.',
    leadWith: 'assessment',
    title: 'Corporate AI Training in Dubai for Teams of 10 to 200',
    description:
      'Hands-on corporate AI training for UAE teams of 10 to 200. We train your people on their real work and wire AI into the tools you already pay for. Free 2-minute readiness score.',
  },
  'ai-training-cost-uae': {
    slug: 'ai-training-cost-uae',
    adGroup: 'Cost intent',
    eyebrow: 'AI training cost, UAE',
    h1: 'What shapes the cost of corporate AI training',
    promise: 'You’ve got the AI tools. We help your team actually use them.',
    intro:
      'Three things move the number: which format you run, how many people are in the room, and how much gets wired into your tools afterwards. The formats are below. We scope the rest through a short enquiry rather than a rate card, because a price quoted before anyone has looked at your workflows is a guess.',
    leadWith: 'offer',
    title: 'What Shapes the Cost of Corporate AI Training in the UAE',
    description:
      'What actually drives the cost of corporate AI training in the UAE: the format you run, the size of the room, and how much gets wired in. Scoped through a short enquiry.',
  },
  'ai-governance-policy-uae': {
    slug: 'ai-governance-policy-uae',
    adGroup: 'Governance and policy',
    eyebrow: 'AI governance and policy, UAE',
    h1: 'An AI acceptable use policy for UAE companies',
    promise: 'You’ve got the AI tools. We help your team actually use them.',
    intro:
      'Most AI policies are copied off the internet, run to twelve pages, and get ignored the week after they are circulated. We draft yours with your leadership in one session, on a single page, covering the tools your team already uses and the decisions that still need a human. In person across Dubai and Abu Dhabi, or remote.',
    leadWith: 'governance',
    title: 'An AI Acceptable Use Policy for UAE Companies',
    description:
      'A one-page AI acceptable use policy your team will actually follow, drafted with your leadership in a single session. Approved tools, review steps and human sign-off. Free 2-minute readiness score.',
  },
  'ai-consultant-dubai': {
    slug: 'ai-consultant-dubai',
    adGroup: 'Broadened',
    eyebrow: 'AI consultant, Dubai',
    h1: 'An AI consultant for UAE businesses',
    promise: 'You’ve got the AI tools. We help your team actually use them.',
    intro:
      'We train your team, wire AI into the tools you already pay for, and stay until your team can run it without us. Founder led, UAE based, in person across Dubai and Abu Dhabi or remote. Practitioners, not consultants.',
    leadWith: 'assessment',
    title: 'AI Consultant in Dubai: Practitioners, Not Consultants',
    description:
      'A founder-led AI consultant for UAE businesses. We train your team, wire AI into the tools you already pay for, and stay until you can run it without us.',
  },
};

export const LP_SLUGS = Object.keys(LANDING_PAGES) as LpSlug[];

/**
 * Group-size overrides for this page.
 *
 * Empty now that the catalogue itself says "Up to 30". Kept as the hook for any
 * future landing page that needs to state a size differently from the source.
 */
export const LP_GROUP_SIZES: Record<string, string> = {};

/**
 * The offer, without rates.
 *
 * Engagements are scoped through an enquiry, so the page shows what the formats
 * are and why each one exists rather than a price. A number out of context
 * either anchors low or scares off a buyer who has not scoped anything yet.
 */
export const OFFER_FORMATS: {
  name: string;
  length: string;
  who: string;
  why: string;
}[] = [
  {
    name: 'Exec taster',
    length: '90 minutes',
    who: 'Leadership, up to 30 people',
    why: 'Getting leadership aligned before you commit budget to anything. Past about 30 in a room nobody gets hands on anything, which is the whole point.',
  },
  {
    name: 'Half-day workshop',
    length: 'Half day',
    who: 'One team, 4 to 25 people',
    why: 'One team, one track, one tool, taken properly. The fastest way to prove the thing works before you commit anyone else’s calendar to it.',
  },
  {
    name: 'Full-day deep dive',
    length: 'Full day',
    who: 'One team, 4 to 20 people',
    why: 'Long enough to rebuild the work your team actually does every week, on their own files, rather than practising on a made-up example.',
  },
  {
    name: 'Multi-day programme',
    length: '4 to 6 weeks',
    who: 'Whole company, any size',
    why: 'A rollout track by track, with the follow-up sessions built in. Research puts the tipping point at five-plus hours of practice, which one day on its own never reaches.',
  },
];

/**
 * The proof block.
 *
 * Client B from 00-CANONICAL/08-Proof-and-Claims-Register.md, anonymised as the
 * register requires. This is the single most on-positioning story Traq owns and
 * it is not yet anywhere on the site. Never present an industry benchmark here
 * as a Traq result.
 */
export const PROOF = {
  heading: 'A Dubai studio got 37 hours a month back',
  metrics: [
    { value: '37 hrs', label: 'Returned to the team every month, down from 58 hours to 21' },
    { value: '100%', label: 'Of participants shipped a working, reusable AI skill' },
    { value: 'Zero', label: 'Vendor dependency. The capability stayed in the team' },
  ],
  attribution:
    'A Dubai creative studio and workspace business. Client name withheld on request, figures measured before and after the engagement.',
  founder:
    'Nazir Dogan, founder. You work directly with the person doing the build, not a junior analyst on a markup.',
  licence: 'Traq Collective, Meydan Free Zone licence 2644361.01.',
};

/** The strongest commercial line available, per the blueprint. */
export const RISK_REVERSAL = {
  heading: 'The AI Readiness Audit credits back in full',
  body: 'If you start any engagement within 30 days of the Audit, the full Audit fee comes off it. The first paid step costs you nothing if you carry on, and gives you a plan you own if you do not.',
};

/**
 * What the training actually is, in three lines.
 *
 * This page is the only destination paid traffic gets sent to, so it has to
 * answer "what do you actually do" without a services page to fall back on.
 * The three pillars are the shape of the catalogue: the leadership track, the
 * tool tracks, and the fact that every agenda is built from the client's own
 * work rather than pulled off a shelf.
 */
export const PILLARS: { title: string; body: string }[] = [
  {
    title: 'Strategy and governance',
    body: 'Leadership leaves aligned on what AI does for this business, which work to point it at first, and a one-page acceptable use policy people actually follow.',
  },
  {
    title: 'The tools already on your desk',
    body: 'Claude, ChatGPT and Microsoft 365 Copilot, taught as the products your team already has licences for, not as theory.',
  },
  {
    title: 'Built around your workflows',
    body: 'We survey the room and look at how a few real tasks get done today, then build the agenda from that. Nothing is pulled off a shelf.',
  },
];

/** The approved pivot line. Closes the page, then the CTA repeats. */
export const PIVOT_LINE =
  'You don’t need more AI tools. You need someone to make the ones you’ve got actually work, with your team, not for them.';

/**
 * What leadership walks out of the governance session holding.
 *
 * Every line is the AI Strategy & Governance track in src/lib/training.ts said
 * back in the visitor's words, not a new promise: the outcome field and four of
 * its six modules. A page that sells a policy has to show the policy exists, so
 * this block runs above the assessment rather than below it.
 */
export const GOVERNANCE_DELIVERABLES: { title: string; body: string }[] = [
  {
    title: 'A one-page acceptable use policy',
    body: 'Approved tools, review steps, what always needs a human sign-off, and how to say it in one page rather than twelve. Drafted with you in the session, not emailed over as a template to fill in yourself.',
  },
  {
    title: 'A ranked shortlist of use cases',
    body: 'Candidate workflows scored on hours saved, risk and effort to build, then ranked, so the first three are obvious and everything else can wait its turn.',
  },
  {
    title: 'A straight answer on where your data goes',
    body: 'Which tools train on what your team types, what belongs in them, what never does, and how the UAE picture differs from the US and the EU.',
  },
  {
    title: 'A 12-month roadmap',
    body: 'Sequencing, owners, budget and the measures that tell you it is working, set out quarter by quarter.',
  },
];

/** The line that frames the governance block. Sets up the deliverables above. */
export const GOVERNANCE_LEAD =
  'A policy nobody reads is not governance, it is paperwork. The session that produces one runs 90 minutes with your leadership, or half a day if you want the roadmap built in the room.';
