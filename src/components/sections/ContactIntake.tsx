'use client';

import Link from 'next/link';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Sparkles,
  SquarePen,
} from 'lucide-react';
import FadeUp from '@/components/ui/FadeUp';
import { setEnhancedConversionData, track } from '@/components/analytics/Analytics';
import { getAttribution } from '@/lib/attribution';
import { COMPANY } from '@/lib/constants';
import { cn } from '@/lib/cn';
import {
  BUDGET_BANDS,
  REQUIRED_FIELDS,
  SERVICES_OF_INTEREST,
  TIMELINES,
  type ChatMessage,
  type LeadProfile,
  type PartialLeadProfile,
  type QuickIntake,
} from '@/lib/intake/types';

type Mode = 'quick' | 'chat';
type Phase = 'chat' | 'review' | 'submitting' | 'success' | 'error';

type DisplayMessage = ChatMessage & { id: string; streaming?: boolean };

const OPENING_MESSAGE: DisplayMessage = {
  id: 'opening',
  role: 'assistant',
  content:
    "Hi, I'm the Traq intake. Mind if I ask a few quick questions about your team and your tools, so we show up to our first call already up to speed?\n\nLet's start with the basics: what's your full name?",
};

type ChoiceSet = { options: string[]; allowMultiple: boolean };

const FIELD_LABELS: Record<keyof LeadProfile, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  role: 'Role',
  company: 'Company',
  industry: 'Industry',
  problem: 'Core problem',
  painPoints: 'Pain points',
  desiredOutcome: 'Desired outcome',
  servicesOfInterest: 'Services of interest',
  timeline: 'Timeline',
  budgetBand: 'Budget band',
  problemTag: 'Problem tag',
};

const INPUT_BASE =
  'w-full min-h-[44px] rounded-xl border border-border-subtle bg-white px-4 py-3 text-base text-ink placeholder:text-ink-faint transition-colors focus:border-traq-purple focus:outline-none focus:ring-0 sm:text-sm';

const LABEL_BASE =
  'text-[11px] font-semibold uppercase tracking-widest text-ink-faint';

function randId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function progressPct(profile: PartialLeadProfile): number {
  const filled = REQUIRED_FIELDS.filter((f) => {
    const v = profile[f];
    if (v === undefined || v === null) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  }).length;
  return Math.round((filled / REQUIRED_FIELDS.length) * 100);
}

export default function ContactIntake() {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? '';
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRequired = Boolean(turnstileSiteKey);

  const [mode, setMode] = useState<Mode>('quick');
  const [phase, setPhase] = useState<Phase>('chat');
  const [messages, setMessages] = useState<DisplayMessage[]>([OPENING_MESSAGE]);
  const [profile, setProfile] = useState<PartialLeadProfile>({});
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [firstSend, setFirstSend] = useState(true);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [choices, setChoices] = useState<ChoiceSet | null>(null);
  const [multiSelected, setMultiSelected] = useState<string[]>([]);

  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const canSend =
    phase === 'chat' &&
    !sending &&
    input.trim().length > 0 &&
    (!turnstileRequired || !firstSend || turnstileToken.length > 0);

  const sendMessage = useCallback(
    async (text: string) => {
      setSending(true);
      setErrorMessage('');
      setChoices(null);
      setMultiSelected([]);

      const userMsg: DisplayMessage = { id: randId(), role: 'user', content: text };
      const assistantId = randId();
      const assistantPlaceholder: DisplayMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        streaming: true,
      };

      const historyForServer: ChatMessage[] = [...messages, userMsg].map(({ role, content }) => ({
        role,
        content,
      }));

      setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);

      try {
        const res = await fetch('/api/intake/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            messages: historyForServer,
            turnstileToken: firstSend ? turnstileToken : undefined,
            isFirstTurn: firstSend,
          }),
        });

        if (!res.ok || !res.body) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            body?.error === 'rate_limited'
              ? 'We\u2019re getting a lot of activity right now. Give it a minute and try again.'
              : body?.error === 'turnstile_failed'
                ? 'We couldn\u2019t verify the browser. Refresh and try again.'
                : 'Something went wrong. Try again.',
          );
        }

        setFirstSend(false);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let wroteText = false;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let idx: number;
          while ((idx = buffer.indexOf('\n\n')) !== -1) {
            const raw = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);
            const lines = raw.split('\n');
            let event = 'message';
            let data = '';
            for (const line of lines) {
              if (line.startsWith('event: ')) event = line.slice(7).trim();
              else if (line.startsWith('data: ')) data += line.slice(6);
            }
            if (!data) continue;
            let parsed: unknown;
            try {
              parsed = JSON.parse(data);
            } catch {
              continue;
            }

            if (event === 'text') {
              const { delta } = parsed as { delta: string };
              wroteText = true;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + delta } : m,
                ),
              );
            } else if (event === 'fields') {
              const fields = parsed as PartialLeadProfile;
              setProfile((prev) => ({ ...prev, ...fields }));
            } else if (event === 'choices') {
              const c = parsed as ChoiceSet;
              if (c && Array.isArray(c.options) && c.options.length > 0) {
                setChoices(c);
                setMultiSelected([]);
              }
            } else if (event === 'final') {
              const { assistantText, fields, readyToSubmit: rts } = parsed as {
                assistantText: string;
                fields: PartialLeadProfile;
                readyToSubmit: boolean;
              };
              if (!wroteText && assistantText) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: assistantText } : m,
                  ),
                );
              }
              if (fields && Object.keys(fields).length > 0) {
                setProfile((prev) => ({ ...prev, ...fields }));
              }
              if (rts) setReadyToSubmit(true);
            } else if (event === 'error') {
              const { message } = parsed as { message: string };
              throw new Error(message || 'Upstream error');
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m)),
        );
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setErrorMessage(
          err instanceof Error ? err.message : 'Something went wrong. Try again.',
        );
      } finally {
        setSending(false);
      }
    },
    [firstSend, messages, turnstileToken],
  );

  const handleSend = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!canSend) return;
      const text = input.trim();
      setInput('');
      void sendMessage(text);
    },
    [canSend, input, sendMessage],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const goReview = useCallback(() => {
    setPhase('review');
  }, []);

  const goBackToChat = useCallback(() => {
    setPhase('chat');
  }, []);

  const submitFinal = useCallback(
    async (confirmed: PartialLeadProfile) => {
      setPhase('submitting');
      setErrorMessage('');
      try {
        const res = await fetch('/api/intake/submit', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            messages: messages.map(({ role, content }) => ({ role, content })),
            confirmedFields: confirmed,
            click: getAttribution(),
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            body?.error === 'incomplete_profile'
              ? 'A couple of fields still look thin. Fill them in and try again.'
              : body?.error === 'rate_limited'
                ? 'Too many submissions from this network. Try again in a bit.'
                : body?.error === 'email_send_failed'
                  ? 'Your brief didn\u2019t send. Email us directly at hello@traqcollective.com.'
                  : 'Something went wrong. Try again.',
          );
        }
        setEnhancedConversionData(confirmed.email ?? '');
        track('chat_lead_submit');
        setPhase('success');
      } catch (err) {
        setPhase('error');
        setErrorMessage(
          err instanceof Error ? err.message : 'Something went wrong. Try again.',
        );
      }
    },
    [messages],
  );

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
                  const v = profile[f];
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
                  style={{ width: `${progressPct(profile)}%` }}
                />
              </div>
            </div>
          ) : null}
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="relative">
            {phase === 'success' ? (
              <SuccessPanel firstName={profile.firstName} />
            ) : (
              <>
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
              </>
            )}

            {phase === 'success' ? null : mode === 'quick' ? (
              <QuickFormPanel
                turnstileSiteKey={turnstileSiteKey}
                turnstileRequired={turnstileRequired}
                turnstileToken={turnstileToken}
                onTurnstileToken={setTurnstileToken}
                onSuccess={(firstName) => {
                  setProfile((prev) => ({ ...prev, firstName }));
                  setPhase('success');
                }}
              />
            ) : phase === 'review' || phase === 'submitting' ? (
              <ReviewPanel
                profile={profile}
                submitting={phase === 'submitting'}
                onBack={goBackToChat}
                onSubmit={submitFinal}
              />
            ) : (
              <div className="relative glass-strong flex h-[540px] flex-col overflow-hidden rounded-3xl shadow-card sm:h-[620px]">
                <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3 sm:px-6 sm:py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-border-subtle bg-traq-tint text-traq-purple">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">Traq AI intake</p>
                      <p className="text-[11px] text-ink-faint">
                        ~2 minutes &middot; {progressPct(profile)}% captured
                      </p>
                    </div>
                  </div>
                  {readyToSubmit ? (
                    <button
                      onClick={goReview}
                      className="group inline-flex items-center gap-1.5 rounded-full bg-traq-purple px-4 py-2 text-xs font-medium text-white shadow-card transition-all hover:bg-traq-purple-ink"
                    >
                      Review &amp; submit
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ) : null}
                </div>

                <div
                  ref={scrollerRef}
                  className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
                  aria-live="polite"
                >
                  {messages.map((m) => (
                    <MessageBubble key={m.id} message={m} />
                  ))}
                  {sending &&
                  messages.length > 0 &&
                  messages[messages.length - 1]?.role === 'assistant' &&
                  messages[messages.length - 1]?.content === '' ? (
                    <div className="mt-1 flex items-center gap-2 text-xs text-ink-faint">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Thinking&hellip;
                    </div>
                  ) : null}
                </div>

                <div className="border-t border-border-subtle px-4 pt-3 pb-4 sm:px-6 sm:pt-4 sm:pb-5">
                  {turnstileRequired && firstSend ? (
                    <div className="mb-3 flex justify-center">
                      <Turnstile
                        siteKey={turnstileSiteKey}
                        onSuccess={(t) => setTurnstileToken(t)}
                        options={{ theme: 'light', size: 'flexible' }}
                      />
                    </div>
                  ) : null}

                  {choices && !sending ? (
                    <ChoiceChips
                      choices={choices}
                      selected={multiSelected}
                      onSelectSingle={(opt) => {
                        setInput('');
                        void sendMessage(opt);
                      }}
                      onToggleMulti={(opt) =>
                        setMultiSelected((prev) =>
                          prev.includes(opt)
                            ? prev.filter((s) => s !== opt)
                            : [...prev, opt],
                        )
                      }
                      onSendMulti={() => {
                        if (multiSelected.length === 0) return;
                        const text = multiSelected.join(', ');
                        setInput('');
                        void sendMessage(text);
                      }}
                    />
                  ) : null}

                  <form onSubmit={handleSend} className="flex items-end gap-2">
                    <textarea
                      rows={2}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        firstSend && turnstileRequired && turnstileToken.length === 0
                          ? 'One sec, verifying your browser…'
                          : 'Type your answer. Enter to send, Shift+Enter for a newline.'
                      }
                      className={cn(INPUT_BASE, 'resize-none py-3')}
                      disabled={phase !== 'chat' || sending}
                    />
                    <button
                      type="submit"
                      disabled={!canSend}
                      className="group inline-flex h-11 min-w-[52px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-traq-purple px-4 text-sm font-medium text-white shadow-card transition-all hover:bg-traq-purple-ink hover:shadow-cardHover disabled:cursor-not-allowed disabled:opacity-50 sm:h-[46px] sm:px-5"
                      aria-label="Send message"
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <span className="hidden sm:inline">Send</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </form>

                  {errorMessage ? (
                    <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-none" />
                      <p>{errorMessage}</p>
                    </div>
                  ) : null}

                  <p className="mt-3 text-[11px] text-ink-faint">
                    Powered by Claude. We don&rsquo;t store your chat beyond the email we send
                    to our team and to you.
                  </p>
                </div>
              </div>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

type ChoiceChipsProps = {
  choices: ChoiceSet;
  selected: string[];
  onSelectSingle: (option: string) => void;
  onToggleMulti: (option: string) => void;
  onSendMulti: () => void;
};

function ChoiceChips({
  choices,
  selected,
  onSelectSingle,
  onToggleMulti,
  onSendMulti,
}: ChoiceChipsProps) {
  const { options, allowMultiple } = choices;
  return (
    <div className="mb-3">
      <p className="mb-2 text-[11px] uppercase tracking-widest text-ink-faint">
        {allowMultiple ? 'Pick one or more' : 'Pick one'}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() =>
                allowMultiple ? onToggleMulti(opt) : onSelectSingle(opt)
              }
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs transition-colors',
                active
                  ? 'border-traq-purple bg-traq-purple text-white'
                  : 'border-border-subtle bg-white text-ink-soft hover:border-traq-purple/40 hover:text-ink',
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {allowMultiple ? (
        <button
          type="button"
          disabled={selected.length === 0}
          onClick={onSendMulti}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-traq-purple px-4 py-2 text-xs font-medium text-white shadow-card transition-all hover:bg-traq-purple-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {selected.length === 0
            ? 'Select at least one'
            : `Send ${selected.length} selected`}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ) : (
        <p className="mt-2 text-[11px] text-ink-faint">
          Or type something else below.
        </p>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: DisplayMessage }) {
  const isAssistant = message.role === 'assistant';
  return (
    <div className={cn('mb-4 flex', isAssistant ? 'justify-start' : 'justify-end')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
          isAssistant
            ? 'bg-bg-subtle text-ink ring-1 ring-border-subtle'
            : 'bg-traq-purple text-white shadow-card',
        )}
      >
        {message.content}
        {message.streaming && message.content.length > 0 ? (
          <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-white align-middle" />
        ) : null}
      </div>
    </div>
  );
}

function SuccessPanel({ firstName }: { firstName?: string }) {
  return (
    <div className="glass-strong flex flex-col items-center rounded-3xl px-8 py-14 text-center shadow-card">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border-subtle bg-traq-tint text-traq-purple">
        <CheckCircle2 className="h-7 w-7" />
      </span>
      <h3 className="mt-6 text-2xl font-semibold text-ink">
        Thanks{firstName ? `, ${firstName}` : ''}.
      </h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
        A Traq specialist has the full brief and will reach out within the next hour. A copy
        of the summary is in your inbox too. Reply to that email if any detail needs
        correcting.
      </p>
    </div>
  );
}

type ReviewPanelProps = {
  profile: PartialLeadProfile;
  submitting: boolean;
  onBack: () => void;
  onSubmit: (confirmed: PartialLeadProfile) => void;
};

function ReviewPanel({ profile, submitting, onBack, onSubmit }: ReviewPanelProps) {
  const [draft, setDraft] = useState<PartialLeadProfile>(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const missing = useMemo(
    () =>
      REQUIRED_FIELDS.filter((f) => {
        const v = draft[f];
        if (v === undefined || v === null) return true;
        if (typeof v === 'string') return v.trim() === '';
        if (Array.isArray(v)) return v.length === 0;
        return false;
      }),
    [draft],
  );

  const updateField = <K extends keyof LeadProfile>(key: K, value: LeadProfile[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const toggleService = (svc: (typeof SERVICES_OF_INTEREST)[number]) => {
    setDraft((prev) => {
      const list = prev.servicesOfInterest ?? [];
      return {
        ...prev,
        servicesOfInterest: list.includes(svc)
          ? list.filter((s) => s !== svc)
          : [...list, svc],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(draft);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative glass-strong rounded-3xl p-5 shadow-card sm:p-7 md:p-9"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={LABEL_BASE}>Review</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">
            Here&rsquo;s what we heard.
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            Fix anything that looks off, then send it over.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-medium text-ink-soft hover:text-traq-purple"
        >
          Back to chat
        </button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <TextField
          label="First name"
          value={draft.firstName ?? ''}
          onChange={(v) => updateField('firstName', v)}
        />
        <TextField
          label="Last name"
          value={draft.lastName ?? ''}
          onChange={(v) => updateField('lastName', v)}
        />
        <TextField
          label="Work email"
          type="email"
          value={draft.email ?? ''}
          onChange={(v) => updateField('email', v)}
        />
        <TextField
          label="Company"
          value={draft.company ?? ''}
          onChange={(v) => updateField('company', v)}
        />
        <TextField
          label="Industry"
          value={draft.industry ?? ''}
          onChange={(v) => updateField('industry', v)}
        />
      </div>

      <div className="mt-5">
        <label className={LABEL_BASE}>Core problem</label>
        <textarea
          rows={4}
          value={draft.problem ?? ''}
          onChange={(e) => updateField('problem', e.target.value)}
          className={cn(INPUT_BASE, 'mt-2 resize-none')}
        />
      </div>

      <div className="mt-5">
        <label className={LABEL_BASE}>Desired outcome</label>
        <textarea
          rows={3}
          value={draft.desiredOutcome ?? ''}
          onChange={(e) => updateField('desiredOutcome', e.target.value)}
          className={cn(INPUT_BASE, 'mt-2 resize-none')}
        />
      </div>

      <div className="mt-5">
        <label className={LABEL_BASE}>Services of interest</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {SERVICES_OF_INTEREST.map((svc) => {
            const active = (draft.servicesOfInterest ?? []).includes(svc);
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

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={LABEL_BASE}>Timeline</label>
          <select
            value={draft.timeline ?? ''}
            onChange={(e) =>
              updateField('timeline', e.target.value as LeadProfile['timeline'])
            }
            className={cn(INPUT_BASE, 'mt-2 appearance-none pr-10')}
          >
            <option value="" disabled>
              Choose timeline
            </option>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL_BASE}>Budget band</label>
          <select
            value={draft.budgetBand ?? ''}
            onChange={(e) =>
              updateField('budgetBand', e.target.value as LeadProfile['budgetBand'])
            }
            className={cn(INPUT_BASE, 'mt-2 appearance-none pr-10')}
          >
            <option value="" disabled>
              Choose budget band
            </option>
            {BUDGET_BANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {missing.length > 0 ? (
        <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          Still missing:{' '}
          {missing.map((f, i) => (
            <Fragment key={f}>
              {i > 0 ? ', ' : ''}
              {FIELD_LABELS[f]}
            </Fragment>
          ))}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting || missing.length > 0}
        className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-traq-purple px-6 py-3.5 text-sm font-medium text-white shadow-card transition-all hover:bg-traq-purple-ink hover:shadow-cardHover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send to the team
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
};

function TextField({ label, value, onChange, type = 'text' }: TextFieldProps) {
  return (
    <div>
      <label className={LABEL_BASE}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(INPUT_BASE, 'mt-2')}
      />
    </div>
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
                ? 'We couldn\u2019t verify the browser. Refresh and try again.'
                : body?.error === 'email_send_failed'
                  ? 'Your note didn\u2019t send. Email us directly at hello@traqcollective.com.'
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
