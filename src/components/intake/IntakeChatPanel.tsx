'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { cn } from '@/lib/cn';
import { INPUT_BASE, LABEL_BASE } from '@/lib/intake/ui';
import {
  BUDGET_BANDS,
  REQUIRED_FIELDS,
  SERVICES_OF_INTEREST,
  TIMELINES,
  type LeadProfile,
  type PartialLeadProfile,
} from '@/lib/intake/types';
import { progressPct, type ChoiceSet, type DisplayMessage, type IntakeChat } from '@/hooks/useIntakeChat';

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

type PanelProps = {
  chat: IntakeChat;
  /** Tighter sizing for the floating widget drawer vs. the full homepage section. */
  compact?: boolean;
};

export default function IntakeChatPanel({ chat, compact = false }: PanelProps) {
  if (chat.phase === 'success') {
    return <SuccessPanel firstName={chat.profile.firstName} />;
  }

  if (chat.phase === 'review' || chat.phase === 'submitting') {
    return (
      <ReviewPanel
        profile={chat.profile}
        submitting={chat.phase === 'submitting'}
        onBack={chat.goBackToChat}
        onSubmit={chat.submitFinal}
      />
    );
  }

  return <ChatWindow chat={chat} compact={compact} />;
}

function ChatWindow({ chat, compact }: { chat: IntakeChat; compact: boolean }) {
  const {
    messages,
    profile,
    input,
    setInput,
    sending,
    errorMessage,
    firstSend,
    readyToSubmit,
    choices,
    multiSelected,
    setMultiSelected,
    scrollerRef,
    canSend,
    sendMessage,
    handleSend,
    handleKeyDown,
    goReview,
    turnstileSiteKey,
    turnstileRequired,
    turnstileToken,
    setTurnstileToken,
  } = chat;

  return (
    <div
      className={cn(
        'relative glass-strong flex flex-col overflow-hidden rounded-3xl shadow-card',
        compact ? 'h-full' : 'h-[540px] sm:h-[620px]',
      )}
    >
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
                prev.includes(opt) ? prev.filter((s) => s !== opt) : [...prev, opt],
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
            disabled={chat.phase !== 'chat' || sending}
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
          Powered by Claude. We don&rsquo;t store your chat beyond the email we send to our team
          and to you.
        </p>
      </div>
    </div>
  );
}

type ChoiceChipsProps = {
  choices: ChoiceSet;
  selected: string[];
  onSelectSingle: (option: string) => void;
  onToggleMulti: (option: string) => void;
  onSendMulti: () => void;
};

function ChoiceChips({ choices, selected, onSelectSingle, onToggleMulti, onSendMulti }: ChoiceChipsProps) {
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
              onClick={() => (allowMultiple ? onToggleMulti(opt) : onSelectSingle(opt))}
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
          {selected.length === 0 ? 'Select at least one' : `Send ${selected.length} selected`}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ) : (
        <p className="mt-2 text-[11px] text-ink-faint">Or type something else below.</p>
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

export function SuccessPanel({ firstName }: { firstName?: string }) {
  return (
    <div className="glass-strong flex flex-col items-center rounded-3xl px-8 py-14 text-center shadow-card">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border-subtle bg-traq-tint text-traq-purple">
        <CheckCircle2 className="h-7 w-7" />
      </span>
      <h3 className="mt-6 text-2xl font-semibold text-ink">
        Thanks{firstName ? `, ${firstName}` : ''}.
      </h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
        A Traq specialist has the full brief and will reach out within the next hour. A copy of
        the summary is in your inbox too. Reply to that email if any detail needs correcting.
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
          <h3 className="mt-2 text-xl font-semibold text-ink">Here&rsquo;s what we heard.</h3>
          <p className="mt-1 text-sm text-ink-soft">Fix anything that looks off, then send it over.</p>
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
        <TextField label="First name" value={draft.firstName ?? ''} onChange={(v) => updateField('firstName', v)} />
        <TextField label="Last name" value={draft.lastName ?? ''} onChange={(v) => updateField('lastName', v)} />
        <TextField
          label="Work email"
          type="email"
          value={draft.email ?? ''}
          onChange={(v) => updateField('email', v)}
        />
        <TextField label="Company" value={draft.company ?? ''} onChange={(v) => updateField('company', v)} />
        <TextField label="Industry" value={draft.industry ?? ''} onChange={(v) => updateField('industry', v)} />
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
            onChange={(e) => updateField('timeline', e.target.value as LeadProfile['timeline'])}
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
            onChange={(e) => updateField('budgetBand', e.target.value as LeadProfile['budgetBand'])}
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

export { FIELD_LABELS };
