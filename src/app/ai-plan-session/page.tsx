import type { Metadata } from 'next';
import Link from 'next/link';
import { OG_IMAGE } from '@/lib/metadata';
import { BreadcrumbsJsonLd, EventJsonLd, FaqPageJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';
import FaqBlock from '@/components/page/FaqBlock';
import {
  AI_PLAN_EVENT as EVENT,
  eventDateLong,
  eventDateShort,
  eventIsoEnd,
  eventIsoStart,
  eventTimeRange,
  seatsLine,
} from '@/lib/event';

const PATH = '/ai-plan-session';
const CANONICAL = `https://traqcollective.com${PATH}`;
const APPLY = '/ai-plan-session/apply';

const DATE_LONG = eventDateLong();
const TIME_RANGE = eventTimeRange();

const SHORT_DESCRIPTION = `A free, two hour, in person working session in ${EVENT.city} on ${DATE_LONG}. Leave with a scored, prioritised map of where AI actually saves your business hours and money in 2027. ${EVENT.capacity} seats, by application.`;

export const metadata: Metadata = {
  title: `${EVENT.name}: a working session in ${EVENT.city}`,
  description: SHORT_DESCRIPTION,
  alternates: { canonical: CANONICAL },
  keywords: [
    'AI workshop Dubai',
    'AI planning session Dubai',
    'AI strategy session UAE',
    'AI event Dubai 2026',
    'AI for business owners Dubai',
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: `${EVENT.name} | Traq Collective`,
    description: SHORT_DESCRIPTION,
    url: CANONICAL,
    type: 'website',
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: EVENT.name, url: PATH },
];

/** What they walk out holding. Deliberately the method and their own scoring, not a roadmap. */
const TAKEAWAYS: { title: string; body: string }[] = [
  {
    title: 'Your own workflows, scored',
    body: 'You bring one real piece of repetitive work with its actual numbers. You leave with it scored against the same four axes we use in a paid audit: frequency, pain, AI fit and safety.',
  },
  {
    title: 'A method you keep using',
    body: 'The scoring framework is taught live, with worked examples, and you take the worksheet home. Run it against the rest of your operation next week without us.',
  },
  {
    title: 'A ranked list, not a wish list',
    body: 'By the end you know which workflow to touch first and which ones to leave alone, in an order you can defend to your own team.',
  },
];

/** The two hours, attendee facing. Mirrors the run of show. */
const RUN_OF_SHOW: { time: string; title: string; body: string }[] = [
  {
    time: '0.00',
    title: 'Arrival, and your deposit back',
    body: 'Named seats, small tables. Your hold is returned as you walk in.',
  },
  {
    time: '0.10',
    title: 'The adoption gap',
    body: 'What UAE firms report about AI adoption against what is actually embedded in the work. Two minutes, sourced on the slide.',
  },
  {
    time: '0.20',
    title: 'The scoring framework, taught live',
    body: 'Frequency, pain, AI fit, safety. How to score a workflow honestly, with worked examples.',
  },
  {
    time: '0.50',
    title: 'Break',
    body: 'Coffee, and a chance to compare notes with the other people at your table.',
  },
  {
    time: '1.00',
    title: 'You do the work',
    body: 'Each table scores the workflow you submitted beforehand, then two more. I move table to table while you do it.',
  },
  {
    time: '1.35',
    title: 'Share out, and the 2027 lens',
    body: 'A few tables share their top scoring workflow, and we look at what is coming in the next year that changes the ranking.',
  },
  {
    time: '1.55',
    title: 'What happens next',
    body: 'One clear next step for anyone who wants it. Not a pitch.',
  },
];

/** How a seat actually works, end to end. The deposit is explained where it happens. */
const SEAT_STEPS: { title: string; body: string }[] = [
  {
    title: 'You apply',
    body: 'Nine questions, about five minutes. One of them asks for the single most repetitive thing your team does every day.',
  },
  {
    title: 'I read it myself',
    body: 'Every application, personally. You hear back within a day or two either way, by email. There is no automated decision anywhere in this.',
  },
  {
    title: 'If there is a seat, you secure it',
    body: `I send you a confirmation with a link to hold your seat with a fully refundable AED ${EVENT.depositAed}. The seat is not yours until that is done, and it is returned to you in the room.`,
  },
  {
    title: 'A week out, you send one workflow',
    body: 'The task from your application, roughly how many hours a week it costs and how many people touch it. It gets used in the room, on your own numbers.',
  },
  {
    title: 'You turn up and do the work',
    body: `Your deposit comes back as you arrive. Two hours, ${TIME_RANGE}, and you leave with your scored map.`,
  },
];

const FAQS: Qa[] = [
  {
    q: 'Is it actually free?',
    a: `Yes. Attending costs nothing. A confirmed seat is held with a fully refundable AED ${EVENT.depositAed}, which is returned to you when you walk in. It exists so the seats go to people who are actually coming, not as a fee.`,
  },
  {
    q: 'What happens to my deposit if I cannot make it?',
    a: `Tell me at least ${EVENT.cancellationNoticeHours} hours before and it is refunded in full, no questions, and your seat goes to someone on the waiting list. The only case where it is not returned is a seat that is simply never used, because that is the exact outcome the hold exists to prevent.`,
  },
  {
    q: 'Are you going to pitch me?',
    a: 'No. This is not a sales pitch and not a product demo. You will do real work on your own business for two hours. If it makes sense to keep going afterwards, we will talk about that separately, not in the room.',
  },
  {
    q: 'How big does my company need to be?',
    a: 'Most people in the room run businesses of roughly 20 to 200 people, but size is recorded for context, not used to decide. A lean team with genuinely repetitive work gets real value from this and makes the room better, not worse.',
  },
  {
    q: 'What if we do not pay for any AI tools yet?',
    a: 'Still apply. The question about existing tools tells me where you are starting from, it is not a gate. Teams paying for seats nobody uses and teams who have not started both leave with the same scored map.',
  },
  {
    q: 'Can I send someone from my team instead?',
    a: 'Seats are named, so tell me who is coming and I will confirm them instead of you. What does not work is a general invitation passed around, because the pre-session task and the table exercise depend on the person in the seat knowing the numbers.',
  },
  {
    q: 'Where exactly is it?',
    a: `${EVENT.venueNote} It is a working boardroom with small tables, not a ballroom with rows.`,
  },
  {
    q: 'What if I can only come for part of it?',
    a: 'Then wait for the next one. The scoring you came for happens in the second hour, and people arriving or leaving midway takes the room apart for everyone else. The application asks you to confirm you can stay for the whole session.',
  },
];

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div>
      <div className="eyebrow eyebrow-accent">{eyebrow}</div>
      <h2 className="section-title">{title}</h2>
      {sub ? <p className="section-sub">{sub}</p> : null}
    </div>
  );
}

function ApplyButton({ label = 'Apply for a seat' }: { label?: string }) {
  return (
    <Link
      href={APPLY}
      className="group inline-flex items-center justify-center gap-2.5 rounded-full focus-visible:rounded-full bg-traq-purple px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]"
    >
      {label}
      <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
        &rarr;
      </span>
    </Link>
  );
}

export default function AiPlanSessionLandingPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <EventJsonLd
        name={EVENT.name}
        description={SHORT_DESCRIPTION}
        url={PATH}
        startDate={eventIsoStart()}
        endDate={eventIsoEnd()}
        city={EVENT.city}
        capacity={EVENT.capacity}
      />
      <FaqPageJsonLd qas={FAQS} />

      {/* ---------- Hero ---------- */}
      <section className="relative px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          <div className="eyebrow eyebrow-accent">
            {`${EVENT.city} · ${DATE_LONG} · Two hours`}
          </div>

          <h1 className="mt-4 text-balance text-[34px] font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            {EVENT.name}
          </h1>

          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-soft sm:text-[18px]">
            {'You already pay for ChatGPT, Copilot or Gemini seats your team barely uses. In two hours, you leave with a scored, prioritised map of where AI actually saves your business hours and money in 2027, built on your own numbers, not a generic slide deck.'}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border-subtle py-6 sm:grid-cols-4">
            {[
              { k: 'When', v: `${eventDateShort()}, ${TIME_RANGE}` },
              { k: 'Where', v: `${EVENT.city}, in person` },
              { k: 'Room', v: seatsLine() },
              { k: 'To attend', v: 'Free, by application' },
            ].map((item) => (
              <div key={item.k}>
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
                  {item.k}
                </dt>
                <dd className="mt-1.5 text-[14px] font-semibold leading-snug text-ink">{item.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <ApplyButton />
            <p className="text-[13.5px] leading-relaxed text-ink-faint sm:max-w-[19rem]">
              {`Applications are read personally. You hear back within a day or two either way.`}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- What it is not ---------- */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[24px] border border-border-subtle bg-traq-tint p-6 sm:p-8">
            <div className="eyebrow eyebrow-accent">Before you apply</div>
            <p className="mt-4 text-[16px] leading-relaxed text-ink sm:text-[17px]">
              {'This is not a sales pitch and not a product demo. You will do real work on your own business for two hours. If it makes sense to keep going afterwards, we’ll talk about that separately, not in the room.'}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- What you leave with ---------- */}
      <section className="bg-bg-subtle px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="The output"
            title="What you walk out holding"
            sub="A working output, not a listening output. Everything below is built on numbers you bring, in the room, by you."
          />
          <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5">
            {TAKEAWAYS.map((item, i) => (
              <div key={item.title} className="note-card">
                <div className="note-card__num">{`0${i + 1}`}</div>
                <h3 className="mt-3 text-[16px] font-semibold leading-snug text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-[14px] leading-relaxed text-ink-faint">
            {'What you will not get is your implementation plan built live. Scoring your work honestly is the session. Sizing it in hours and dirhams, and deciding who owns what, is a separate piece of work and I will not pretend otherwise.'}
          </p>
        </div>
      </section>

      {/* ---------- Who it is for ---------- */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="The room" title="Who is in it" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-[20px] border border-border-subtle bg-white p-6 shadow-card">
              <h3 className="text-[15px] font-semibold text-ink">This is built for you if</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'You own or run a Dubai business, typically 20 to 200 people.',
                  'You are the person leading, or closest to leading, how AI and operations actually get done.',
                  'Your team repeats work every day that you already suspect a machine should be doing.',
                  'You can give the full two hours to it.',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-traq-purple"
                      aria-hidden="true"
                    />
                    <span className="text-[14.5px] leading-relaxed text-ink-soft">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[20px] border border-border-subtle bg-white p-6 shadow-card">
              <h3 className="text-[15px] font-semibold text-ink">It is not built for</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'AI vendors, agencies and consultancies. Applications from competitors are declined, politely and every time.',
                  'Anyone looking for a general introduction to what AI is. This assumes you are past that.',
                  'People who want to listen rather than work. Nobody sits at the back of a room this size.',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-signal-warn"
                      aria-hidden="true"
                    />
                    <span className="text-[14.5px] leading-relaxed text-ink-soft">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Run of show ---------- */}
      <section className="bg-bg-subtle px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="The two hours"
            title="How the session runs"
            sub="Structured to the minute, and it finishes on time."
          />
          <ol className="mt-10 space-y-0">
            {RUN_OF_SHOW.map((row) => (
              <li
                key={row.time}
                className="grid grid-cols-[56px_1fr] gap-4 border-b border-border-subtle py-5 last:border-0 sm:grid-cols-[80px_1fr] sm:gap-6"
              >
                <span className="pt-0.5 text-[13px] font-semibold tabular-nums text-traq-purple">
                  {row.time}
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold leading-snug text-ink">{row.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{row.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- How a seat works ---------- */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="The seat"
            title="How you get one"
            sub="Five steps, and you always know which one you are on. Nothing here happens automatically."
          />
          <ol className="mt-10 space-y-4">
            {SEAT_STEPS.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-[18px] border border-border-subtle bg-white p-5 shadow-card sm:gap-5 sm:p-6"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-traq-purple bg-traq-tint text-[13px] font-bold text-traq-purple-ink">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold leading-snug text-ink">{step.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* The deposit, explained where someone actually meets it. */}
          <div className="mt-10 rounded-[24px] border border-border-subtle bg-traq-tint p-6 sm:p-8">
            <div className="eyebrow eyebrow-accent">On the deposit</div>
            <p className="mt-4 text-[16px] font-semibold leading-relaxed text-ink sm:text-[17px]">
              {`A fully refundable AED ${EVENT.depositAed} hold to secure your seat, refunded when you arrive. This isn’t about the money, it’s so the seats go to people who are actually coming.`}
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                'It is taken only after I have offered you a seat, never as part of applying.',
                `Cancel with more than ${EVENT.cancellationNoticeHours} hours notice and it comes straight back, and your seat goes to the waiting list.`,
                'Turn up and it is returned in the room, before the session starts.',
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-traq-purple"
                    aria-hidden="true"
                  />
                  <span className="text-[14px] leading-relaxed text-ink-soft">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* The pre-session task. */}
          <div className="mt-5 rounded-[24px] border border-border-subtle bg-white p-6 shadow-card sm:p-8">
            <div className="eyebrow eyebrow-accent">The pre-session task</div>
            <h3 className="mt-4 text-[17px] font-semibold leading-snug text-ink">
              One workflow, three numbers, a week before
            </h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
              {'Once your seat is confirmed I ask you for one thing: the repetitive task you named in your application, roughly how many hours a week it costs, and how many people touch it. It takes about two minutes to send.'}
            </p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
              {'This is used live, on the day, on your own numbers. It is the difference between a session about AI in general and a session about your business, and it is why the room is capped at twenty rather than open.'}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <FaqBlock qas={FAQS} heading={`Questions about ${EVENT.name}`} />

      {/* ---------- Final CTA ---------- */}
      <section className="relative bg-bg-base px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="cta-panel">
            <div className="eyebrow eyebrow-accent">{seatsLine()}</div>
            <h2 className="mx-auto mt-4 max-w-2xl text-balance text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl md:text-4xl">
              {`Apply for a seat on ${eventDateShort()}`}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:mt-5 sm:text-base md:text-[17px]">
              {'Five minutes to apply. I read every one myself and reply within a day or two, either way.'}
            </p>
            <div className="mt-7 flex justify-center sm:mt-9">
              <ApplyButton />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
