'use client';

import { useEffect } from 'react';
import { track } from '@/components/analytics/Analytics';

/**
 * Fires the `booking_view` conversion event once when the /book page mounts.
 * Client-only so the server-rendered book page can keep its metadata export.
 * No-ops when gtag is absent (GA disabled), via track().
 */
export default function BookViewTracker() {
  useEffect(() => {
    track('booking_view');
  }, []);

  return null;
}
