'use client';

import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';

const EMAILS = [
  { from: 'Supplier', subject: 'Revised price list attached' },
  { from: 'LinkedIn', subject: '12 new notifications' },
  { from: 'Accountant', subject: 'Quick VAT question' },
  { from: 'Newsletter', subject: 'The week in review' },
  { from: 'Client', subject: 'Re: proposal timings' },
  { from: 'Calendar', subject: 'Updated invitation: Thursday' },
  { from: 'Website', subject: 'New enquiry from your contact form' },
  { from: 'Landlord', subject: 'Lease renewal date' },
  { from: 'Bank', subject: 'Your statement is ready' },
];

/**
 * The page's one orchestrated moment: a crowded inbox gives way to the single
 * page the assistant writes. Plays once on load, then on request. Visitors who
 * prefer reduced motion see the finished page straight away.
 */
export default function InboxToBrief() {
  const [stage, setStage] = useState<'inbox' | 'brief'>('inbox');
  const [run, setRun] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setStage('brief');
      return;
    }
    setStage('inbox');
    const t = setTimeout(() => setStage('brief'), 1900);
    return () => clearTimeout(t);
  }, [run]);

  const brief = stage === 'brief';

  return (
    <figure className="relative" aria-label="A crowded inbox turning into a one-page morning briefing">
      <div className="paper-grid relative overflow-hidden rounded-[26px] border border-border-subtle bg-white p-3 shadow-cardHover sm:p-4 xl:pr-36">
        <div className="relative min-h-[430px] sm:min-h-[460px]">
          {/* The inbox */}
          <div
            aria-hidden={brief}
            className={`absolute inset-0 rounded-[18px] bg-white p-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-5 ${
              brief ? 'pointer-events-none -translate-y-6 scale-[0.96] opacity-0' : 'opacity-100'
            }`}
          >
            <div className="flex items-baseline justify-between">
              <p className="text-[15px] font-semibold text-ink">Inbox</p>
              <p className="text-[13px] font-semibold text-signal-warn">117 unread</p>
            </div>
            <ul className="mt-3 divide-y divide-border-subtle">
              {EMAILS.map((e) => (
                <li key={e.subject} className="flex items-center gap-3 py-2.5 text-[14px]">
                  <span className="h-2 w-2 flex-none rounded-full bg-traq-purple" />
                  <span className="w-24 flex-none truncate font-semibold text-ink">{e.from}</span>
                  <span className="truncate text-ink-soft">{e.subject}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[13px] text-ink-faint">and 108 more…</p>
          </div>

          {/* The one page */}
          <div
            aria-hidden={!brief}
            className={`absolute inset-0 rounded-[18px] bg-white p-5 transition-all delay-150 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-6 ${
              brief ? 'opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
            }`}
          >
            <div className="flex items-baseline justify-between">
              <p className="text-[15px] font-semibold text-ink">Your morning, on one page</p>
              <p className="text-[13px] text-ink-faint">09:00</p>
            </div>
            <div className="mt-4 space-y-4 text-[14px] leading-6">
              <div>
                <p className="font-semibold text-ink">Today: 3 meetings</p>
                <p className="text-ink-soft">10:00 Supplier review. Prep: their price rise email from Tuesday.</p>
                <p className="text-ink-soft">13:30 Client call. Prep: the open quote.</p>
              </div>
              <div className="relative">
                <p className="font-semibold text-ink">3 emails that need you (of 117)</p>
                <p className="text-ink-soft">Accountant: VAT question. Reply drafted.</p>
                <p className="text-ink-soft">Website: new enquiry. Reply drafted.</p>
                <p className="text-ink-soft">Landlord: renewal date moved.</p>
              </div>
              <div>
                <p className="font-semibold text-ink">Slipped yesterday</p>
                <p className="text-ink-soft">You promised Sarah the proposal by Thursday. Draft ready to review.</p>
              </div>
            </div>
            <p className="mt-5 rounded-xl bg-traq-tint px-4 py-3 text-[13px] font-medium text-traq-purple-ink">Nothing is sent. You read, edit and press send.</p>
          </div>
        </div>
        {/* Margin notes, like a teacher's pen */}
        <p
          aria-hidden="true"
          className={`font-hand pointer-events-none absolute right-4 top-[38%] hidden w-28 rotate-[4deg] text-[22px] leading-6 text-traq-purple transition-opacity delay-700 duration-500 xl:block ${
            brief ? 'opacity-100' : 'opacity-0'
          }`}
        >
          114 of them can wait
        </p>
        <p
          aria-hidden="true"
          className={`font-hand pointer-events-none absolute bottom-[22%] right-4 hidden w-28 -rotate-[3deg] text-[22px] leading-6 text-traq-purple transition-opacity delay-1000 duration-500 xl:block ${
            brief ? 'opacity-100' : 'opacity-0'
          }`}
        >
          nothing goes out without you
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[12px] text-ink-faint">
        <span>An example page. Yours is built from your own inbox and calendar.</span>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="inline-flex flex-none items-center gap-1.5 rounded-full px-2 py-1 font-medium text-ink-soft hover:text-traq-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-traq-purple"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Play again
        </button>
      </div>
    </figure>
  );
}
