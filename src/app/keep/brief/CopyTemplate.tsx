'use client';

import { useState } from 'react';

/** Copies the plain-text brief (labels and questions, no examples). */
export default function CopyTemplate({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // In-app browsers (Instagram, TikTok) can block the Clipboard API, so
      // fall back to the old selection-based copy.
      const el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#6B3ECF] px-8 py-4 text-[16px] font-semibold text-white transition-colors hover:bg-[#5A31B5] active:scale-[0.98] focus-visible:outline-[#6B3ECF]"
      >
        {copied ? 'Copied' : 'Copy the template'}
      </button>
      <span role="status" aria-live="polite" className="text-[15px] font-medium text-[#18191B]">
        {copied ? 'Copied. Paste it into your AI assistant and fill in each part.' : ''}
      </span>
    </div>
  );
}
