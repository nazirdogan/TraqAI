'use client';

import { useEffect } from 'react';
import { track } from '@/components/analytics/Analytics';

/**
 * Records the sale in GA4 (only when GA is switched on), once per checkout.
 * The emails are sent by the Stripe webhook, not by this page, so a buyer who
 * closes the tab before it loads still gets them.
 */
export default function Confirm({ sessionId }: { sessionId: string | null }) {
  useEffect(() => {
    if (!sessionId) return;
    const key = `keep-purchase-${sessionId}`;
    try {
      if (window.localStorage.getItem(key)) return;
      window.localStorage.setItem(key, '1');
    } catch {
      // Storage blocked (private mode, some in-app browsers): track anyway.
    }
    track('purchase', { transaction_id: sessionId, value: 19, currency: 'GBP', items: [{ item_name: 'The Person They Keep', price: 19, quantity: 1 }] });
  }, [sessionId]);

  return null;
}
