'use client';

import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { CheckCircle2, Loader2 } from 'lucide-react';

const field =
  'mt-1.5 w-full rounded-xl border border-border-strong bg-white px-4 py-3 text-[16px] text-ink outline-none transition focus:border-traq-purple focus:ring-2 focus:ring-traq-purple/20';

/** "Email me these details and the reminders", shown to buyers on the welcome page. */
export default function BuyerEmailForm({ kind }: { kind: 'build' | 'vip' }) {
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? '';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setMsg('Use the email you paid with.');
      return;
    }
    if (siteKey && !token) {
      setMsg('Complete the quick check first.');
      return;
    }
    setState('busy');
    setMsg('');
    try {
      const res = await fetch('/api/first-ai-assistant/buyer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ buyer: { name, email, kind }, turnstileToken: token }),
      });
      if (res.ok) {
        setState('done');
        return;
      }
      setState('error');
      setMsg('That did not go through. Email hello@traqcollective.com and I will send them myself.');
    } catch {
      setState('error');
      setMsg('No connection. Try again.');
    }
  }

  if (state === 'done') {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-traq-tint px-4 py-3 text-[15px] font-semibold text-traq-purple-ink">
        <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        Done. Check your inbox (and spam, the first time).
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-[14px] font-semibold text-ink">
          First name
          <input className={field} autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="text-[14px] font-semibold text-ink">
          Email you paid with
          <input type="email" inputMode="email" autoComplete="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>
      {siteKey ? <Turnstile siteKey={siteKey} onSuccess={setToken} onExpire={() => setToken('')} options={{ theme: 'light', size: 'flexible' }} /> : null}
      {msg ? <p className="text-[14px] font-medium text-signal-warn">{msg}</p> : null}
      <button
        type="submit"
        disabled={state === 'busy'}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-traq-purple px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-traq-purple-ink disabled:opacity-60"
      >
        {state === 'busy' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        Email me these details and the reminders
      </button>
    </form>
  );
}
