'use client';

import { useEffect, useState } from 'react';
import { AI_PLAN_EVENT as EVENT, eventIsoStart } from '@/lib/event';

/** Whole days from now until the session starts. Negative once it has passed. */
function daysUntil(): number {
  const ms = new Date(eventIsoStart()).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

/**
 * A quiet "N days to go" tag, tied to the real session date in lib/event.ts —
 * never a fabricated deadline. Renders nothing on the server and for the first
 * client paint, so there is no server/client mismatch and no stale build-time
 * count; it fills in a moment after mount instead.
 */
export default function CountdownTag({ className = 'snap-card__tag' }: { className?: string }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(daysUntil());
    const id = setInterval(() => setDays(daysUntil()), 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  if (days === null || days < 0) return <span className={className}>{EVENT.city}</span>;

  return (
    <span className={className}>
      {days === 0 ? 'Today' : days === 1 ? '1 day to go' : `${days} days to go`}
    </span>
  );
}
