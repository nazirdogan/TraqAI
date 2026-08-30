'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Globe,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  SquarePen,
} from 'lucide-react';
import FadeUp from '@/components/ui/FadeUp';
import IntakeChatPanel, { FIELD_LABELS, SuccessPanel } from '@/components/intake/IntakeChatPanel';
import { useIntakeChat, progressPct } from '@/hooks/useIntakeChat';
import { setEnhancedConversionData, track } from '@/components/analytics/Analytics';
import { getAttribution } from '@/lib/attribution';
import { COMPANY } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { INPUT_BASE, LABEL_BASE } from '@/lib/intake/ui';
import {
  REQUIRED_FIELDS,
  SERVICES_OF_INTEREST,
  type QuickIntake,
} from '@/lib/intake/types';

type Mode = 'quick' | 'chat';

export default function ContactIntake() {
  const [mode, setMode] = useState<Mode>('quick');
  const chat = useIntakeChat();

  return (
    <section id="contact" className="relative pt-8 pb-16 sm:pt-14 sm:pb-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:gap-14 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
        <FadeUp>
          <div className="eyebrow eyebrow-accent">Get in touch</div>
          <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-ink sm:mt-5 sm:text-3xl md:text-4xl lg:text-5xl">
            Tell us about your team.{' '}
            <span className="text-traq-purple">We&rsquo;ll show you where AI fits.</span>
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:mt-5 sm:text-base lg:text-lg">
            Want a time in the diary now? <Link href="/book" className="font-semibold text-traq-purple underline-offset-2 hover:underline">Book a free call</Link>.
            Prefer to message first? Send us the basics in 30 seconds, or chat it through with our
            AI intake for a richer brief. Either way, we&rsquo;ll get back to you fast.
          </p>

          <ul className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
            <li className="flex items-start gap-4">
              <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-border-subtle bg-traq-tint text-traq-purple">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <p className={LABEL_BASE}>Email</p>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="mt-1 block text-sm text-ink hover:text-traq-purple"
                >
                  {COMPANY.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-border-subtle bg-traq-tint text-traq-purple">
                <Phone className="h-4 w-4" />
              </span>
              <div>
                <p className={LABEL_BASE}>Phone &middot; WhatsApp</p>
                <a
                  href={`tel:${COMPANY.phone.replace(/\s|\(|\)|-/g, '')}`}
                  className="mt-1 block text-sm text-ink hover:text-traq-purple"
                >
                  {COMPANY.phone}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-border-subtle bg-traq-tint text-traq-purple">
                <Globe className="h-4 w-4" />
              </span>
              <div>
                <p className={LABEL_BASE}>Where we work</p>
                <p className="mt-1 text-sm text-ink">{COMPANY.location}</p>
              </div>
            </li>
          </ul>

          {mode === 'chat' ? (
            <div className="mt-10 rounded-2xl border border-border-subtle bg-white p-5 shadow-card">
              <p className={LABEL_BASE}>What we&rsquo;ll capture</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {REQUIRED_FIELDS.map((f) => {
                  const v = chat.profile[f];
                  const filled =
                    v !== undefined &&
                    v !== null &&
                    (typeof v === 'string'
                      ? v.trim().length > 0
                      : Array.isArray(v)
                        ? v.length > 0
                        : true);
                  return (
                    <span
                      key={f}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]',
                        filled
                          ? 'border-traq-purple/40 bg-traq-tint text-traq-purple-ink'
                          : 'border-border-subtle bg-bg-subtle text-ink-faint',
                      )}
                    >
                      {filled ? <CheckCircle2 className="h-3 w-3 text-traq-purple" /> : null}
                      {FIELD_LABELS[f]}
                    </span>
                  );
                })}
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border-subtle">
                <div
                  className="h-full rounded-full bg-traq-purple transition-all"
                  style={{ width: `${progressPct(chat.profile)}%` }}
                />
              </div>
            </div>
          ) : null}
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="relative">
            {chat.phase === 'success' ? (
              <SuccessPanel firstName={chat.profile.firstName} />
            ) : (
              <div className="mb-4 flex gap-1.5 rounded-full border border-border-subtle bg-white p-1 shadow-card">
                <ModeTab
                  active={mode === 'quick'}
                  onClick={() => setMode('quick')}
                  icon={<SquarePen className="h-3.5 w-3.5" />}
                  label="Quick form"
                  sub="30 seconds"
                />
                <ModeTab
                  active={mode === 'chat'}
                  onClick={() => setMode('chat')}
                  icon={<MessageSquare className="h-3.5 w-3.5" />}
                  label="Chat with AI"
                  sub="2 min · richer brief"
                />
              </div>
            )}

            {chat.phase === 'success' ? null : mode === 'quick' ? (
              <QuickFormPanel
                turnstileSiteKey={chat.turnstileSiteKey}
                turnstileRequired={chat.turnstileRequired}
                turnstileToken={chat.turnstileToken}
                onTurnstileToken={chat.setTurnstileToken}
                onSuccess={(firstName) => {
                  chat.setProfile((prev) => ({ ...prev, firstName }));
                  chat.setPhase('success');
                }}
              />
            ) : (
              <IntakeChatPanel chat={chat} />
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

type ModeTabProps = {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sub: string;
};

function ModeTab({ active, onClick, icon, label, sub }: ModeTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium transition-all',
        active
          ? 'bg-traq-purple text-white shadow-card'
          : 'text-ink-soft hover:text-ink',
      )}
    >
      <span className={active ? 'text-white' : 'text-traq-purple'}>{icon}</span>
      <span className="flex flex-col items-start leading-tight sm:flex-row sm:items-baseline sm:gap-1.5">
        <span>{label}</span>
        <span
          className={cn(
            'text-[10px] font-normal uppercase tracking-wider',
            active ? 'text-white/75' : 'text-ink-faint',
          )}
        >
          {sub}
        </span>
      </span>
    </button>
  );
}

type QuickFormPanelProps = {
  turnstileSiteKey: string;
  turnstileRequired: boolean;
  turnstileToken: string;
  onTurnstileToken: (t: string) => void;
  onSuccess: (firstName: string) => void;
};

function QuickFormPanel({
  turnstileSiteKey,
  turnstileRequired,
  turnstileToken,
  onTurnstileToken,
  onSuccess,
}: QuickFormPanelProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [problem, setProblem] = useState('');
  const [services, setServices] = useState<QuickIntake['servicesOfInterest']>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleService = (svc: (typeof SERVICES_OF_INTEREST)[number]) => {
    setServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc],
    );
  };

  const canSubmit =
    !submitting &&
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    company.trim() &&
    problem.trim().length >= 10 &&
    services.length >= 1 &&
    (!turnstileRequired || turnstileToken.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/intake/quick', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          intake: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            company: company.trim(),
            problem: problem.trim(),
            servicesOfInterest: services,
            click: getAttribution(),
          },
          turnstileToken: turnstileRequired ? turnstileToken : undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body?.error === 'validation_failed'
            ? 'Double-check the fields and try again.'
            : body?.error === 'rate_limited'
              ? 'Too many submissions from this network. Try again in a bit.'
              : body?.error === 'turnstile_failed'
                ? 'We couldn’t verify the browser. Refresh and try again.'
                : body?.error === 'email_send_failed'
                  ? 'Your note didn’t send. Email us directly at hello@traqcollective.com.'
                  : 'Something went wrong. Try again.',
        );
      }
      setEnhancedConversionData(email.trim());
      track('quick_form_submit');
      onSuccess(firstName.trim());
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative glass-strong rounded-3xl p-5 shadow-card sm:p-7 md:p-9"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={LABEL_BASE} htmlFor="qf-first">
            First name
          </label>
          <input
            id="qf-first"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            className={cn(INPUT_BASE, 'mt-2')}
            placeholder="Jane"
          />
        </div>
        <div>
          <label className={LABEL_BASE} htmlFor="qf-last">
            Last name
          </label>
          <input
            id="qf-last"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
            className={cn(INPUT_BASE, 'mt-2')}
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className={LABEL_BASE} htmlFor="qf-email">
          Work email
        </label>
        <input
          id="qf-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className={cn(INPUT_BASE, 'mt-2')}
          placeholder="jane@company.com"
        />
      </div>

      <div className="mt-5">
        <label className={LABEL_BASE} htmlFor="qf-company">
          Company
        </label>
        <input
          id="qf-company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          autoComplete="organization"
          className={cn(INPUT_BASE, 'mt-2')}
          placeholder="Company name"
        />
      </div>

      <div className="mt-5">
        <label className={LABEL_BASE} htmlFor="qf-problem">
          Where do you want AI to help?
        </label>
        <textarea
          id="qf-problem"
          rows={4}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className={cn(INPUT_BASE, 'mt-2 resize-none')}
          placeholder="A sentence or two on your team, the tools you use, and where you'd like AI to save time."
        />
      </div>

      <div className="mt-5">
        <label className={LABEL_BASE}>Services of interest</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {SERVICES_OF_INTEREST.map((svc) => {
            const active = services.includes(svc);
            return (
              <button
                key={svc}
                type="button"
                onClick={() => toggleService(svc)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs transition-colors',
                  active
                    ? 'border-traq-purple bg-traq-purple text-white'
                    : 'border-border-subtle bg-white text-ink-soft hover:border-traq-purple/40 hover:text-ink',
                )}
              >
                {svc}
              </button>
            );
          })}
        </div>
      </div>

      {turnstileRequired ? (
        <div className="mt-6 flex justify-center">
          <Turnstile
            siteKey={turnstileSiteKey}
            onSuccess={(t) => onTurnstileToken(t)}
            options={{ theme: 'light', size: 'flexible' }}
          />
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-traq-purple px-6 py-3.5 text-sm font-medium text-white shadow-card transition-all hover:bg-traq-purple-ink hover:shadow-cardHover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send message
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      {errorMessage ? (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
          <p>{errorMessage}</p>
        </div>
      ) : null}

      <p className="mt-5 text-xs text-ink-faint">
        We&rsquo;ll never share your details. Prefer to talk it through?{' '}
        <span className="font-semibold text-traq-purple">Switch to chat above.</span>
      </p>
    </form>
  );
}
