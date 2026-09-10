'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { cn } from '@/lib/cn';
import { captureAttribution, getAttribution } from '@/lib/attribution';
import { AI_PLAN_EVENT as EVENT } from '@/lib/event';
import { POSITIONS, type Position, type SeatOutcome } from '@/lib/intake/qualify';
import {
  COMPANY_SIZES,
  YES_NO,
  aiPlanSessionSchema,
  type CompanySize,
  type YesNo,
} from '@/lib/intake/types';

/**
 * The sign-up form for the 2027 AI Plan session.
 *
 * Validation runs against the same zod schema the API route parses, so a rule
 * cannot drift between the two: the client catches a mistake before the round
 * trip, and the server catches anyone who skips the client entirely. Both put
 * the message back beside the field that produced it.
 *
 * The form is the qualifier, but it does not do the qualifying. The position
 * answer is sent to the server, the server applies the one rule in
 * lib/intake/qualify.ts, and this component only renders what came back:
 * approved people are sent on to the deposit page, declined people are told
 * here, in plain words, and offered somewhere useful to go instead.
 */

const INPUT_BASE =
  'w-full min-h-[44px] rounded-xl border border-border-subtle bg-white px-4 py-3 text-base text-ink placeholder:text-ink-faint transition-colors focus:border-traq-purple focus:outline-none '
  + 'focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-traq-purple focus-visible:ring-offset-2 sm:text-sm';

const LABEL_BASE = 'text-[11px] font-semibold uppercase tracking-widest text-ink-faint';

const QUESTION_BASE = 'block text-[15px] font-semibold leading-snug text-ink';

/** The red state an input takes when its own message is showing beneath it. */
const INPUT_INVALID = 'border-signal-warn focus:border-signal-warn';

type FieldName =
  | 'name'
  | 'email'
  | 'company'
  | 'companySize'
  | 'position'
  | 'repetitiveWork'
  | 'paysForAiTools'
  | 'canAttendFullSession';

/** Document order, so the first thing a person has to fix is the first thing focused. */
const FIELD_ORDER: FieldName[] = [
  'name',
  'email',
  'company',
  'companySize',
  'position',
  'repetitiveWork',
  'paysForAiTools',
  'canAttendFullSession',
];

type Errors = Partial<Record<FieldName, string>>;

/**
 * 'approved' is shown for the moment it takes to move to the deposit page, and
 * stays if that move fails, with the link. The two declined phases are the end
 * of the road here.
 */
type Phase = 'idle' | 'submitting' | SeatOutcome;

type Values = {
  name: string;
  email: string;
  company: string;
  companySize: CompanySize | '';
  position: Position | '';
  repetitiveWork: string;
  paysForAiTools: YesNo | '';
  canAttendFullSession: boolean;
};

const EMPTY: Values = {
  name: '',
  email: '',
  company: '',
  companySize: '',
  position: '',
  repetitiveWork: '',
  paysForAiTools: '',
  canAttendFullSession: false,
};

/**
 * What replaces the form once the server has decided. Focusable, and announced,
 * so a screen reader lands on the answer rather than on a form that vanished.
 */
function OutcomePanel({
  panelRef,
  tone,
  children,
}: {
  panelRef: React.MutableRefObject<HTMLDivElement | null>;
  tone: 'approved' | 'declined';
  children: React.ReactNode;
}) {
  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      className="rounded-[24px] border border-border-subtle bg-white p-6 shadow-card focus:outline-none sm:p-9"
    >
      <span
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-2xl border border-border-subtle',
          tone === 'approved' ? 'bg-traq-tint text-traq-purple' : 'bg-signal-warn/5 text-signal-warn',
        )}
      >
        {tone === 'approved' ? (
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        ) : (
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        )}
      </span>
      {children}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-[13px] font-medium text-signal-warn">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

/**
 * A radio set rendered as pills. The input stays a real radio, visually hidden
 * but still the thing that receives focus and arrow keys, so the pill can carry
 * a visible focus ring through `peer-focus-visible` without the group losing
 * native keyboard behaviour or its screen reader semantics.
 */
function RadioPills({
  name,
  options,
  value,
  onChange,
  labelledBy,
  describedBy,
  invalid,
  stacked = false,
}: {
  name: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  labelledBy: string;
  describedBy?: string;
  invalid?: boolean;
  /** One pill per line, for options too long to sit side by side. */
  stacked?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid ? true : undefined}
      className={cn('mt-3 flex gap-2', stacked ? 'flex-col items-start' : 'flex-wrap')}
    >
      {options.map((opt) => {
        const id = `${name}-${opt.replace(/\s+/g, '-').toLowerCase()}`;
        const selected = value === opt;
        return (
          <label key={opt} htmlFor={id} className="cursor-pointer">
            <input
              id={id}
              type="radio"
              name={name}
              value={opt}
              checked={selected}
              onChange={() => onChange(opt)}
              className="peer sr-only"
            />
            <span
              className={cn(
                'inline-flex min-h-[44px] items-center rounded-full border px-5 py-2.5 text-sm transition-colors',
                'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-traq-purple',
                selected
                  ? 'border-traq-purple bg-traq-purple font-semibold text-white'
                  : 'border-border-subtle bg-white text-ink-soft hover:border-traq-purple/40 hover:text-ink',
                !selected && invalid ? 'border-signal-warn' : '',
              )}
            >
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export default function SignUpForm() {
  const router = useRouter();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [nextUrl, setNextUrl] = useState('');

  const turnstileSiteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? '';
  const turnstileRequired = Boolean(turnstileSiteKey);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState('');

  const fieldRefs = useRef<Partial<Record<FieldName, HTMLElement | null>>>({});
  const successRef = useRef<HTMLDivElement | null>(null);

  // Read gclid and utm values once, so a sign-up that came from an ad can be
  // tied back to the click that paid for it.
  useEffect(() => {
    captureAttribution();
  }, []);

  // Move the reader, and the screen, to the outcome once the form is gone.
  useEffect(() => {
    if (phase !== 'idle' && phase !== 'submitting') successRef.current?.focus();
  }, [phase]);

  const setValue = <K extends keyof Values>(key: K, v: Values[K]) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    // Clear a message the moment the person starts fixing what it is about.
    setErrors((prev) => (prev[key as FieldName] ? { ...prev, [key]: undefined } : prev));
  };

  const focusFirstError = (found: Errors) => {
    const first = FIELD_ORDER.find((f) => found[f]);
    const el = first ? fieldRefs.current[first] : null;
    if (!el) return;
    // Focus without scrolling, then scroll on the next frame: the messages that
    // just appeared change the page height, and scrolling before React commits
    // them lands somewhere slightly wrong. Someone who submitted from the
    // bottom of a long form has to be shown the field that stopped them.
    el.focus({ preventScroll: true });
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === 'submitting') return;

    setFormError('');
    setTurnstileError('');

    const parsed = aiPlanSessionSchema.safeParse({
      ...values,
      click: getAttribution(),
    });

    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const found: Errors = {};
      for (const field of FIELD_ORDER) {
        const message = flat[field]?.[0];
        if (message) found[field] = message;
      }
      setErrors(found);
      focusFirstError(found);
      return;
    }

    if (turnstileRequired && !turnstileToken) {
      setTurnstileError('Complete the check so we know you are human.');
      return;
    }

    setErrors({});
    setPhase('submitting');

    try {
      const res = await fetch('/api/intake/ai-plan-session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ signUp: parsed.data, turnstileToken }),
      });

      if (res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          outcome?: SeatOutcome;
          next?: string | null;
        };
        const outcome = body.outcome ?? 'approved';
        setPhase(outcome);
        if (outcome === 'approved' && body.next) {
          setNextUrl(body.next);
          // Straight on to the deposit page. The approved panel underneath
          // carries the same link, for a browser that blocks the navigation.
          router.push(body.next);
        }
        return;
      }

      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        issues?: Record<string, string[] | undefined>;
      };

      setPhase('idle');

      // The server found something the client let through. Put its messages
      // beside the same fields rather than showing a banner nobody can act on.
      if (body.error === 'validation_failed' && body.issues) {
        const found: Errors = {};
        for (const field of FIELD_ORDER) {
          const message = body.issues[field]?.[0];
          if (message) found[field] = message;
        }
        if (Object.keys(found).length > 0) {
          setErrors(found);
          focusFirstError(found);
          return;
        }
      }

      if (body.error === 'turnstile_failed') {
        setTurnstileError('That check did not pass. Try it once more.');
        return;
      }
      if (body.error === 'rate_limited') {
        setFormError('That is a few sign-ups from one connection. Wait an hour, then try again.');
        return;
      }
      if (body.error === 'closed') {
        setFormError(
          'The room filled while you were typing. Email hello@traqcollective.com and I will put you first on the waiting list.',
        );
        return;
      }
      setFormError(
        'Your sign-up did not send. Try again, or email hello@traqcollective.com and I will take it from there.',
      );
    } catch {
      setPhase('idle');
      setFormError(
        'Your sign-up did not send. Try again, or email hello@traqcollective.com and I will take it from there.',
      );
    }
  };

  if (phase === 'approved') {
    return (
      <OutcomePanel panelRef={successRef} tone="approved">
        <h2 className="mt-6 text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl">
          {'You are through.'}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {`One step left: a fully refundable AED ${EVENT.depositAed} hold, returned to you in the room on the day. Your seat is not held until it is done. Taking you there now.`}
        </p>
        {nextUrl ? (
          <Link
            href={nextUrl}
            className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full focus-visible:rounded-full bg-traq-purple px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-traq-purple-ink hover:shadow-cardHover"
          >
            {`Hold my seat with AED ${EVENT.depositAed}`}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        ) : null}
      </OutcomePanel>
    );
  }

  if (phase === 'declined_not_leadership') {
    return (
      <OutcomePanel panelRef={successRef} tone="declined">
        <h2 className="mt-6 text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl">
          {'This one isn’t built for your seat, and I’d rather say so now than waste your afternoon.'}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {'The session ends with a decision: which workflow to change first, and which to leave alone. That decision belongs to whoever owns the operation, so the room is kept to founders, MDs and the people who run a function.'}
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {'If that’s your MD or your Head of Operations, send them this page. It takes two minutes. In the meantime, the AI readiness assessment is free and scores on the same four axes.'}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/ai-readiness"
            className="group inline-flex items-center justify-center gap-2 rounded-full focus-visible:rounded-full bg-traq-purple px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-traq-purple-ink hover:shadow-cardHover"
          >
            {'Take the AI readiness assessment'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <Link
            href="/ai-plan-session"
            className="inline-flex items-center justify-center rounded-full focus-visible:rounded-full border border-border-subtle bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-traq-purple/40"
          >
            {'Back to the session page'}
          </Link>
        </div>
      </OutcomePanel>
    );
  }

  if (phase === 'declined_competitor') {
    return (
      <OutcomePanel panelRef={successRef} tone="declined">
        <h2 className="mt-6 text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl">
          {'This room is for operators, not for people in our line of work.'}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {'Nothing personal, and it’s the same answer every time. If you’d like to compare notes another way, email hello@traqcollective.com and I will reply properly.'}
        </p>
        <Link
          href="/ai-plan-session"
          className="mt-6 inline-flex items-center justify-center rounded-full focus-visible:rounded-full border border-border-subtle bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-traq-purple/40"
        >
          {'Back to the session page'}
        </Link>
      </OutcomePanel>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[24px] border border-border-subtle bg-white p-6 shadow-card sm:p-9"
    >
      <div className="space-y-7">
        {/* 1. Name */}
        <div>
          <label className={cn(LABEL_BASE, 'block')} htmlFor="aps-name">
            Name
          </label>
          <input
            id="aps-name"
            ref={(el) => {
              fieldRefs.current.name = el;
            }}
            type="text"
            value={values.name}
            onChange={(e) => setValue('name', e.target.value)}
            autoComplete="name"
            placeholder="First and last name"
            className={cn(INPUT_BASE, 'mt-2', errors.name && INPUT_INVALID)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'aps-name-error' : undefined}
          />
          <FieldError id="aps-name-error" message={errors.name} />
        </div>

        {/* 2. Email */}
        <div>
          <label className={cn(LABEL_BASE, 'block')} htmlFor="aps-email">
            Email
          </label>
          <input
            id="aps-email"
            ref={(el) => {
              fieldRefs.current.email = el;
            }}
            type="email"
            inputMode="email"
            value={values.email}
            onChange={(e) => setValue('email', e.target.value)}
            autoComplete="email"
            placeholder="you@company.com"
            className={cn(INPUT_BASE, 'mt-2', errors.email && INPUT_INVALID)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'aps-email-error' : undefined}
          />
          <FieldError id="aps-email-error" message={errors.email} />
        </div>

        {/* 3. Company */}
        <div>
          <label className={cn(LABEL_BASE, 'block')} htmlFor="aps-company">
            Company
          </label>
          <input
            id="aps-company"
            ref={(el) => {
              fieldRefs.current.company = el;
            }}
            type="text"
            value={values.company}
            onChange={(e) => setValue('company', e.target.value)}
            autoComplete="organization"
            placeholder="Company name"
            className={cn(INPUT_BASE, 'mt-2', errors.company && INPUT_INVALID)}
            aria-invalid={errors.company ? true : undefined}
            aria-describedby={errors.company ? 'aps-company-error' : undefined}
          />
          <FieldError id="aps-company-error" message={errors.company} />
        </div>

        {/* 4. Company size. Context only: no answer here changes the outcome. */}
        <div>
          <label className={cn(LABEL_BASE, 'block')} htmlFor="aps-company-size">
            Company size
          </label>
          <select
            id="aps-company-size"
            ref={(el) => {
              fieldRefs.current.companySize = el;
            }}
            value={values.companySize}
            onChange={(e) => setValue('companySize', e.target.value as CompanySize)}
            className={cn(
              INPUT_BASE,
              'mt-2 appearance-none bg-white pr-10',
              !values.companySize && 'text-ink-faint',
              errors.companySize && INPUT_INVALID,
            )}
            aria-invalid={errors.companySize ? true : undefined}
            aria-describedby={errors.companySize ? 'aps-company-size-error' : undefined}
          >
            <option value="" disabled>
              Choose one
            </option>
            {COMPANY_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <FieldError id="aps-company-size-error" message={errors.companySize} />
        </div>

        {/* 5. Position. The one answer the server decides on. */}
        <fieldset
          ref={(el) => {
            fieldRefs.current.position = el;
          }}
          tabIndex={-1}
          className="focus:outline-none"
        >
          <legend id="aps-position-legend" className={QUESTION_BASE}>
            {'Which best describes your position?'}
          </legend>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-faint">
            {'The session ends with a decision about your own operation, so the room is kept to the people who can make it.'}
          </p>
          <RadioPills
            name="position"
            labelledBy="aps-position-legend"
            options={POSITIONS}
            value={values.position}
            onChange={(v) => setValue('position', v as Position)}
            describedBy={errors.position ? 'aps-position-error' : undefined}
            invalid={Boolean(errors.position)}
            stacked
          />
          <FieldError id="aps-position-error" message={errors.position} />
        </fieldset>

        {/* 6. The one repetitive thing */}
        <div>
          <label className={QUESTION_BASE} htmlFor="aps-repetitive">
            {'What is the single most repetitive thing your team does every day that you wish it didn’t?'}
          </label>
          <textarea
            id="aps-repetitive"
            ref={(el) => {
              fieldRefs.current.repetitiveWork = el;
            }}
            value={values.repetitiveWork}
            onChange={(e) => setValue('repetitiveWork', e.target.value)}
            rows={4}
            placeholder="One to three sentences is plenty."
            className={cn(
              INPUT_BASE,
              'mt-3 min-h-[120px] resize-y leading-relaxed',
              errors.repetitiveWork && INPUT_INVALID,
            )}
            aria-invalid={errors.repetitiveWork ? true : undefined}
            aria-describedby={errors.repetitiveWork ? 'aps-repetitive-error' : undefined}
          />
          <FieldError id="aps-repetitive-error" message={errors.repetitiveWork} />
        </div>

        {/* 7. Existing AI spend */}
        <fieldset
          ref={(el) => {
            fieldRefs.current.paysForAiTools = el;
          }}
          tabIndex={-1}
          className="focus:outline-none"
        >
          <legend id="aps-pays-legend" className={QUESTION_BASE}>
            {'Do you currently pay for ChatGPT, Copilot, Gemini or a similar AI tool for your team?'}
          </legend>
          <RadioPills
            name="paysForAiTools"
            labelledBy="aps-pays-legend"
            options={YES_NO}
            value={values.paysForAiTools}
            onChange={(v) => setValue('paysForAiTools', v as YesNo)}
            describedBy={errors.paysForAiTools ? 'aps-pays-error' : undefined}
            invalid={Boolean(errors.paysForAiTools)}
          />
          <FieldError id="aps-pays-error" message={errors.paysForAiTools} />
        </fieldset>

        {/* 8. Attendance */}
        <div className="border-t border-border-subtle pt-7">
          <label htmlFor="aps-attend" className="flex cursor-pointer items-start gap-3">
            <input
              id="aps-attend"
              ref={(el) => {
                fieldRefs.current.canAttendFullSession = el;
              }}
              type="checkbox"
              checked={values.canAttendFullSession}
              onChange={(e) => setValue('canAttendFullSession', e.target.checked)}
              className={cn(
                'mt-0.5 h-5 w-5 flex-none cursor-pointer rounded border-border-strong accent-traq-purple',
                errors.canAttendFullSession && 'outline outline-1 outline-signal-warn',
              )}
              aria-invalid={errors.canAttendFullSession ? true : undefined}
              aria-describedby={errors.canAttendFullSession ? 'aps-attend-error' : undefined}
            />
            <span className="text-[15px] leading-relaxed text-ink">
              {'I can attend the full session, not just part of it.'}
            </span>
          </label>
          <FieldError id="aps-attend-error" message={errors.canAttendFullSession} />
        </div>
      </div>

      {turnstileRequired ? (
        <div className="mt-8">
          <div className="flex justify-center">
            <Turnstile
              siteKey={turnstileSiteKey}
              onSuccess={(t) => {
                setTurnstileToken(t);
                setTurnstileError('');
              }}
              onExpire={() => setTurnstileToken('')}
              options={{ theme: 'light', size: 'flexible' }}
            />
          </div>
          {turnstileError ? (
            <p className="mt-2 flex items-start justify-center gap-1.5 text-[13px] font-medium text-signal-warn">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
              <span>{turnstileError}</span>
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={phase === 'submitting'}
        className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full focus-visible:rounded-full bg-traq-purple px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-traq-purple-ink hover:shadow-cardHover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {phase === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {'Sending…'}
          </>
        ) : (
          <>
            {'Reserve my seat'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </>
        )}
      </button>

      <div aria-live="polite">
        {formError ? (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-signal-warn/30 bg-signal-warn/5 px-4 py-3 text-sm text-signal-warn">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
            <p>{formError}</p>
          </div>
        ) : null}
      </div>

      <p className="mt-5 text-[13px] leading-relaxed text-ink-faint">
        {'Your details are used to hold your seat and to write to you about the session. Nothing else. See our '}
        <a
          href="/privacy"
          className="underline underline-offset-4 transition-colors hover:text-traq-purple"
        >
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
