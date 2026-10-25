'use client';

import { useEffect } from 'react';
import { track } from '@/components/analytics/Analytics';
import { PRICE_VALUE, SESSION_TITLE } from '@/lib/build-ai-session';

/** Records the sale in GA4 (only when GA is switched on), once per checkout. */
export default function Confirm({ sessionId }: { sessionId: string | null }) {
  useEffect(() => {
    if (!sessionId) return;
    const key = `build-ai-purchase-${sessionId}`;
    try {
      if (window.localStorage.getItem(key)) return;
      window.localStorage.setItem(key, '1');
    } catch {
      // Storage blocked (private mode, some in-app browsers): track anyway.
    }
    track('purchase', {
      transaction_id: sessionId,
      value: PRICE_VALUE,
      currency: 'USD',
      items: [{ item_name: SESSION_TITLE, price: PRICE_VALUE, quantity: 1 }],
    });
  }, [sessionId]);

  return null;
}
