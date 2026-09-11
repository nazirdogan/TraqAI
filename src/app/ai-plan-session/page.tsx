import type { Metadata } from 'next';
import Link from 'next/link';
import { OG_IMAGE } from '@/lib/metadata';
import { BreadcrumbsJsonLd, EventJsonLd, FaqPageJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';
import FaqBlock from '@/components/page/FaqBlock';
import EventFactsCard from './_components/EventFactsCard';
import HostCredibility from './_components/HostCredibility';
import RunOfShow, { type ShowRow } from './_components/RunOfShow';
import { Group, Item, Reveal } from './_components/Reveal';
import {
  AI_PLAN_EVENT as EVENT,
  eventDateLong,
  eventDateShort,
  eventIsoEnd,
  eventIsoStart,
  eventTimeRange,
} from '@/lib/event';
import { seatsLine } from '@/lib/intake/seatcount';
import { getSeatCount } from '@/lib/seats';

/** The seat count is read from Stripe at most once a minute. */
export const revalidate = 60;

const PATH = '/ai-plan-session';
const CANONICAL = `https://traqcollective.com${PATH}`;
const SIGN_UP = '/ai-plan-session/sign-up';

const DATE_LONG = eventDateLong();
const TIME_RANGE = eventTimeRange();

const SHORT_DESCRIPTION = `AI stalled because you never made three decisions: AI strategy, AI safety and governance, AI training. Two hours in person in ${EVENT.city} on ${DATE_LONG} to make all three and leave knowing exactly how to roll out your AI strategy. ${EVENT.capacity} seats, each secured with a refundable AED ${EVENT.depositAed}.`;

export const metadata: Metadata = {
  title: `3 AI decisions before 2027: a working session in ${EVENT.city}`,
  description: SHORT_DESCRIPTION,
  alternates: { canonical: CANONICAL },
  keywords: [
    'AI workshop Dubai',
    'AI strategy session Dubai',
    'AI governance workshop UAE',
    'AI training for business Dubai',
    'AI event Dubai 2026',
    'AI strategy 2027',
    'AI for founders and GMs Dubai',
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: `3 AI decisions before 2027: a working session in ${EVENT.city} | Traq Collective`,
    description: SHORT_DESCRIPTION,
    url: CANONICAL,
    type: 'website',
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: EVENT.name, url: PATH },
];

/** The three decisions, in the order the room makes them. This is the spine of the session and of the page. */
const TAKEAWAYS: { title: string; body: string }[] = [
  {
    title: 'AI strategy, about 37 minutes',
    body: 'You score three candidate pieces of AI work and kill one, out loud. The rejection is the exercise. Then you write the number: what gets measured, which system it comes out of, and what it reads at month six. Then the shape of the year.',
  },
  {
    title: 'AI safety and governance, about 27 minutes',
    body: 'You define two lines by consequence, not by policy language: what nobody may paste into an AI tool, and what happens if they do. Then three questions for whoever runs your IT: what an AI assistant could read today that it should not, how many files carry a sensitivity label, who last reviewed sharing permissions. The eight vendor questions, on paper.',
  },
  {
    title: 'AI training, about 25 minutes',
    body: 'Who gets trained on AI first, chosen by role rather than by enthusiasm. The syllabus of four. The ban list: what nobody is allowed to teach your people about AI. A trio challenge round. Then the date it starts.',
  },
];

/** How the two hours run, attendee facing. The mechanics are the differentiator, so they carry the weight here. */
const RUN_OF_SHOW: ShowRow[] = [
  {
    time: '0.00',
    title: 'Arrival, and your deposit back',
    body: 'Named seats, set out in trios rather than tables. Your hold is returned as you walk in. The card in front of you names a role, never a person, and that is how you are addressed for the two hours.',
  },
  {
    time: '0.08',
    title: 'The last whole-room discussion',
    body: 'Eight minutes: why AI stalled, and the number behind it. Firm effects explain nearly twice as much of the variation in AI outcomes as worker effects (R squared 0.181 against 0.092). Industry explains 2.9 per cent. The gap sits in three AI decisions that belong to you. After minute eight nobody addresses the whole room again, including me.',
  },
  {
    time: '37 min',
    title: 'AI strategy, in your trio',
    body: 'You score three candidate pieces of AI work with two other operators, then kill one out loud. Nobody saves it for the corridor. Then you write your number into the record while the timer runs.',
  },
  {
    time: '27 min',
    title: 'AI safety and governance, by consequence',
    body: 'You define your two lines in your own words, with your trio pushing on what happens when someone crosses one. Then the three IT questions. Roughly one in ten files carries a sensitivity label, so the second answer is usually the uncomfortable one. The eight vendor questions go into your hand on paper, the only printed thing in the room.',
  },
  {
    time: '25 min',
    title: 'AI training, with a challenge round',
    body: 'You choose who gets trained on AI first and defend it to your trio, who push back by role rather than by enthusiasm. Then you write the date it starts. The central bank study is why this is a decision and not an afterthought: teams that were trained showed a 17 per cent gain; untrained teams lost 12 per cent and reported no time saved.',
  },
  {
    time: '52 min',
    title: 'The writing, in total',
    body: 'Of the 120 minutes, 52 are the room writing its AI decisions into the record, not listening. The record is digital and it is yours: you fill it in as you go, from the link that reached you before the day.',
  },
  {
    time: '2.00',
    title: 'The timer ends it',
    body: 'The timer moves the room on, not me. A block closes when the clock says so, whether or not your trio has finished arguing. It finishes on time, and you leave with all three AI decisions written down and the steps to roll them out.',
  },
];

/** How a seat actually works, end to end. The deposit is explained where it happens. */
const SEAT_STEPS: { title: string; body: string }[] = [
  {
    title: 'You fill in the form',
    body: 'Eight questions, about two minutes. One asks where AI has stalled in your business. One asks your position, and that one decides: the room is for the people who own the three AI decisions, and the form says so on the spot if it is not for you. No AI vendors, agencies or consultancies.',
  },
  {
    title: 'You secure your seat',
    body: `Straight from the form, a fully refundable AED ${EVENT.depositAed} hold. Your seat is not secured until that is done, and it comes back to you in the room when you arrive.`,
  },
  {
    title: 'You get the link, then you send one form',
    body: 'The address and the link to your decision record reach you before the day, not on it. The pre-session form asks for one piece of work and two numbers about it, and it closes 48 hours before the session.',
  },
  {
    title: 'You turn up and decide',
    body: `Your deposit comes back as you arrive. Two hours, ${TIME_RANGE}, three AI decisions, and you leave with every one of them written in your own record.`,
  },
];

const FAQS: Qa[] = [
  {
    q: 'Is it actually free?',
    a: `Yes. Attending costs nothing. A seat is secured with a fully refundable AED ${EVENT.depositAed}, which is returned to you when you walk in. It exists so the seats go to people who are coming, not as a fee.`,
  },
  {
    q: 'What happens to my deposit if I cannot make it?',
    a: `Tell me at least ${EVENT.cancellationNoticeHours} hours before and it is refunded in full, no questions, and your seat goes to someone on the waiting list. The only case where it is not returned is a seat that is simply never used, because that is the exact outcome the hold exists to prevent.`,
  },
  {
    q: 'Are you going to pitch me?',
    a: 'No. Nobody addresses the whole room after minute eight, including me. You spend 52 of the 120 minutes writing, in a trio, on your own three AI decisions. If it makes sense to keep going afterwards, we will talk about that separately, not in the room.',
  },
  {
    q: 'What do I leave with?',
    a: 'Your decision record: the three AI decisions and the steps to roll them out, digital, filled in by you during the session, sent to you by link. The link reaches you with your confirmation, not on the day. And one piece of paper, the eight vendor questions from the safety and governance block. Nothing else is printed.',
  },
  {
    q: 'What does the pre-session form ask, and when does it close?',
    a: 'One piece of work you would put AI on, roughly how many hours a week it costs, and how many people touch it. About two minutes. It closes 48 hours before the session, so the AI strategy block starts from your numbers rather than a blank page.',
  },
  {
    q: 'Who does the form turn away?',
    a: 'Two groups. People in our own line of work: AI vendors, agencies and consultancies. And people who cannot make the three AI decisions the session ends with, so managers and specialists without the authority to change how the business works. The work is real; the record is only worth something signed by the person who can act on it. If that is your MD or GM, send them the page.',
  },
  {
    q: 'Does company size matter, or whether we already pay for AI tools?',
    a: 'Neither decides anything. Both questions on the form tell me where you are starting from. A lean team where the three AI decisions are yours gets more from the room than a large one where they are not, and a business that has never paid for an AI seat leaves with the same record as one paying for fifty.',
  },
  {
    q: 'Can I send someone from my team instead, or come for part of it?',
    a: 'Seats are named, so the person coming fills in the form in their own name, and the position question applies to them. One seat per company where possible. And no to part of it: the three AI decisions run back to back on a timer, and a trio that loses a member halfway is two people doing three people\'s work. The form asks you to confirm you can stay for the whole two hours.',
  },
  {
    q: 'Where exactly is it?',
    a: `${EVENT.venueNote} It is a working room set out for trios, not a ballroom with rows.`,
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

/**
 * The recurring wide-page shape: a heading pinned to a left rail that stays in
 * view while its content runs the rest of the width. Collapses to a plain
 * stack below `lg`, where there is no spare width for a rail to hold.
 */
function SplitSection({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[280px_1fr] lg:gap-16 xl:gap-20">
      <Reveal className="lg:sticky lg:top-28 lg:self-start">
        <SectionHeading eyebrow={eyebrow} title={title} sub={sub} />
      </Reveal>
      <div className="mt-10 lg:mt-0">{children}</div>
    </div>
  );
}

/**
 * The one call to action, everywhere it appears. A full room sends people to
 * the same page, which by then shows the waiting list instead of the form, so
 * the label changes to say what they will actually find there.
 */
function SignUpButton({ full = false }: { full?: boolean }) {
  const label = full ? 'Join the waiting list' : 'Reserve your seat';
  return (
    <Link
      href={SIGN_UP}
      className="group inline-flex items-center justify-center gap-2.5 rounded-full focus-visible:rounded-full bg-traq-purple px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]"
    >
      {label}
      <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
        &rarr;
      </span>
    </Link>
  );
}

export default async function AiPlanSessionLandingPage() {
  const seats = await getSeatCount();
  const full = seats.remaining !== null && seats.remaining <= 0;
  const seatsNow = seatsLine(EVENT.capacity, seats.remaining);

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
      <section className="relative px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:px-10 lg:pt-44 xl:px-16">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-16 xl:gap-20">
          <div className="max-w-2xl">
            <Reveal mode="load" className="eyebrow eyebrow-accent">
              {`${EVENT.city} · ${DATE_LONG} · Two hours`}
            </Reveal>

            <Reveal
              mode="load"
              as="h1"
              delay={0.08}
              className="mt-5 text-balance text-[34px] font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
            >
              {'3 AI decisions before 2027: how to roll out a successful AI strategy'}
            </Reveal>

            <Reveal
              mode="load"
              as="p"
              delay={0.16}
              className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-soft sm:text-[18px] lg:text-[19px]"
            >
              {'AI stalled because you never made three decisions: strategy, safety and governance, training. In two hours you make all three, write them into your own decision record, and leave knowing exactly how to roll out your AI strategy.'}
            </Reveal>

            <Reveal
              mode="load"
              delay={0.24}
              className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            >
              <SignUpButton full={full} />
              <p className="text-[13.5px] leading-relaxed text-ink-faint sm:max-w-[19rem]">
                {full
                  ? `All ${EVENT.capacity} seats are held. Seats come back when someone cancels, and the waiting list is worked in order.`
                  : `${seatsNow}. Two minutes to fill in the form, and a refundable AED ${EVENT.depositAed} secures yours until you arrive.`}
              </p>
            </Reveal>
          </div>

          <Reveal mode="load" delay={0.32} y={0} x={20} className="mt-10 lg:mt-0 lg:sticky lg:top-28">
            <EventFactsCard seatsRemaining={seats.remaining} />
          </Reveal>
        </div>
      </section>

      {/* ---------- What it is not ---------- */}
      <section className="border-y border-border-subtle bg-traq-tint px-5 py-10 sm:px-8 sm:py-12 lg:px-10 xl:px-16">
        <Reveal className="mx-auto max-w-7xl lg:flex lg:items-center lg:gap-14">
          <div className="eyebrow eyebrow-accent lg:w-52 lg:flex-none">Before you sign up</div>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink sm:text-[17px] lg:mt-0">
            {'This is not a talk about AI and not a pitch. You spend 52 of the 120 minutes writing your own AI decisions, in a trio, into a record you keep. If it makes sense to keep going afterwards, we’ll talk about that separately, not in the room.'}
          </p>
        </Reveal>
      </section>

      {/* ---------- Who's running it ---------- */}
      <HostCredibility />

      {/* ---------- What you leave with ---------- */}
      <section className="bg-bg-subtle px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28 xl:px-16">
        <SplitSection
          eyebrow="The three AI decisions"
          title="What you decide"
          sub="Three decisions that settle whether AI works in your business. In this order, in the room, in writing, before the timer moves you on."
        >
          <Group className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {TAKEAWAYS.map((item) => (
              <Item key={item.title} className="note-card">
                <h3 className="text-[16px] font-semibold leading-snug text-ink">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{item.body}</p>
              </Item>
            ))}
          </Group>
          <Reveal as="p" delay={0.2} className="mt-8 max-w-2xl text-[14px] leading-relaxed text-ink-faint">
            {'What you leave with: your AI decision record, digital, filled in during the session and sent to you by link. And one piece of paper, the eight vendor questions. Nothing else is printed, and nothing is built for you live. Making the three AI decisions, and knowing how to roll them out, is the session. Doing the rollout is a separate piece of work, and I will not pretend otherwise.'}
          </Reveal>
        </SplitSection>
      </section>

      {/* ---------- Who it is for ---------- */}
      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28 xl:px-16">
        <SplitSection eyebrow="The room" title="Who is in it">
          <Group className="grid gap-5 lg:grid-cols-2">
            <Item className="rounded-[20px] border border-border-subtle bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-cardHover lg:p-7">
              <h3 className="text-[15px] font-semibold text-ink">This is built for you if</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'You founded, own or run a business in Dubai, or you run a function inside one. Founders, GMs, senior operators.',
                  'The three AI decisions are yours to make, and nobody has to sign them off after you.',
                  'AI has stalled somewhere in your business, or you have not started and would rather skip the stall.',
                  'You can give it the full two hours, and you would rather write than listen.',
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
            </Item>
            <Item className="rounded-[20px] border border-border-subtle bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-cardHover lg:p-7">
              <h3 className="text-[15px] font-semibold text-ink">It is not built for</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'AI vendors, agencies and consultancies. The form says no to people in our line of work, politely and every time.',
                  'Managers and specialists who cannot make the three AI decisions. The work is real; the record is only worth something signed by the person who can act on it. Send them this page.',
                  'A second seat from the same company. One seat per company where possible, so a room of fifteen holds fifteen businesses.',
                  'Anyone who wants to listen rather than write. You spend 52 of the 120 minutes writing, and nobody sits at the back of a room this size.',
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
            </Item>
          </Group>
        </SplitSection>
      </section>

      {/* ---------- Run of show ---------- */}
      <section className="bg-bg-subtle px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28 xl:px-16">
        <SplitSection
          eyebrow="The two hours"
          title="How the session runs"
          sub="Fifty-two of the 120 minutes are you writing, not listening. Trios, not tables. Roles, never names. The timer moves the room on, not me."
        >
          <RunOfShow rows={RUN_OF_SHOW} />
        </SplitSection>
      </section>

      {/* ---------- Mid-page CTA ---------- */}
      <section className="px-5 py-14 text-center sm:px-8 sm:py-16 lg:px-10 xl:px-16">
        <Reveal>
          <p className="text-[17px] font-semibold text-ink sm:text-[19px]">
            Seen enough to know whether the three AI decisions are yours to make?
          </p>
          <div className="mt-5 flex justify-center">
            <SignUpButton full={full} />
          </div>
        </Reveal>
      </section>

      {/* ---------- How a seat works ---------- */}
      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28 xl:px-16">
        <SplitSection
          eyebrow="The seat"
          title="How you get one"
          sub="Four steps, and you always know which one you are on. Nobody sits in an inbox waiting for an answer."
        >
          <Group as="ol" className="space-y-4">
            {SEAT_STEPS.map((step, i) => (
              <Item
                key={step.title}
                as="li"
                className="flex gap-4 rounded-[18px] border border-border-subtle bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-cardHover sm:gap-5 sm:p-6"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-traq-purple bg-traq-tint text-[13px] font-bold text-traq-purple-ink">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold leading-snug text-ink">{step.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{step.body}</p>
                </div>
              </Item>
            ))}
          </Group>

          {/* The deposit and the pre-session task, side by side once there is room. */}
          <Group className="mt-10 grid gap-5 lg:grid-cols-2">
            <Item className="rounded-[24px] border border-border-subtle bg-traq-tint p-6 sm:p-8">
              <div className="eyebrow eyebrow-accent">On the deposit</div>
              <p className="mt-4 text-[16px] font-semibold leading-relaxed text-ink sm:text-[17px]">
                {`A fully refundable AED ${EVENT.depositAed} hold to secure your seat, refunded when you arrive. It exists so the seats go to people who are coming, nothing more.`}
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  'It is the last step of the form, taken only once the form has said the room is built for you.',
                  `Cancel with more than ${EVENT.cancellationNoticeHours} hours notice and it comes straight back, and your seat goes to the waiting list.`,
                  'Turn up and it is returned in the room, before the first decision starts.',
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
            </Item>

            <Item className="rounded-[24px] border border-border-subtle bg-white p-6 shadow-card sm:p-8">
              <div className="eyebrow eyebrow-accent">The pre-session form</div>
              <h3 className="mt-4 text-[17px] font-semibold leading-snug text-ink">
                One piece of work, two numbers, closes 48 hours before
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                {'Once your seat is secured I ask you for one thing: a piece of work you would put AI on, roughly how many hours a week it costs, and how many people touch it. It takes about two minutes to send.'}
              </p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                {'It gives the AI strategy block something real to score, and it is why the room is capped at fifteen rather than open. The form closes 48 hours before the session, so your trio starts from your numbers and not from a blank page.'}
              </p>
            </Item>
          </Group>
        </SplitSection>
      </section>

      {/* ---------- FAQ ---------- */}
      <Reveal>
        <FaqBlock qas={FAQS} heading={`Questions about ${EVENT.name}`} />
      </Reveal>

      {/* ---------- Final CTA ---------- */}
      <section className="relative bg-bg-base px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16 lg:px-10 xl:px-16">
        <Reveal className="mx-auto max-w-6xl">
          <div className="cta-panel">
            <div className="eyebrow eyebrow-accent">{seatsNow}</div>
            <h2 className="mx-auto mt-4 max-w-2xl text-balance text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl md:text-4xl">
              {full ? `The room for ${eventDateShort()} is full` : `Reserve your seat on ${eventDateShort()}`}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:mt-5 sm:text-base md:text-[17px]">
              {full
                ? 'Seats come back when someone cancels with notice. Join the waiting list and you would have about a day to take one if it opens.'
                : `Two minutes to fill in the form. If the room is built for you, you secure your seat on the spot with a refundable AED ${EVENT.depositAed}, returned when you arrive.`}
            </p>
            <div className="mt-7 flex justify-center sm:mt-9">
              <SignUpButton full={full} />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
