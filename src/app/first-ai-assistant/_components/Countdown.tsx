'use client';

import { useEffect, useState } from 'react';

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86_400),
    h: Math.floor((s % 86_400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * "Starts in 3d 10h 22m 05s" to a real session start, ticking every second.
 * Renders nothing until mounted so the server and client never disagree.
 * The screen-reader label stays at minute precision so it isn't re-read every tick.
 */
export default function Countdown({ iso, live = 'Live now', className = '' }: { iso: string; live?: string; className?: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return null;
  const ms = Date.parse(iso) - now;
  if (ms <= 0) return <span className={className}>{live}</span>;
  const { d, h, m, s } = parts(ms);
  return (
    <span className={className} role="timer" aria-label={`Starts in ${d} days, ${h} hours and ${m} minutes`}>
      Starts in {d > 0 ? `${d}d ` : ''}
      {h}h {pad(m)}m {pad(s)}s
    </span>
  );
}
