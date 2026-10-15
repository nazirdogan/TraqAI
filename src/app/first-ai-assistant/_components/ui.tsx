import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import {
  BUILD,
  FAA_PATH,
  LINKS,
  PRICES,
  buildSku,
  dayLabel,
  launchPriceOpen,
  money,
  price,
  timeTriple,
  type Currency,
} from '@/lib/first-ai-assistant';

export const BTN =
  'inline-flex items-center justify-center gap-2 rounded-full bg-traq-purple px-7 py-4 text-[15px] font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]';
export const BTN_GHOST =
  'inline-flex items-center justify-center gap-2 rounded-full border border-border-strong bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-traq-purple hover:text-traq-purple';

export function FunnelHeader({ chip }: { chip?: string }) {
  return (
    <header className="border-b border-border-subtle bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href={FAA_PATH} aria-label="Your First AI Assistant">
          <Image src="/logos/wordmark-purple.png" alt="Traq Collective" width={132} height={28} className="h-6 w-auto sm:h-7" priority />
        </Link>
        {chip ? (
          <span className="rounded-full bg-traq-tint px-3 py-1.5 text-[12px] font-semibold text-traq-purple-ink">{chip}</span>
        ) : null}
      </div>
    </header>
  );
}

export function FunnelFooter() {
  return (
    <footer className="border-t border-border-subtle bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10 text-[13px] leading-6 text-ink-faint sm:px-8">
        <p>
          Traq Collective L.L.C-FZ, Meydan Free Zone, Dubai. Questions:{' '}
          <a className="font-medium text-traq-purple" href="mailto:hello@traqcollective.com">
            hello@traqcollective.com
          </a>
        </p>
        <p className="mt-2">
          <Link className="underline underline-offset-2" href={`${FAA_PATH}/refunds`}>Refunds and cancellations</Link>
          {' · '}
          <Link className="underline underline-offset-2" href="/terms">Terms</Link>
          {' · '}
          <Link className="underline underline-offset-2" href="/privacy">Privacy</Link>
        </p>
        <p className="mt-2">
          Claude is a product of Anthropic. Gmail and Google Workspace are Google products. Microsoft 365 is a Microsoft product. Traq Collective is
          independent and not affiliated with any of them. Statistics on this page come from the published studies linked beside them; your own results
          depend on how you use it.
        </p>
      </div>
    </footer>
  );
}

export function CurrencySwitch({ cur, path }: { cur: Currency; path: string }) {
  const opts: { c: Currency; label: string }[] = [
    { c: 'gbp', label: '£ GBP' },
    { c: 'usd', label: '$ USD' },
    { c: 'aed', label: 'AED' },
  ];
  return (
    <p className="text-[13px] text-ink-faint">
      Prices shown in{' '}
      {opts.map((o, i) => (
        <span key={o.c}>
          {i > 0 ? ' · ' : ''}
          {o.c === cur ? (
            <strong className="font-semibold text-ink">{o.label}</strong>
          ) : (
            <Link className="underline underline-offset-2 hover:text-traq-purple" href={`${path}${path.includes('?') ? '&' : '?'}cur=${o.c}`} scroll={false}>
              {o.label}
            </Link>
          )}
        </span>
      ))}
    </p>
  );
}

function Ticks({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-2.5">
      {items.map((it) => (
        <li key={it} className="flex gap-2.5 text-[15px] leading-6 text-ink-soft">
          <Check className="mt-1 h-4 w-4 flex-none text-traq-purple" aria-hidden="true" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The three paid options, shown on every page so nobody has to attend the free
 * session to buy. `vip` swaps the build link for the VIP price.
 */
export function OfferCards({ cur, vip = false, showVip = true }: { cur: Currency; vip?: boolean; showVip?: boolean }) {
  const sku = vip ? 'build_vip' : buildSku();
  const launch = launchPriceOpen();
  return (
    <div className={`grid gap-5 ${showVip ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
      {showVip ? (
        <div className="flex flex-col rounded-[22px] border border-border-subtle bg-white p-7 shadow-card">
          <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-traq-purple">Add to the free session</div>
          <h3 className="mt-2 text-[22px] font-semibold text-ink">VIP Pass</h3>
          <p className="mt-1 text-[32px] font-semibold text-ink">{price('vip', cur)}</p>
          <Ticks
            items={[
              'Private 25-minute Q&A with Naz straight after the session',
              'The AI Assistant Starter Kit: 30 copy-and-paste prompts by role, plus the setup checklist',
              'Replay and slides for 7 days',
              `VIP price on the live build: ${price('build_vip', cur)}`,
            ]}
          />
          <div className="mt-auto pt-7">
            <a className={`${BTN} w-full`} href={LINKS.vip[cur]}>
              Get the VIP Pass
            </a>
          </div>
        </div>
      ) : null}

      <div className="relative flex flex-col rounded-[22px] border-2 border-traq-purple bg-white p-7 shadow-cardHover">
        <span className="absolute -top-3 left-7 rounded-full bg-traq-purple px-3 py-1 text-[12px] font-semibold text-white">Most popular</span>
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-traq-purple">
          Live online · {dayLabel(BUILD.startIso)} · {BUILD.capacity} seats
        </div>
        <h3 className="mt-2 text-[22px] font-semibold text-ink">Build Your AI Assistant, Live</h3>
        <p className="mt-1 text-[32px] font-semibold text-ink">
          {price(sku, cur)}
        </p>
        {launch && !vip ? (
          <p className="text-[13px] font-medium text-ink-faint">Launch price until Fri 23 Oct, then {money(PRICES.build_std[cur], cur)}</p>
        ) : null}
        <p className="mt-1 text-[13px] text-ink-faint">{timeTriple(BUILD.startIso)}, three hours</p>
        <Ticks
          items={[
            'Connect Claude to your own email and calendar, step by step, with me',
            'Leave with a morning briefing, reply drafts in your voice, meeting prep and an evening close-out',
            'Setup files, replay, 14-day support group and two group office hours',
          ]}
        />
        <div className="mt-auto pt-7">
          <a className={`${BTN} w-full`} href={LINKS[sku][cur]}>
            Save my seat
          </a>
        </div>
      </div>

      <div className="flex flex-col rounded-[22px] border border-border-subtle bg-white p-7 shadow-card">
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-traq-purple">Done with you · 4 slots before 28 Oct</div>
        <h3 className="mt-2 text-[22px] font-semibold text-ink">1:1 Setup with Naz</h3>
        <p className="mt-1 text-[32px] font-semibold text-ink">{price('setup', cur)}</p>
        <Ticks
          items={[
            '75 minutes on a screen share, built around your inbox, calendar and role',
            'Works for Microsoft 365 too, once your IT admin approves the connection',
            '14 days of support afterwards',
            `Or add it to the live build: both for ${price('bundle', cur)}`,
          ]}
        />
        <div className="mt-auto flex flex-col gap-3 pt-7">
          <a className={`${BTN} w-full`} href={LINKS.setup[cur]}>
            Book my 1:1 setup
          </a>
          <a className={`${BTN_GHOST} w-full`} href={LINKS.bundle[cur]}>
            Build + 1:1 for {price('bundle', cur)}
          </a>
        </div>
      </div>
    </div>
  );
}

/** What the assistant's morning briefing looks like. A styled example, not a screenshot of anyone's real inbox. */
export function BriefMock() {
  return (
    <div className="rounded-[22px] border border-border-subtle bg-white p-5 shadow-cardHover sm:p-6" aria-label="Example of a morning briefing">
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-traq-purple">Your morning briefing</div>
        <div className="text-[12px] text-ink-faint">07:00 · example</div>
      </div>
      <div className="mt-4 space-y-4 text-[14px] leading-6">
        <div>
          <div className="font-semibold text-ink">Today: 3 meetings</div>
          <ul className="mt-1 space-y-1 text-ink-soft">
            <li>10:00 Supplier review, prep: their price rise email from Tuesday</li>
            <li>13:30 Client call, prep: last two emails and the open quote</li>
            <li>16:00 Team catch-up, nothing to prepare</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-ink">3 emails that need you (of 64)</div>
          <ul className="mt-1 space-y-1 text-ink-soft">
            <li>Accountant: VAT question, reply drafted in your voice</li>
            <li>New enquiry from your website, reply drafted</li>
            <li>Landlord: renewal date moved, added to your calendar notes</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-ink">Slipped yesterday</div>
          <p className="text-ink-soft">You promised Sarah the proposal by Thursday. Draft ready to review.</p>
        </div>
      </div>
      <div className="mt-5 rounded-xl bg-traq-tint px-4 py-3 text-[13px] text-traq-purple-ink">Nothing is sent without you. You read, edit, press send.</div>
    </div>
  );
}

export function SectionHead({ eyebrow, title, sub, center = false }: { eyebrow: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={center ? 'text-center' : undefined}>
      <div className="eyebrow eyebrow-accent">{eyebrow}</div>
      <h2 className="section-title mt-3">{title}</h2>
      {sub ? <p className={`section-sub mt-4 ${center ? 'mx-auto' : ''}`}>{sub}</p> : null}
    </div>
  );
}
