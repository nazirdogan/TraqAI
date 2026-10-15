import type { Metadata } from 'next';
import { FAA_PATH, KIT_KEY } from '@/lib/first-ai-assistant';
import { BTN, FunnelFooter, FunnelHeader } from '../_components/ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'The AI Assistant Starter Kit', robots: { index: false, follow: false } };

type Group = { role: string; intro: string; prompts: { t: string; p: string }[] };

const GROUPS: Group[] = [
  {
    role: 'Every morning (everyone)',
    intro: 'Paste these into Claude with your Gmail and Calendar connected.',
    prompts: [
      { t: 'The morning briefing', p: 'Look at my calendar for today and my emails from the last 24 hours. Give me one page: each meeting with a two-line prep note, the emails that genuinely need a reply from me (ignore newsletters and notifications), and anything I promised someone that is now due. Keep it short.' },
      { t: 'The three that matter', p: 'From my unread emails, pick the three that matter most and tell me why in one sentence each. For each one, draft a reply in my usual tone that I can edit.' },
      { t: 'Free up the afternoon', p: 'Look at my calendar for this week. Which meetings could be an email instead, and which could be shortened to 15 minutes? Draft a polite message for each one I could move.' },
      { t: 'Evening close-out', p: 'Look at what I sent and received today and what is on tomorrow. Tell me what got done, what slipped, and my top three for tomorrow. Flag anything I promised and have not done.' },
      { t: 'Friday review', p: 'Summarise my week from my email and calendar: the decisions made, the threads still open, who I owe a reply, and one thing to drop next week.' },
    ],
  },
  {
    role: 'Founders and business owners',
    intro: 'For the person who is the business.',
    prompts: [
      { t: 'Supplier and customer chasers', p: 'Find emails where I am waiting on someone for more than three days. Draft a friendly one-line chaser for each, in my voice.' },
      { t: 'Turn a long email into a decision', p: 'Read this email thread and give me: what they want, the options I have, and what you would recommend. Then draft my reply for the option I choose.' },
      { t: 'Quote or proposal first draft', p: 'Using this enquiry email, draft a short proposal: what they asked for, what we will do, the price as [PRICE], and the next step. Plain English, no buzzwords.' },
      { t: 'Policy in plain English', p: 'Rewrite this document so a new team member could understand it in two minutes. Keep every rule, cut the waffle.' },
      { t: 'Hire faster', p: 'Write a job advert for this role from my notes. Then write five interview questions that would show whether someone can actually do it.' },
      { t: 'Weekly numbers note', p: 'Here are this week’s numbers. Write a five-line update for my team: what went well, what did not, and the one thing we focus on next week.' },
      { t: 'Difficult reply', p: 'Draft a reply to this complaint that is calm, takes responsibility where we were wrong, and offers one clear fix. Under 120 words.' },
      { t: 'Meeting to actions', p: 'Here are my notes from a meeting. Turn them into a list of actions with an owner and a date, then draft the follow-up email.' },
    ],
  },
  {
    role: 'Professional services (accountants, lawyers, consultants, agents)',
    intro: 'Never paste client data you are not allowed to share. Use the connectors on a business plan and keep model training switched off.',
    prompts: [
      { t: 'Client status at a glance', p: 'Search my emails for [CLIENT NAME] from the last month. Summarise where things stand, what I owe them, what they owe me, and the next step.' },
      { t: 'Explain it simply', p: 'Explain this to a client who is not an expert, in five sentences, with no jargon. Then give me a one-line version for a text message.' },
      { t: 'Engagement letter first draft', p: 'From these notes, draft the scope section of an engagement letter: what is included, what is not, and what we need from the client. Mark anything you are unsure of with [CHECK].' },
      { t: 'Document checklist chaser', p: 'This client still owes me these documents: [LIST]. Draft a friendly reminder that makes it easy for them to send everything in one go.' },
      { t: 'Prep before a client call', p: 'I have a call with [CLIENT] at [TIME]. From my emails and calendar, give me a one-minute brief: last contact, open issues, and two questions I should ask.' },
      { t: 'Second pair of eyes', p: 'Read this draft and list anything unclear, inconsistent or missing. Do not rewrite it, just point to the lines.' },
      { t: 'Turn a call into a summary', p: 'Here is my rough note from a client call. Write the summary email I would send them, with actions and dates.' },
      { t: 'Price-change message', p: 'Draft a short, confident email telling existing clients our fees change from [DATE], explaining the reason in one line.' },
    ],
  },
  {
    role: 'Senior leaders and managers',
    intro: 'Less inbox, more judgement.',
    prompts: [
      { t: 'Board or exec update', p: 'From these notes, write a one-page update: headline, three things that moved, two risks, and what I need from the group.' },
      { t: 'Read this for me', p: 'Summarise this long report in ten bullet points, then tell me the three questions I should ask its author.' },
      { t: 'Team one-to-one prep', p: 'Look at my recent emails with [NAME]. What have they been working on, what might be blocking them, and what should I ask in our one-to-one?' },
      { t: 'Delegate well', p: 'Turn this task into a clear brief for my team: the goal, what good looks like, the deadline, and what they can decide without me.' },
      { t: 'Say no politely', p: 'Draft a reply declining this request, keeping the relationship warm and offering one alternative.' },
      { t: 'Decision memo', p: 'Help me decide between these options. Lay out the pros, cons, costs and risks of each in a table, then the questions I still need answered.' },
      { t: 'Catch up after time off', p: 'I have been away for a week. From my inbox and calendar, tell me what I missed, what needs me now, and what I can safely ignore.' },
      { t: 'Learn a topic fast', p: 'Teach me the basics of [TOPIC] in 10 minutes as if I am a smart beginner. Then quiz me with five questions.' },
      { t: 'Speech or presentation outline', p: 'Give me a five-minute talk outline on [TOPIC] for [AUDIENCE]: the opening line, three points with one example each, and the close.' },
    ],
  },
];

const CHECKLIST = [
  'Claude Pro (about $20 a month, paid to Anthropic) and the Claude desktop app installed.',
  'Settings, then Privacy: switch "Help improve Claude" off if you do not want your chats used for training.',
  'Settings, then Connectors: connect Gmail and Google Calendar (or Microsoft 365, once your IT admin approves it).',
  'Ask Claude to draft, not send. You read every email before it goes.',
  'Create a Project called "My assistant" and paste your instructions (the voice guide below) into it, so every chat starts from them.',
  'Run the morning briefing prompt once by hand. Fix what you do not like by telling it, in plain words.',
  'When it is right, set it to run on a schedule while the desktop app is open, or keep it as your first click every morning.',
];

export default function Page({ searchParams }: { searchParams: { k?: string } }) {
  if (searchParams.k !== KIT_KEY) {
    return (
      <div className="bg-bg-base">
        <FunnelHeader />
        <section className="px-5 py-24 text-center sm:px-8">
          <h1 className="section-title">This kit comes with the VIP Pass</h1>
          <p className="section-sub mx-auto mt-4">It is included with the VIP Pass, the live build and the 1:1 setup.</p>
          <a className={`${BTN} mt-8`} href={FAA_PATH}>
            See the free session
          </a>
        </section>
        <FunnelFooter />
      </div>
    );
  }

  return (
    <div className="bg-bg-base">
      <FunnelHeader chip="Starter Kit" />
      <section className="px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-[34px] font-semibold leading-tight text-ink sm:text-[44px]">The AI Assistant Starter Kit</h1>
          <p className="mt-4 text-[17px] leading-8 text-ink-soft">Thirty prompts, the setup checklist and the voice guide. Copy, paste, then edit the parts in [BRACKETS].</p>

          <h2 className="mt-12 text-[24px] font-semibold text-ink">Setup checklist</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-7 text-ink-soft">
            {CHECKLIST.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>

          <h2 className="mt-12 text-[24px] font-semibold text-ink">The voice guide: the one setting that changes everything</h2>
          <p className="mt-3 text-[15px] leading-7 text-ink-soft">AI writes like a robot because it has never seen how you write. Fix it once:</p>
          <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-border-subtle bg-bg-subtle p-5 text-[14px] leading-6 text-ink">
{`Here are five emails I have written. Study them and write me a short style guide for how I write: sentence length, greetings and sign-offs, how formal I am, words I use, and words I never use. From now on, write every draft in this style.

[PASTE 5 OF YOUR OWN SENT EMAILS]`}
          </pre>
          <p className="mt-3 text-[15px] leading-7 text-ink-soft">Paste the style guide it writes into your &ldquo;My assistant&rdquo; Project instructions. Every draft after that sounds like you.</p>

          {GROUPS.map((g) => (
            <div key={g.role} className="mt-12">
              <h2 className="text-[24px] font-semibold text-ink">{g.role}</h2>
              <p className="mt-2 text-[15px] text-ink-faint">{g.intro}</p>
              <div className="mt-5 space-y-4">
                {g.prompts.map((x) => (
                  <div key={x.t} className="rounded-2xl border border-border-subtle bg-white p-5 shadow-card">
                    <h3 className="text-[16px] font-semibold text-ink">{x.t}</h3>
                    <p className="mt-2 select-all text-[15px] leading-7 text-ink-soft">{x.p}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <FunnelFooter />
    </div>
  );
}
