import {
  AI_PLAN_EVENT as EVENT,
  eventDateShort,
  eventTimeRange,
  seatsLine,
} from '@/lib/event';
import CountdownTag from './CountdownTag';

type EventFactsCardProps = {
  /**
   * 'facts' for anyone deciding whether to apply, 'deposit' once a seat is
   * offered and the hold is the live question, 'confirmed' after it clears.
   */
  variant?: 'facts' | 'deposit' | 'confirmed';
  className?: string;
};

/**
 * The session, at a glance. One row-set, reused everywhere someone might want
 * the facts beside them rather than scrolled past: the landing hero, the
 * application and prep forms, and the deposit step. Pulls from lib/event.ts
 * so nothing here can drift from the copy that states it in full.
 */
export default function EventFactsCard({ variant = 'facts', className = '' }: EventFactsCardProps) {
  const rows =
    variant === 'deposit'
      ? [
          { k: 'When', v: `${eventDateShort()}, ${eventTimeRange()}` },
          { k: 'Where', v: `${EVENT.city}, in person` },
          { k: 'To hold your seat', v: `AED ${EVENT.depositAed}, refundable` },
          { k: 'Refund window', v: `${EVENT.cancellationNoticeHours}h notice` },
        ]
      : variant === 'confirmed'
        ? [
            { k: 'When', v: `${eventDateShort()}, ${eventTimeRange()}` },
            { k: 'Where', v: `${EVENT.city}, in person` },
            { k: 'Your deposit', v: `AED ${EVENT.depositAed}, returned in the room` },
            { k: 'Status', v: 'Seat confirmed' },
          ]
        : [
            { k: 'When', v: `${eventDateShort()}, ${eventTimeRange()}` },
            { k: 'Where', v: `${EVENT.city}, in person` },
            { k: 'Room', v: seatsLine() },
            { k: 'To attend', v: 'Free, by application' },
          ];

  return (
    <div className={`snap-card ${className}`}>
      <div className="snap-card__head">
        <span className="snap-card__title">
          <span className="snap-card__dot" aria-hidden="true" />
          Session snapshot
        </span>
        <CountdownTag />
      </div>
      <dl className="grid grid-cols-2 gap-x-5 gap-y-5">
        {rows.map((row) => (
          <div key={row.k}>
            <dt className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
              {row.k}
            </dt>
            <dd className="mt-1.5 text-[14px] font-semibold leading-snug text-ink">{row.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
