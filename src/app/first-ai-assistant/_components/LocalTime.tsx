'use client';

import { useEffect, useState } from 'react';

/** "That's 19:00 Monday where you are", computed in the visitor's own time zone. */
export default function LocalTime({ iso, prefix = "That's" }: { iso: string; prefix?: string }) {
  const [text, setText] = useState('');
  useEffect(() => {
    try {
      const d = new Date(iso);
      const t = new Intl.DateTimeFormat(undefined, { weekday: 'long', hour: 'numeric', minute: '2-digit' }).format(d);
      setText(`${prefix} ${t} where you are.`);
    } catch {
      setText('');
    }
  }, [iso, prefix]);
  if (!text) return null;
  return <span>{text}</span>;
}
