'use client';

import { useEffect, useState } from 'react';

function parts(ms: number) {
  const m = Math.max(0, Math.floor(ms / 60_000));
  return { d: Math.floor(m / 1440), h: Math.floor((m % 1440) / 60), m: m % 60 };
}

/**
 * "Starts in 3d 10h 22m" to a real session start. Minute precision on purpose:
 * honest urgency, no ticking seconds. Renders nothing until mounted so the
 * server and client never disagree.
 */
export default function Countdown({ iso, live = 'Live now', className = '' }: { iso: string; live?: string; className?: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return null;
  const ms = Date.parse(iso) - now;
  if (ms <= 0) return <span className={className}>{live}</span>;
  const { d, h, m } = parts(ms);
  return (
    <span className={className} aria-label={`Starts in ${d} days, ${h} hours and ${m} minutes`}>
      Starts in {d > 0 ? `${d}d ` : ''}
      {h}h {String(m).padStart(2, '0')}m
    </span>
  );
}
