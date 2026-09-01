'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { cn } from '@/lib/cn';
import { captureAttribution, getAttribution } from '@/lib/attribution';
import {
  COMPANY_SIZES,
  YES_NO,
  aiPlanSessionSchema,
  type CompanySize,
  type YesNo,
} from '@/lib/intake/types';

/**
 * The application form for the 2027 AI Plan session.
 *
 * Validation runs against the same zod schema the API route parses, so a rule
 * cannot drift between the two: the client catches a mistake before the round
 * trip, and the server catches anyone who skips the client entirely. Both put
 * the message back beside the field that produced it.
 *
 * Nothing here disqualifies. Company size and the leadership answer are asked
 * for context and are read by a person later; no answer changes whether the
 * form submits.
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
  | 'role'
  | 'company'
  | 'companySize'
  | 'email'
  | 'repetitiveWork'
  | 'paysForAiTools'
  | 'leadsAiStrategy'
  | 'strategyRole'
  | 'canAttendFullSession';

/** Document order, so the first thing a person has to fix is the first thing focused. */
const FIELD_ORDER: FieldName[] = [
  'name',
  'role',
  'company',
  'companySize',
  'email',
  'repetitiveWork',
  'paysForAiTools',
  'leadsAiStrategy',
  'strategyRole',
  'canAttendFullSession',
];

type Errors = Partial<Record<FieldName, string>>;

type Phase = 'idle' | 'submitting' | 'success';

type Values = {
  name: string;
  role: string;
  company: string;
  companySize: CompanySize | '';
  email: string;
  repetitiveWork: string;
  paysForAiTools: YesNo | '';
  leadsAiStrategy: YesNo | '';
  strategyRole: string;
  canAttendFullSession: boolean;
};

const EMPTY: Values = {
  name: '',
  role: '',
  company: '',
  companySize: '',
  email: '',
  repetitiveWork: '',
  paysForAiTools: '',
  leadsAiStrategy: '',
  strategyRole: '',
  canAttendFullSession: false,
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
}: {
  name: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  labelledBy: string;
  describedBy?: string;
  invalid?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid ? true : undefined}
      className="mt-3 flex flex-wrap gap-2"
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

export default function ApplicationForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');

  const turnstileSiteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? '';
  const turnstileRequired = Boolean(turnstileSiteKey);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState('');

  const fieldRefs = useRef<Partial<Record<FieldName, HTMLElement | null>>>({});
  const successRef = useRef<HTMLDivElement | null>(null);

  // Read gclid and utm values once, so an application that came from an ad can
  // be tied back to the click that paid for it.
  useEffect(() => {
    captureAttribution();
  }, []);

  // Move the reader, and the screen, to the confirmation once the form is gone.
  useEffect(() => {
    if (phase === 'success') successRef.current?.focus();
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
        body: JSON.stringify({ application: parsed.data, turnstileToken }),
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
        setFormError('That is a few applications from one connection. Wait an hour, then try again.');
        return;
      }
      setFormError(
        'Your application did not send. Try again, or email hello@traqcollective.com and I will take it from there.',
      );
    } catch {
      setPhase('idle');
      setFormError(
        'Your application did not send. Try again, or email hello@traqcollective.com and I will take it from there.',
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
          {'Thanks, that’s in. I read every application myself, you’ll hear back within a day or two either way.'}
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

        {/* 2. Role */}
        <div>
          <label className={cn(LABEL_BASE, 'block')} htmlFor="aps-role">
            Role or job title
          </label>
          <input
            id="aps-role"
            ref={(el) => {
              fieldRefs.current.role = el;
            }}
            type="text"
            value={values.role}
            onChange={(e) => setValue('role', e.target.value)}
            autoComplete="organization-title"
            placeholder="Founder, Head of Operations, Managing Director"
            className={cn(INPUT_BASE, 'mt-2', errors.role && INPUT_INVALID)}
            aria-invalid={errors.role ? true : undefined}
            aria-describedby={errors.role ? 'aps-role-error' : undefined}
          />
          <FieldError id="aps-role-error" message={errors.role} />
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

        {/* 5. Email */}
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

        {/* 8. Who is driving it, and the role behind that answer */}
        <div className="space-y-5">
          <fieldset
            ref={(el) => {
              fieldRefs.current.leadsAiStrategy = el;
            }}
            tabIndex={-1}
            className="focus:outline-none"
          >
            <legend id="aps-leads-legend" className={QUESTION_BASE}>
              {'Are you the person leading, or closest to leading, your business’s AI or operations strategy: the owner, a senior operator, or whoever would be driving it day to day?'}
            </legend>
            <RadioPills
              name="leadsAiStrategy"
              labelledBy="aps-leads-legend"
              options={YES_NO}
              value={values.leadsAiStrategy}
              onChange={(v) => setValue('leadsAiStrategy', v as YesNo)}
              describedBy={errors.leadsAiStrategy ? 'aps-leads-error' : undefined}
              invalid={Boolean(errors.leadsAiStrategy)}
            />
            <FieldError id="aps-leads-error" message={errors.leadsAiStrategy} />
          </fieldset>

          <div>
            <label className={cn(LABEL_BASE, 'block')} htmlFor="aps-strategy-role">
              {'What’s your role in that?'}
            </label>
            <input
              id="aps-strategy-role"
              ref={(el) => {
                fieldRefs.current.strategyRole = el;
              }}
              type="text"
              value={values.strategyRole}
              onChange={(e) => setValue('strategyRole', e.target.value)}
              placeholder="A sentence is enough."
              className={cn(INPUT_BASE, 'mt-2', errors.strategyRole && INPUT_INVALID)}
              aria-invalid={errors.strategyRole ? true : undefined}
              aria-describedby={errors.strategyRole ? 'aps-strategy-role-error' : undefined}
            />
            <FieldError id="aps-strategy-role-error" message={errors.strategyRole} />
          </div>
        </div>

        {/* 9. Attendance */}
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
            {'Apply for a seat'}
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
        {'Your details are used to review this application and to write back to you. Nothing else. See our '}
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
