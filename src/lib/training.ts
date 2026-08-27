/**
 * The AI training catalogue.
 *
 * Single source of truth for the tracks sold on /services/ai-training: the
 * page, the module detail and the Course JSON-LD all read from here. Shaped
 * like SERVICES in constants.ts so each track can graduate to its own page
 * (/services/ai-training/<slug>) later without any content being rewritten.
 */

export type TrainingModule = {
  /** Short module title, shown as the list item. */
  title: string;
  /** One sentence on what the module actually covers. */
  detail: string;
};

export type TrainingTrack = {
  /** URL-safe id. Doubles as the on-page anchor (#claude-for-business). */
  slug: string;
  /**
   * Whether this track is led with.
   *
   * The three tools we take to market are Claude, ChatGPT and Microsoft 365
   * Copilot. Gemini and Google Workspace is still delivered for teams running
   * on Google, it just does not belong in the headline set: four near-identical
   * tool cards make the catalogue read as a list of logos rather than a
   * recommendation. Defaults to featured when omitted.
   */
  featured?: boolean;
  name: string;
  /** Where this sits in a rollout. Drives the badge on the card. */
  level: 'Leadership' | 'Core' | 'Advanced';
  /** Who should be in the room. */
  audience: string;
  /** Default delivery length in words, e.g. "Half day". */
  format: string;
  /**
   * ISO 8601 duration for the same length, used by courseWorkload in the
   * Course schema. Google rejects prose here, so the two are kept in step by
   * hand rather than derived.
   */
  workloadIso: string;
  /** Two sentences on the track. Also used as the Course description. */
  summary: string;
  /** What the team can do that they could not do before. */
  outcome: string;
  /** The named tools this track puts hands on. */
  tools: string[];
  modules: TrainingModule[];
};

export const TRAINING_TRACKS: TrainingTrack[] = [
  {
    slug: 'ai-strategy-and-governance',
    featured: true,
    name: 'AI Strategy & Governance',
    level: 'Leadership',
    audience: 'Founders, C-suite and department heads',
    format: '90-minute exec taster, or half day',
    workloadIso: 'PT4H',
    summary:
      'The session to run before you spend anything else. Leadership leaves aligned on what AI realistically does for this business, which work to point it at first, and the rules everyone else will be held to.',
    outcome:
      'A ranked use-case shortlist, a draft acceptable-use policy, and a 12-month roadmap with owners, budget and the numbers you will report on.',
    tools: ['Applies across all tools'],
    modules: [
      {
        title: 'What AI can and cannot do for your business',
        detail:
          'Separating real capability from the marketing, using your industry and your workflows as the examples.',
      },
      {
        title: 'Finding the use cases that pay',
        detail:
          'Scoring candidate workflows on hours saved, risk and effort to build, then ranking them so the first three are obvious.',
      },
      {
        title: 'Data, privacy and where your information goes',
        detail:
          'Which tools train on what you type, what belongs in them, what never does, and how the UAE picture differs from the US and EU.',
      },
      {
        title: 'Writing an acceptable use policy people follow',
        detail:
          'Approved tools, review steps, what always needs a human sign-off, and how to say it in one page rather than twelve.',
      },
      {
        title: 'Licensing and what you already pay for',
        detail:
          'Seats, tiers and the overlap between ChatGPT, Copilot and Gemini that most companies are quietly buying twice.',
      },
      {
        title: 'The 12-month roadmap',
        detail:
          'Sequencing, owners, budget and the measures that tell you it is working, set out quarter by quarter.',
      },
    ],
  },
  {
    slug: 'claude-for-business',
    featured: true,
    name: 'Claude for Business',
    level: 'Core',
    audience: 'Anyone whose week is documents, analysis or writing',
    format: 'Half day, or full day using your own files',
    workloadIso: 'PT4H',
    summary:
      'Claude is the strongest tool most teams have never properly opened. This track puts it on your contracts, tenders, reports and research, and sets up the parts that make it repeatable rather than a one-off chat.',
    outcome:
      'A shared Project holding your business context, a starter prompt library, and two or three recurring tasks rebuilt so they run in minutes.',
    tools: ['Claude', 'Claude Projects', 'Artifacts', 'Skills'],
    modules: [
      {
        title: 'Briefing Claude like a capable new hire',
        detail:
          'The structure that gets a usable answer first time: context, task, constraints and an example of good.',
      },
      {
        title: 'Projects',
        detail:
          'Loading your standing context once so every conversation starts already knowing your business, your clients and your tone.',
      },
      {
        title: 'Long documents at full length',
        detail:
          'Contracts, tenders, board packs and research read end to end, with the passages quoted back so you can check them.',
      },
      {
        title: 'Artifacts',
        detail:
          'Drafting documents, tables and small internal tools you can edit in place, keep and hand to someone else.',
      },
      {
        title: 'Skills',
        detail:
          'Teaching Claude a process once so the whole team runs it the same way every time, instead of everyone prompting differently.',
      },
      {
        title: 'Checking the work',
        detail:
          'Where Claude is strong, where it is weak, and how to spot an answer that is confidently wrong before it reaches a client.',
      },
    ],
  },
  {
    slug: 'chatgpt-for-business',
    featured: true,
    name: 'ChatGPT for Business',
    level: 'Core',
    audience: 'Whole teams, especially sales, marketing and admin',
    format: 'Half day, or full day using your own work',
    workloadIso: 'PT4H',
    summary:
      'The foundation track. Most people use ChatGPT as a better search box and stop there. This one covers the features that turn it into something the whole team can run a repeatable job on.',
    outcome:
      'Custom instructions set for each person, at least one Project per team, and a custom GPT built live for a job you do every week.',
    tools: ['ChatGPT', 'Projects', 'Custom GPTs', 'Data analysis'],
    modules: [
      {
        title: 'Prompting that holds up under pressure',
        detail:
          'Structure, context and worked examples, and why the answer quality is usually your brief rather than the model.',
      },
      {
        title: 'Projects and custom instructions',
        detail:
          'Setting things up so you stop re-explaining your company at the start of every conversation.',
      },
      {
        title: 'Custom GPTs',
        detail:
          'Packaging a repeatable job so a colleague can run it well without being good at prompting.',
      },
      {
        title: 'Files, spreadsheets and analysis',
        detail:
          'Pulling numbers out of PDFs and workbooks, and running the analysis you would otherwise queue for someone else.',
      },
      {
        title: 'Research you can trace',
        detail:
          'Getting sourced answers, checking them, and knowing which questions the tool should not be trusted with at all.',
      },
      {
        title: 'The parts of the toolkit nobody opens',
        detail:
          'Voice, images, screen and file handling, and where each genuinely saves time rather than being a demo.',
      },
    ],
  },
  {
    slug: 'microsoft-365-copilot',
    featured: true,
    name: 'Microsoft 365 Copilot',
    level: 'Core',
    audience: 'Teams already licensed for Microsoft 365',
    format: 'Half day',
    workloadIso: 'PT4H',
    summary:
      'You are probably already paying for this per seat. Copilot behaves differently in every app it sits in, which is why adoption stalls, so this track goes app by app and is blunt about where it is worth your time.',
    outcome:
      'Every person leaves with Copilot working on their real inbox, their real documents and their real spreadsheets, plus a clear rule for which job goes to which tool.',
    tools: ['Microsoft 365 Copilot', 'Outlook', 'Teams', 'Word', 'Excel', 'PowerPoint'],
    modules: [
      {
        title: 'Where Copilot actually lives',
        detail:
          'A tour of Copilot across Word, Excel, Outlook, Teams and PowerPoint, and an honest read on which ones earn their keep.',
      },
      {
        title: 'Outlook and Teams',
        detail:
          'Triaging a full inbox, catching up on a meeting you missed, and drafting replies that sound like you wrote them.',
      },
      {
        title: 'Word',
        detail:
          'First drafts built from documents you already have, rather than from a blank page and a vague prompt.',
      },
      {
        title: 'Excel',
        detail:
          'Formulas, cleanup and analysis described in plain language, including the cases where it still gets it wrong.',
      },
      {
        title: 'Grounding on your own files',
        detail:
          'How Copilot reads SharePoint and OneDrive, why permissions decide what it can see, and what that means for confidential work.',
      },
      {
        title: 'Copilot, ChatGPT or Claude',
        detail:
          'A simple rule for routing each job to the right tool, so you stop paying for three and only ever using one.',
      },
    ],
  },
  {
    slug: 'gemini-and-google-workspace',
    featured: false,
    name: 'Gemini & Google Workspace',
    level: 'Core',
    audience: 'Teams running on Google Workspace',
    format: 'Half day',
    workloadIso: 'PT4H',
    summary:
      'The equivalent track for Google shops. Gemini is wired through Docs, Sheets, Gmail and Drive, and the useful parts are rarely the ones Google puts in the announcement.',
    outcome:
      'Gemini working inside the documents and inboxes your team already uses, plus a NotebookLM notebook built on your own internal material.',
    tools: ['Gemini', 'Google Docs', 'Google Sheets', 'Gmail', 'NotebookLM'],
    modules: [
      {
        title: 'Gemini in Docs and Slides',
        detail:
          'Drafting, rewriting and building out decks from material you already hold, without leaving the file.',
      },
      {
        title: 'Gmail and Google Chat',
        detail:
          'Summarising long threads, drafting replies, and pulling the decision out of a channel nobody has read for a week.',
      },
      {
        title: 'Sheets and Canvas',
        detail:
          'Analysis, cleanup and building a working view of your numbers by describing what you want to see.',
      },
      {
        title: 'NotebookLM',
        detail:
          'Turning your policies, contracts and past projects into something the team can ask questions of and get sourced answers back.',
      },
      {
        title: 'Grounding on Drive',
        detail:
          'How Gemini reaches your files, what sharing settings change, and where that gets risky with client material.',
      },
      {
        title: 'Admin, data and what leaves your domain',
        detail:
          'The controls an admin actually has, and a straight answer on what Google does and does not do with your content.',
      },
    ],
  },
  {
    slug: 'ai-agents-and-automation',
    featured: true,
    name: 'AI Agents & Automation',
    level: 'Advanced',
    audience: 'Ops leads and whoever owns a process end to end',
    format: 'Full day, or a 4-week build programme',
    workloadIso: 'PT8H',
    summary:
      'For teams past the basics who want work happening without a person driving it. We build a real agent on one of your own processes during the session, rather than demoing someone else’s.',
    outcome:
      'One live agent running a real process, a map of the next three worth building, and the approval gates that keep a human in the loop.',
    tools: ['Claude', 'ChatGPT', 'Zapier', 'Make', 'Your existing stack'],
    modules: [
      {
        title: 'Automation, AI and agents',
        detail:
          'What the three words actually mean, and which one your problem needs, because it is usually the cheapest of the three.',
      },
      {
        title: 'Map the process before you automate it',
        detail:
          'Drawing the current process honestly, because automating a broken one just produces broken output faster.',
      },
      {
        title: 'Building your first agent',
        detail:
          'Triggers, steps, tools and the handover back to a person, built live on a process your team runs every week.',
      },
      {
        title: 'Human in the loop',
        detail:
          'Where to put approval gates so nothing reaches a client unchecked, and how to keep them from becoming a bottleneck.',
      },
      {
        title: 'Connecting your stack',
        detail:
          'Wiring the agent into email, CRM, sheets and storage, using the accounts and permissions you already have.',
      },
      {
        title: 'Running it on a Tuesday',
        detail:
          'Monitoring, failure, cost and ownership, so the thing still works in month six when nobody remembers building it.',
      },
    ],
  },
];

/** The tracks we lead with. Gemini is available on request, not on the shelf. */
export const FEATURED_TRACKS: TrainingTrack[] = TRAINING_TRACKS.filter(
  (t) => t.featured !== false,
);

/** Tracks delivered on request rather than led with. */
export const ON_REQUEST_TRACKS: TrainingTrack[] = TRAINING_TRACKS.filter(
  (t) => t.featured === false,
);

export type AudienceBand = {
  label: string;
  who: string;
  problem: string;
  /** Slugs of the tracks this band usually starts with. */
  tracks: string[];
};

/**
 * Who is in the room. Every serious provider splits their catalogue by
 * seniority rather than by tool, because the leadership question and the
 * "I have the licence and never open it" question need different sessions.
 */
export const AUDIENCE_BANDS: AudienceBand[] = [
  {
    label: 'Leadership',
    who: 'Founders, C-suite, department heads',
    problem:
      'You set the direction and carry the risk, and you are being asked to approve tools and budget without a clear picture of what any of it returns.',
    tracks: ['ai-strategy-and-governance'],
  },
  {
    label: 'Champions',
    who: 'Managers and the people others already ask',
    problem:
      'You will be the one the team comes to after we leave, so you need more depth than everyone else and a way to teach it on.',
    tracks: ['claude-for-business', 'ai-agents-and-automation'],
  },
  {
    label: 'Everyone else',
    who: 'The people doing the daily work',
    problem:
      'You have the licence, you have opened it twice, and nobody has shown you how it fits the job you actually do.',
    tracks: ['chatgpt-for-business', 'microsoft-365-copilot', 'gemini-and-google-workspace'],
  },
];

export type DeliveryPhase = {
  step: string;
  title: string;
  body: string;
};

/**
 * The before / during / after model. Named explicitly because the "after" is
 * the part that separates training that sticks from a day everyone enjoyed and
 * then forgot.
 */
export const DELIVERY_PHASES: DeliveryPhase[] = [
  {
    step: '01',
    title: 'Before: we learn the work',
    body: 'A short survey of the people attending, a call with you, and a look at how a few real tasks get done today. The agenda gets built from that. Nothing is pulled off a shelf.',
  },
  {
    step: '02',
    title: 'During: hands on your own tasks',
    body: 'Nobody watches a demo. People bring live work and leave having done it faster, with the guardrails explained as we go rather than as a policy slide at the end.',
  },
  {
    step: '03',
    title: 'After: the part most training skips',
    body: 'A recap pack and prompt library go out the same week, and we come back a few weeks later. Research puts the tipping point at five-plus hours of practice, so one session on its own was never going to hold.',
  },
];

export type TrainingFormat = {
  name: string;
  length: string;
  group: string;
  bestFor: string;
};

export const TRAINING_FORMATS: TrainingFormat[] = [
  {
    name: 'Exec taster',
    length: '90 minutes',
    group: 'Up to 30',
    bestFor: 'Getting leadership aligned before you commit budget to anything',
  },
  {
    name: 'Workshop',
    length: 'Half day',
    group: '4 to 25',
    bestFor: 'One team, one track, one tool, taken properly',
  },
  {
    name: 'Deep dive',
    length: 'Full day',
    group: '4 to 20',
    bestFor: 'Hands-on rebuilding of the work your team does every week',
  },
  {
    name: 'Programme',
    length: '4 to 6 weeks',
    group: 'Any size',
    bestFor: 'A whole-company rollout, track by track, with follow-ups built in',
  },
];

export type TrainingTool = { name: string; dotColor: string };

/**
 * The products the catalogue actually teaches.
 *
 * Deliberately not TECH_STACK from constants.ts: that list names vendors
 * (OpenAI, Anthropic, Google AI), which is the right framing for a partner
 * strip on the home page and the wrong one here. On a training page the
 * question is "do you teach the thing on my desk", so the chips carry product
 * names, and Gemini appears once rather than twice.
 */
export const TRAINING_TOOLS: TrainingTool[] = [
  { name: 'Claude', dotColor: '#D97757' },
  { name: 'ChatGPT', dotColor: '#10A37F' },
  { name: 'Microsoft 365 Copilot', dotColor: '#0078D4' },
  { name: 'Gemini', dotColor: '#4285F4' },
  { name: 'NotebookLM', dotColor: '#F59E0B' },
  { name: 'Perplexity', dotColor: '#20808D' },
];
