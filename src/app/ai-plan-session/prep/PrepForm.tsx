'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { cn } from '@/lib/cn';
import { aiPlanPrepSchema } from '@/lib/intake/types';

/**
 * The pre-session task form.
 *
 * Same validation contract as the application form: one zod schema, parsed on
 * both sides, messages shown against the field that produced them.
 */

const INPUT_BASE =
  'w-full min-h-[44px] rounded-xl border border-border-subtle bg-white px-4 py-3 text-base text-ink placeholder:text-ink-faint transition-colors focus:border-traq-purple focus:outline-none '
  + 'focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-traq-purple focus-visible:ring-offset-2 sm:text-sm';

const LABEL_BASE = 'text-[11px] font-semibold uppercase tracking-widest text-ink-faint';
const QUESTION_BASE = 'block text-[15px] font-semibold leading-snug text-ink';
const INPUT_INVALID = 'border-signal-warn focus:border-signal-warn';

type FieldName =
  | 'name'
  | 'email'
  | 'company'
  | 'workflow'
  | 'hoursPerWeek'
  | 'peopleInvolved'
  | 'anythingElse';

const FIELD_ORDER: FieldName[] = [
  'name',
  'email',
  'company',
  'workflow',
  'hoursPerWeek',
  'peopleInvolved',
  'anythingElse',
];

type Errors = Partial<Record<FieldName, string>>;
type Values = Record<FieldName, string>;

const EMPTY: Values = {
  name: '',
  email: '',
  company: '',
  workflow: '',
  hoursPerWeek: '',
  peopleInvolved: '',
  anythingElse: '',
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-[13px] font-medium text-signal-warn">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

export default function PrepForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [phase, setPhase] = useState<'idle' | 'submitting' | 'success'>('idle');

  const turnstileSiteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? '';
  const turnstileRequired = Boolean(turnstileSiteKey);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState('');

  const fieldRefs = useRef<Partial<Record<FieldName, HTMLElement | null>>>({});
  const successRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (phase === 'success') successRef.current?.focus();
  }, [phase]);

  const setValue = (key: FieldName, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const focusFirstError = (found: Errors) => {
    const first = FIELD_ORDER.find((f) => found[f]);
    const el = first ? fieldRefs.current[first] : null;
    if (!el) return;
    el.focus({ preventScroll: true });
    requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === 'submitting') return;
    setFormError('');
    setTurnstileError('');

    const parsed = aiPlanPrepSchema.safeParse({
      ...values,
      anythingElse: values.anythingElse.trim() || undefined,
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
      const res = await fetch('/api/intake/ai-plan-session/prep', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prep: parsed.data, turnstileToken }),
      });

      if (res.ok) {
        setPhase('success');
        return;
      }

      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        issues?: Record<string, string[] | undefined>;
      };
      setPhase('idle');

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
      setFormError(
        'That did not send. Try again, or email it to nazir@traqcollective.com and I will add it myself.',
      );
    } catch {
      setPhase('idle');
      setFormError(
        'That did not send. Try again, or email it to nazir@traqcollective.com and I will add it myself.',
      );
    }
  };

  if (phase === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="rounded-[24px] border border-border-subtle bg-white p-6 shadow-card focus:outline-none sm:p-9"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border-subtle bg-traq-tint text-traq-purple">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="mt-6 text-lg leading-relaxed text-ink sm:text-xl">
          {'Got it. That is on the board for the session, and I will have looked at it before you walk in.'}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[24px] border border-border-subtle bg-white p-6 shadow-card sm:p-9"
    >
      <div className="space-y-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={cn(LABEL_BASE, 'block')} htmlFor="prep-name">
              Name
            </label>
            <input
              id="prep-name"
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
              aria-describedby={errors.name ? 'prep-name-error' : undefined}
            />
            <FieldError id="prep-name-error" message={errors.name} />
          </div>
          <div>
            <label className={cn(LABEL_BASE, 'block')} htmlFor="prep-company">
              Company
            </label>
            <input
              id="prep-company"
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
              aria-describedby={errors.company ? 'prep-company-error' : undefined}
            />
            <FieldError id="prep-company-error" message={errors.company} />
          </div>
        </div>

        <div>
          <label className={cn(LABEL_BASE, 'block')} htmlFor="prep-email">
            Email
          </label>
          <input
            id="prep-email"
            ref={(el) => {
              fieldRefs.current.email = el;
            }}
            type="email"
            inputMode="email"
            value={values.email}
            onChange={(e) => setValue('email', e.target.value)}
            autoComplete="email"
            placeholder="The address you applied with"
            className={cn(INPUT_BASE, 'mt-2', errors.email && INPUT_INVALID)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'prep-email-error' : undefined}
          />
          <FieldError id="prep-email-error" message={errors.email} />
        </div>

        <div>
          <label className={QUESTION_BASE} htmlFor="prep-workflow">
            {'The one repetitive workflow you want on the board'}
          </label>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-faint">
            {'The task you named in your application, or a better one if something has changed. Describe what actually happens, step by step, in plain language.'}
          </p>
          <textarea
            id="prep-workflow"
            ref={(el) => {
              fieldRefs.current.workflow = el;
            }}
            value={values.workflow}
            onChange={(e) => setValue('workflow', e.target.value)}
            rows={5}
            placeholder="Every morning the coordinators open each new job email, copy the details into the system by hand, then message the engineer to confirm."
            className={cn(
              INPUT_BASE,
              'mt-3 min-h-[140px] resize-y leading-relaxed',
              errors.workflow && INPUT_INVALID,
            )}
            aria-invalid={errors.workflow ? true : undefined}
            aria-describedby={errors.workflow ? 'prep-workflow-error' : undefined}
          />
          <FieldError id="prep-workflow-error" message={errors.workflow} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={cn(LABEL_BASE, 'block')} htmlFor="prep-hours">
              Hours a week it costs
            </label>
            <input
              id="prep-hours"
              ref={(el) => {
                fieldRefs.current.hoursPerWeek = el;
              }}
              type="text"
              value={values.hoursPerWeek}
              onChange={(e) => setValue('hoursPerWeek', e.target.value)}
              placeholder="About 6, more at month end"
              className={cn(INPUT_BASE, 'mt-2', errors.hoursPerWeek && INPUT_INVALID)}
              aria-invalid={errors.hoursPerWeek ? true : undefined}
              aria-describedby={errors.hoursPerWeek ? 'prep-hours-error' : undefined}
            />
            <FieldError id="prep-hours-error" message={errors.hoursPerWeek} />
          </div>
          <div>
            <label className={cn(LABEL_BASE, 'block')} htmlFor="prep-people">
              People who touch it
            </label>
            <input
              id="prep-people"
              ref={(el) => {
                fieldRefs.current.peopleInvolved = el;
              }}
              type="text"
              value={values.peopleInvolved}
              onChange={(e) => setValue('peopleInvolved', e.target.value)}
              placeholder="Three coordinators and me"
              className={cn(INPUT_BASE, 'mt-2', errors.peopleInvolved && INPUT_INVALID)}
              aria-invalid={errors.peopleInvolved ? true : undefined}
              aria-describedby={errors.peopleInvolved ? 'prep-people-error' : undefined}
            />
            <FieldError id="prep-people-error" message={errors.peopleInvolved} />
          </div>
        </div>

        <div>
          <label className={cn(LABEL_BASE, 'block')} htmlFor="prep-else">
            Anything else worth knowing (optional)
          </label>
          <textarea
            id="prep-else"
            ref={(el) => {
              fieldRefs.current.anythingElse = el;
            }}
            value={values.anythingElse}
            onChange={(e) => setValue('anythingElse', e.target.value)}
            rows={3}
            placeholder="Tools it runs through, anything you have already tried, anything that has to stay manual."
            className={cn(
              INPUT_BASE,
              'mt-2 min-h-[90px] resize-y leading-relaxed',
              errors.anythingElse && INPUT_INVALID,
            )}
            aria-invalid={errors.anythingElse ? true : undefined}
            aria-describedby={errors.anythingElse ? 'prep-else-error' : undefined}
          />
          <FieldError id="prep-else-error" message={errors.anythingElse} />
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
            {'Send my workflow'}
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
    </form>
  );
}
