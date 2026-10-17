'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@/components/analytics/Analytics';

type State = 'idle' | 'ok' | 'failed';

/**
 * Tells the server about the purchase so the confirmation and reminders go
 * out, and records the sale in GA4 (only when GA is switched on). Renders
 * nothing unless something went wrong, so the page copy stays as written.
 */
export default function Confirm({ sessionId }: { sessionId: string | null }) {
  const [state, setState] = useState<State>('idle');
  const ran = useRef(false);

  useEffect(() => {
    if (!sessionId || ran.current) return;
    ran.current = true;
    fetch('/api/keep/confirm', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (r) => {
        const body = (await r.json().catch(() => ({}))) as { ok?: boolean; already?: boolean };
        if (!body.ok) return setState('failed');
        setState('ok');
        if (!body.already) {
          track('purchase', { transaction_id: sessionId, value: 19, currency: 'GBP', items: [{ item_name: 'The Person They Keep', price: 19, quantity: 1 }] });
        }
      })
      .catch(() => setState('failed'));
  }, [sessionId]);

  if (state !== 'failed') return null;
  return (
    <p role="status" className="mt-6 rounded-xl bg-traq-tint px-4 py-3 text-[15px] leading-6 text-ink">
      If your confirmation email has not arrived within 10 minutes, email{' '}
      <a className="font-semibold text-traq-purple-ink underline underline-offset-2" href="mailto:hello@traqcollective.com">
        hello@traqcollective.com
      </a>{' '}
      and we will send your joining details.
    </p>
  );
}
