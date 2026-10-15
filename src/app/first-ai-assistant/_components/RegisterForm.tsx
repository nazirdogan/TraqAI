'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Turnstile } from '@marsidev/react-turnstile';
import { AlertCircle, Loader2 } from 'lucide-react';
import { captureAttribution, getAttribution } from '@/lib/attribution';

export type SessionOption = { id: string; day: string; times: string; startIso: string };

const COUNTRIES = [
  'United Kingdom',
  'United Arab Emirates',
  'United States',
  'Ireland',
  'Saudi Arabia',
  'Qatar',
  'Canada',
  'Australia',
  'Germany',
  'Netherlands',
  'France',
  'Other',
];

const ROLES = [
  'Founder or business owner',
  'Professional services (accountant, lawyer, consultant, agent)',
  'Senior leader or manager',
  'Employee who wants to get ahead',
  'Other',
];

const EMAIL_TYPES = [
  'Gmail',
  'Google Workspace (work email on Google)',
  'Microsoft 365 / Outlook at work',
  'Personal Outlook or Hotmail',
  'Not sure',
];

const field =
  'mt-1.5 w-full rounded-xl border border-border-strong bg-white px-4 py-3 text-[16px] text-ink outline-none transition focus:border-traq-purple focus:ring-2 focus:ring-traq-purple/20';
const label = 'block text-[14px] font-semibold text-ink';

type Errors = Partial<Record<string, string>>;

export default function RegisterForm({ sessions, defaultCountry }: { sessions: SessionOption[]; defaultCountry?: string }) {
  const router = useRouter();
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? '';
  const [v, setV] = useState({
    name: '',
    email: '',
    whatsapp: '',
    country: defaultCountry && COUNTRIES.includes(defaultCountry) ? defaultCountry : '',
    role: '',
    emailType: '',
    session: sessions[0]?.id ?? '',
    consent: false,
  });
  const [token, setToken] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState('');

  useEffect(() => {
    captureAttribution();
  }, []);

  if (!sessions.length) {
    return (
      <div className="rounded-[22px] border border-border-subtle bg-white p-7 text-center shadow-card">
        <p className="text-[16px] font-semibold text-ink">The free sessions for this round have finished.</p>
        <p className="mt-2 text-[15px] text-ink-soft">The live build and the 1:1 setup are still open below.</p>
      </div>
    );
  }

  function set<K extends keyof typeof v>(k: K, val: (typeof v)[K]) {
    setV((s) => ({ ...s, [k]: val }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBanner('');
    const errs: Errors = {};
    if (v.name.trim().length < 2) errs.name = 'Add your name';
    if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) errs.email = 'Check your email address';
    if (!v.consent) errs.consent = 'Tick this so we can send your link and reminders';
    if (siteKey && !token) errs.turnstile = 'Complete the quick check so we know you are human';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      const res = await fetch('/api/first-ai-assistant/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ signUp: { ...v, click: getAttribution() }, turnstileToken: token }),
      });
      const data = (await res.json().catch(() => ({}))) as { next?: string; error?: string; issues?: Record<string, string[]> };
      if (res.ok && data.next) {
        router.push(data.next);
        return;
      }
      if (data.issues) {
        const fe: Errors = {};
        for (const [k, msgs] of Object.entries(data.issues)) fe[k] = msgs?.[0];
        setErrors(fe);
      }
      setBanner(
        data.error === 'session_closed'
          ? 'That session has just closed. Choose another date.'
          : data.error === 'rate_limited'
            ? 'Too many tries from this connection. Wait a few minutes and try again.'
            : 'Something went wrong. Try once more, or email hello@traqcollective.com and I will add you myself.',
      );
    } catch {
      setBanner('No connection. Check your internet and try again.');
    } finally {
      setBusy(false);
    }
  }

  const Err = ({ k }: { k: string }) =>
    errors[k] ? (
      <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-signal-warn">
        <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={submit} noValidate className="rounded-[22px] border border-border-subtle bg-white p-6 shadow-cardHover sm:p-8" id="register">
      <h2 className="text-[24px] font-semibold leading-tight text-ink">Save your free seat</h2>
      <p className="mt-1 text-[14px] text-ink-soft">Free, 60 minutes, on Google Meet. No card.</p>

      <fieldset className="mt-6">
        <legend className={label}>Choose your date</legend>
        <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
          {sessions.map((s) => (
            <label
              key={s.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition ${
                v.session === s.id ? 'border-traq-purple bg-traq-tint' : 'border-border-strong bg-white hover:border-traq-purple/60'
              }`}
            >
              <input type="radio" name="session" value={s.id} checked={v.session === s.id} onChange={() => set('session', s.id)} className="mt-1 accent-[#5B3FE4]" />
              <span>
                <span className="block text-[15px] font-semibold text-ink">{s.day}</span>
                <span className="block text-[13px] text-ink-soft">{s.times}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4">
        <div>
          <label className={label} htmlFor="faa-name">First and last name</label>
          <input id="faa-name" className={field} autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} />
          <Err k="name" />
        </div>
        <div>
          <label className={label} htmlFor="faa-email">Email</label>
          <input id="faa-email" type="email" inputMode="email" className={field} autoComplete="email" value={v.email} onChange={(e) => set('email', e.target.value)} />
          <Err k="email" />
        </div>
        <details className="group rounded-xl border border-border-subtle px-4 py-3 open:pb-4">
          <summary className="cursor-pointer list-none text-[14px] font-semibold text-ink-soft marker:hidden hover:text-traq-purple">
            <span className="group-open:hidden">+ Help me tailor the session (optional)</span>
            <span className="hidden group-open:inline">Help me tailor the session (optional)</span>
          </summary>
          <div className="mt-3 grid gap-4">
        <div>
          <label className={label} htmlFor="faa-wa">
            WhatsApp number <span className="font-normal text-ink-faint">(for a reminder)</span>
          </label>
          <input id="faa-wa" type="tel" inputMode="tel" className={field} autoComplete="tel" placeholder="+44 7…" value={v.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="faa-country">Country</label>
            <select id="faa-country" className={field} value={v.country} onChange={(e) => set('country', e.target.value)}>
              <option value="">Choose…</option>
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <Err k="country" />
          </div>
          <div>
            <label className={label} htmlFor="faa-email-type">Which email do you use most?</label>
            <select id="faa-email-type" className={field} value={v.emailType} onChange={(e) => set('emailType', e.target.value)}>
              <option value="">Choose…</option>
              {EMAIL_TYPES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <Err k="emailType" />
          </div>
        </div>
        <div>
          <label className={label} htmlFor="faa-role">Which describes you best?</label>
          <select id="faa-role" className={field} value={v.role} onChange={(e) => set('role', e.target.value)}>
            <option value="">Choose…</option>
            {ROLES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <Err k="role" />
        </div>
          </div>
        </details>
        <label className="flex items-start gap-3 text-[14px] leading-6 text-ink-soft">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[#5B3FE4]" checked={v.consent} onChange={(e) => set('consent', e.target.checked)} />
          <span>Email me the join link, reminders and the follow-up from this session. I can unsubscribe any time.</span>
        </label>
        <Err k="consent" />
      </div>

      {siteKey ? (
        <div className="mt-5">
          <Turnstile siteKey={siteKey} onSuccess={(t) => setToken(t)} onExpire={() => setToken('')} options={{ theme: 'light', size: 'flexible' }} />
          <Err k="turnstile" />
        </div>
      ) : null}

      {banner ? <p className="mt-4 rounded-xl bg-[#FBEFEC] px-4 py-3 text-[14px] font-medium text-signal-warn">{banner}</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-traq-purple px-7 py-4 text-[16px] font-semibold text-white shadow-card transition-all hover:bg-traq-purple-ink disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {busy ? 'Saving your seat…' : 'Save my free seat'}
      </button>
      <p className="mt-3 text-center text-[12px] text-ink-faint">Free. No card needed. Your details stay with Traq Collective.</p>
    </form>
  );
}
