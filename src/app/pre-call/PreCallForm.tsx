'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

const TEAM_SIZES = ['1–5', '6–20', '21–50', '50+'] as const;

const AI_RELATIONSHIPS = [
  'Not using it at all',
  'A few people use it personally — not in our workflows',
  'We\'ve tried tools but nothing has stuck',
  'Some AI in place, but we need more structure',
] as const;

const BOTTLENECKS = [
  'Repetitive tasks eating up team time',
  'Slow client onboarding or delivery',
  'Inconsistent output or quality',
  'Losing deals or leads we should be closing',
  'Team isn\'t working efficiently enough',
] as const;

const TIMELINES = ['Within 2 weeks', '1 month', '3 months', 'Just exploring'] as const;

const BUDGETS = ['Under $1k / month', '$1k–$3k / month', '$3k–$7k / month', '$7k+ / month'] as const;

type Chip<T extends string> = {
  label: string;
  options: readonly T[];
  value: T | null;
  onChange: (v: T) => void;
};

const LABEL = 'text-[11px] font-semibold uppercase tracking-widest text-ink-faint';
const INPUT_BASE =
  'w-full min-h-[44px] rounded-xl border border-border-subtle bg-white px-4 py-3 text-base text-ink placeholder:text-ink-faint transition-colors focus:border-traq-purple focus:outline-none focus:ring-0 sm:text-sm';

function ChipGroup<T extends string>({ label, options, value, onChange }: Chip<T>) {
  return (
    <div>
      <p className={cn(LABEL, 'mb-3')}>{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm transition-colors',
              value === opt
                ? 'border-traq-purple bg-traq-purple text-white'
                : 'border-border-subtle bg-white text-ink-soft hover:border-traq-purple/40 hover:text-ink',
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

type Phase = 'idle' | 'submitting' | 'success' | 'error';

export default function PreCallForm() {
  const [name, setName] = useState('');
  const [teamSize, setTeamSize] = useState<(typeof TEAM_SIZES)[number] | null>(null);
  const [aiRelationship, setAiRelationship] = useState<(typeof AI_RELATIONSHIPS)[number] | null>(null);
  const [bottleneck, setBottleneck] = useState<(typeof BOTTLENECKS)[number] | null>(null);
  const [timeline, setTimeline] = useState<(typeof TIMELINES)[number] | null>(null);
  const [budget, setBudget] = useState<(typeof BUDGETS)[number] | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const canSubmit =
    phase === 'idle' &&
    name.trim().length > 0 &&
    teamSize !== null &&
    aiRelationship !== null &&
    bottleneck !== null &&
    timeline !== null &&
    budget !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setPhase('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/pre-call', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), teamSize, aiRelationship, bottleneck, timeline, budget }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as { error?: string })?.error === 'email_send_failed'
            ? 'Your answers didn\'t send. Email us directly at hello@traqcollective.com.'
            : 'Something went wrong. Try again.',
        );
      }
      setPhase('success');
    } catch (err) {
      setPhase('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    }
  };

  if (phase === 'success') {
    return (
      <div className="glass-strong flex flex-col items-center rounded-3xl px-8 py-14 text-center shadow-card">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border-subtle bg-traq-tint text-traq-purple">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-6 text-2xl font-semibold text-ink">Done, {name.split(' ')[0]}.</h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          We have your answers and we&rsquo;ll come to the call already prepared. See you then.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-strong rounded-3xl p-5 shadow-card sm:p-7 md:p-9"
      noValidate
    >
      <div className="space-y-8">
        <div>
          <label className={cn(LABEL, 'mb-2 block')} htmlFor="pc-name">
            Your name
          </label>
          <input
            id="pc-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="First and last name"
            className={cn(INPUT_BASE)}
          />
        </div>

        <ChipGroup
          label="How many people are in your team?"
          options={TEAM_SIZES}
          value={teamSize}
          onChange={setTeamSize}
        />

        <ChipGroup
          label="How would you describe your team's current relationship with AI?"
          options={AI_RELATIONSHIPS}
          value={aiRelationship}
          onChange={setAiRelationship}
        />

        <ChipGroup
          label="What's the biggest bottleneck in your business right now?"
          options={BOTTLENECKS}
          value={bottleneck}
          onChange={setBottleneck}
        />

        <ChipGroup
          label="If we identify the right system together, how quickly could you move?"
          options={TIMELINES}
          value={timeline}
          onChange={setTimeline}
        />

        <ChipGroup
          label="What's your rough monthly budget for tools and implementation?"
          options={BUDGETS}
          value={budget}
          onChange={setBudget}
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-traq-purple px-6 py-3.5 text-sm font-medium text-white shadow-card transition-all hover:bg-traq-purple-ink hover:shadow-cardHover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {phase === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending&hellip;
          </>
        ) : (
          <>
            Submit answers
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      {(phase === 'error' && errorMessage) ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <p className="mt-5 text-xs text-ink-faint">
        Takes less than 90 seconds. Your answers go straight to the Traq team before your call.
      </p>
    </form>
  );
}
