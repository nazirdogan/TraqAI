'use client';

import { useState } from 'react';

const VERSIONS = {
  robot: {
    label: 'What AI writes by default',
    text: 'Dear Mark,\n\nI hope this email finds you well. Thank you for reaching out regarding the proposal. I wanted to take this opportunity to confirm that I am delighted to move forward and would be more than happy to schedule a call at your earliest convenience.\n\nPlease do not hesitate to contact me should you have any further questions.\n\nWarm regards',
  },
  you: {
    label: 'After it has read five of your emails',
    text: 'Hi Mark,\n\nGreat, let’s do it. Thursday at 2 or Friday morning work for me. Pick one and I’ll send the invite.\n\nCheers,\nSam',
  },
} as const;

/** The same reply, before and after the voice setting. The visitor flips it. */
export default function VoiceToggle() {
  const [v, setV] = useState<'robot' | 'you'>('robot');
  const cur = VERSIONS[v];
  return (
    <div className="rounded-[22px] border border-border-subtle bg-white p-5 shadow-cardHover sm:p-6">
      <div role="tablist" aria-label="Reply style" className="inline-flex rounded-full border border-border-strong p-1 text-[14px]">
        {(['robot', 'you'] as const).map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={v === k}
            onClick={() => setV(k)}
            className={`rounded-full px-4 py-1.5 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-traq-purple ${
              v === k ? (k === 'robot' ? 'bg-signal-warn text-white' : 'bg-traq-purple text-white') : 'text-ink-soft hover:text-ink'
            }`}
          >
            {k === 'robot' ? 'Robot' : 'You'}
          </button>
        ))}
      </div>
      <p className={`mt-4 text-[13px] font-semibold ${v === 'robot' ? 'text-signal-warn' : 'text-traq-purple'}`}>{cur.label}</p>
      <p className="mt-2 min-h-[220px] whitespace-pre-line text-[15px] leading-7 text-ink">{cur.text}</p>
      <p className="mt-3 text-[13px] text-ink-faint">
        {v === 'robot' ? 'Tap “You” to see the same reply after the one setting.' : 'Same AI, same email. The difference is one setting, shown in the session.'}
      </p>
    </div>
  );
}
