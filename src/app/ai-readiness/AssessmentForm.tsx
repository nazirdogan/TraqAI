'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Turnstile } from '@marsidev/react-turnstile';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { track } from '@/components/analytics/Analytics';
import {
  attributionSummary,
  captureAttribution,
  getAttribution,
} from '@/lib/attribution';
import { cn } from '@/lib/cn';

/**
 * AI Readiness Assessment: client scorecard + lead capture.
 *
 * A short scorecard across five dimensions (tools in place, team confidence,
 * training done, leadership buy-in, use-case clarity). The client computes a
 * band (Early / Building / Ready) and shows tailored next steps inline, then a
 * name/email/company capture that POSTs to /api/intake/assessment. Light, flat,
 * gradient-free, matching the rest of the site.
 */

type Dimension =
  | 'tools'
  | 'confidence'
  | 'training'
  | 'leadership'
  | 'use-cases';

type Option = { label: string; score: 0 | 1 | 2 | 3 };

type Question = {
  id: string;
  dimension: Dimension;
  /** Phrased the way a buyer would think about it. */
  prompt: string;
  /** Short helper line under the prompt. */
  hint?: string;
  options: Option[];
};

// 9 questions across the five dimensions. Each option scores 0 to 3, so the
// max score is 27. Order goes from easy-to-answer to more reflective.
const QUESTIONS: Question[] = [
  {
    id: 'tools-paid',
    dimension: 'tools',
    prompt: 'Has your team paid for AI tools like ChatGPT, Copilot or Gemini?',
    hint: 'Licences you already cover, even if people barely touch them.',
    options: [
      { label: 'No paid AI tools yet', score: 0 },
      { label: 'One tool, a few people', score: 1 },
      { label: 'A couple of tools across some teams', score: 2 },
      { label: 'Tools rolled out across the company', score: 3 },
    ],
  },
  {
    id: 'tools-usage',
    dimension: 'tools',
    prompt: 'How much of your team actually uses those tools each week?',
    hint: 'Real, regular use, not a one-off login.',
    options: [
      { label: 'Almost nobody', score: 0 },
      { label: 'A handful of early adopters', score: 1 },
      { label: 'About half the team', score: 2 },
      { label: 'Most of the team, most weeks', score: 3 },
    ],
  },
  {
    id: 'confidence',
    dimension: 'confidence',
    prompt: 'How confident does your team feel using AI in their day-to-day work?',
    hint: 'Be honest about the average, not your best person.',
    options: [
      { label: 'Nervous or unsure where to start', score: 0 },
      { label: 'Curious but hesitant', score: 1 },
      { label: 'Comfortable on a few tasks', score: 2 },
      { label: 'Confident and trying new things', score: 3 },
    ],
  },
  {
    id: 'training',
    dimension: 'training',
    prompt: 'Has your team had any structured AI training?',
    hint: 'Hands-on sessions on your real work, not a webinar they half-watched.',
    options: [
      { label: 'None at all', score: 0 },
      { label: 'A one-off intro session', score: 1 },
      { label: 'Some training for a few roles', score: 2 },
      { label: 'Ongoing, role-specific training', score: 3 },
    ],
  },
  {
    id: 'guardrails',
    dimension: 'training',
    prompt: 'Do people know what is safe to put into AI tools?',
    hint: 'Clear, simple guidance on data, privacy and approved tools.',
    options: [
      { label: 'No guidance, people guess', score: 0 },
      { label: 'A few informal rules', score: 1 },
      { label: 'Written guidance most people know', score: 2 },
      { label: 'Clear guardrails everyone follows', score: 3 },
    ],
  },
  {
    id: 'leadership',
    dimension: 'leadership',
    prompt: 'How bought-in is leadership on getting AI adopted?',
    hint: 'Whether the people above you actively back it.',
    options: [
      { label: 'Not on the radar', score: 0 },
      { label: 'Interested but no plan', score: 1 },
      { label: 'Supportive and asking for it', score: 2 },
      { label: 'Driving it with time and budget', score: 3 },
    ],
  },
  {
    id: 'ownership',
    dimension: 'leadership',
    prompt: 'Does anyone own AI adoption inside the company?',
    hint: 'A person or team responsible for making it happen, not a side task.',
    options: [
      { label: 'Nobody owns it', score: 0 },
      { label: 'Someone does it on the side', score: 1 },
      { label: 'A clear owner with some time', score: 2 },
      { label: 'A dedicated owner or partner', score: 3 },
    ],
  },
  {
    id: 'use-cases',
    dimension: 'use-cases',
    prompt: 'How clear are you on where AI saves your team the most time?',
    hint: 'The specific workflows, not a vague sense that it could help.',
    options: [
      { label: 'No idea where to start', score: 0 },
      { label: 'A few rough hunches', score: 1 },
      { label: 'A handful of clear use cases', score: 2 },
      { label: 'A prioritised list by payoff', score: 3 },
    ],
  },
  {
    id: 'measurement',
    dimension: 'use-cases',
    prompt: 'Are you measuring the time or money AI is saving?',
    hint: 'A number you can point to, even a rough one.',
    options: [
      { label: 'Not measuring anything', score: 0 },
      { label: 'We talk about it informally', score: 1 },
      { label: 'We track a few things', score: 2 },
      { label: 'We measure adoption and impact', score: 3 },
    ],
  },
];

const MAX_SCORE = QUESTIONS.length * 3; // 27

type Band = 'Early' | 'Building' | 'Ready';

type BandDetail = {
  band: Band;
  blurb: string;
  steps: string[];
  /** Where the inline CTA after the steps points. */
  guideHref: string;
  guideLabel: string;
};

function bandFor(score: number): BandDetail {
  // Thresholds split the 0-27 range into three friendly bands.
  if (score <= 9) {
    return {
      band: 'Early',
      blurb:
        'You are early, and that is fine. The tools are new to your team and nothing is wired in yet. The fastest wins come from picking one workflow and training a small group on it well.',
      steps: [
        'Pick one team and one task that eats hours every week.',
        'Get that group two to three hands-on sessions on their real work.',
        'Write three simple rules for what is safe to put into AI tools.',
        'Name one person to own adoption, even part-time, so it does not stall.',
      ],
      guideHref: '/insights/how-to-get-your-team-using-ai',
      guideLabel: 'Read: how to get your team using AI',
    };
  }
  if (score <= 18) {
    return {
      band: 'Building',
      blurb:
        'You are building. Some people use AI, you have a sense of where it helps, and leadership is interested. The gap now is consistency: turning a few early adopters into regular use across the team.',
      steps: [
        'Run role-specific training so each team learns AI on their own tasks.',
        'Turn your best use cases into shared, repeatable workflows.',
        'Set clear guardrails everyone follows, not just a few informal rules.',
        'Start measuring hours saved so the wins are visible to leadership.',
      ],
      guideHref: '/insights/ai-readiness-checklist',
      guideLabel: 'Read: the AI readiness checklist',
    };
  }
  return {
    band: 'Ready',
    blurb:
      'You are ready. Tools are in place, your team is confident, and leadership backs it. The work now is depth and governance: scaling what works, embedding AI into more workflows, and keeping it safe as you grow.',
    steps: [
      'Scale your proven workflows to more teams and tasks.',
      'Embed AI into the tools you already use, with guardrails built in.',
      'Set a cadence to review adoption, impact and what to build next.',
      'Look at agentic workflows for the repetitive work that runs itself.',
    ],
    guideHref: '/insights/how-agentic-workflows-work',
    guideLabel: 'Read: how agentic workflows work',
  };
}

const DIMENSION_LABELS: Record<Dimension, string> = {
  tools: 'Tools in place',
  confidence: 'Team confidence',
  training: 'Training and guardrails',
  leadership: 'Leadership buy-in',
  'use-cases': 'Use-case clarity',
};

type Phase =
  | 'quiz'
  | 'capture'
  | 'budget'
  | 'result'
  | 'submitting'
  | 'success'
  | 'error';

/**
 * Budget bands for the optional closing question.
 *
 * Deliberately coarse, and "not set yet" is listed first so it reads as a
 * normal answer rather than a disqualification. This does not touch the score:
 * readiness and budget are different things, and folding one into the other
 * would move the band thresholds.
 */
const BUDGET_OPTIONS = [
  'No budget set yet',
  'Under AED 15,000',
  'AED 15,000 to 50,000',
  'Over AED 50,000',
] as const;

export type AssessmentFormProps = {
  /**
   * Ask for the email this many questions in, as a delivery mechanism for the
   * score rather than a gate. Everyone who abandons after this point stays
   * reachable, and completion barely moves. Omit for the original behaviour,
   * where the email is only asked for at the result.
   */
  captureEmailAfter?: number;
  /**
   * When set, a Building or Ready result leads with a booking CTA instead of
   * dead-ending at an article. Those two bands have just told us they have
   * tools in place and leadership behind them, which is the qualification a
   * discovery call would otherwise establish. Early never books: they are
   * honestly not ready, and the article plus nurture serves them better.
   */
  bookingHref?: string;
  /** Where this submission came from, so paid leads are attributable. */
  source?: string;
  /**
   * Overrides the outer wrapper. Defaults to the centred 2xl measure the
   * /ai-readiness page uses; the landing pages pass a full-width value so the
   * card fills its grid column and lines up with the copy above it.
   */
  containerClassName?: string;
  /**
   * Adds one optional, unscored question after the last real one: whether a
   * budget exists yet. An answer sizes the format we suggest, and "not yet" is
   * just as useful to know before a call.
   */
  askBudget?: boolean;
  /**
   * Tightens the card's internal spacing. Used on the landing pages, where the
   * quiz sits inside a column rather than alone on a page and the first
   * question should land higher in the viewport.
   */
  compact?: boolean;
};

const INPUT_BASE =
  'w-full min-h-[44px] rounded-xl border border-border-subtle bg-white px-4 py-3 text-base text-ink placeholder:text-ink-faint transition-colors focus:border-traq-purple focus:outline-none focus:ring-0 sm:text-sm';

const LABEL_BASE =
  'text-[11px] font-semibold uppercase tracking-widest text-ink-faint';

export default function AssessmentForm({
  captureEmailAfter,
  bookingHref,
  source,
  compact = false,
  containerClassName = 'mx-auto max-w-2xl',
  askBudget = false,
}: AssessmentFormProps = {}) {
  // One shell class for all four phases, so compact never drifts between them.
  const cardClass = cn(
    'rounded-[24px] border border-border-subtle bg-white shadow-card',
    compact ? 'p-5 sm:p-7' : 'p-6 sm:p-9',
  );
  const promptGap = compact ? 'mt-6' : 'mt-8';
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? '';
  const turnstileRequired = Boolean(turnstileSiteKey);
  const [turnstileToken, setTurnstileToken] = useState('');

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<Phase>('quiz');

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // The mid-quiz email step runs at most once, whether it was filled or skipped.
  const [emailStepSeen, setEmailStepSeen] = useState(false);
  const [captureError, setCaptureError] = useState('');
  const [budget, setBudget] = useState('');
  const [completedFired, setCompletedFired] = useState(false);

  // Read gclid/utm once per session so the lead can be tied back to the click.
  useEffect(() => {
    captureAttribution();
  }, []);

  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / QUESTIONS.length) * 100);

  const score = useMemo(
    () => QUESTIONS.reduce((total, q) => total + (answers[q.id] ?? 0), 0),
    [answers],
  );
  const detail = useMemo(() => bandFor(score), [score]);
  const current = QUESTIONS[step];

  // Conversion action 3. The result being on screen is the completion, not the
  // form submit below it: most people read the score and never fill the form.
  useEffect(() => {
    if (phase !== 'result' || completedFired) return;
    setCompletedFired(true);
    track('assessment_completed', {
      score,
      band: detail.band,
      source,
    });
  }, [phase, completedFired, score, detail.band, source]);


  // A readable per-dimension breakdown for the result screen and the email.
  const dimensionBreakdown = useMemo(() => {
    const totals: Record<Dimension, { got: number; max: number }> = {
      tools: { got: 0, max: 0 },
      confidence: { got: 0, max: 0 },
      training: { got: 0, max: 0 },
      leadership: { got: 0, max: 0 },
      'use-cases': { got: 0, max: 0 },
    };
    for (const q of QUESTIONS) {
      totals[q.dimension].got += answers[q.id] ?? 0;
      totals[q.dimension].max += 3;
    }
    return totals;
  }, [answers]);

  const handleSelect = (questionId: string, value: number) => {
    // Conversion action 1. Fires once, on the first answer of the session.
    if (Object.keys(answers).length === 0) {
      track('assessment_started', { source });
    }
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    const nextStep = step + 1;

    // Ask for the email as soon as the configured question is answered, then
    // carry on. Asked here it reads as "where do we send this", not as a wall.
    if (
      captureEmailAfter !== undefined &&
      nextStep === captureEmailAfter &&
      !emailStepSeen &&
      nextStep < QUESTIONS.length
    ) {
      setStep(nextStep);
      setPhase('capture');
      return;
    }

    // Auto-advance for momentum; the last question lands on the result, or on
    // the budget question first where that is switched on.
    if (step < QUESTIONS.length - 1) {
      setStep(nextStep);
    } else {
      setPhase(askBudget ? 'budget' : 'result');
    }
  };

  const answerBudget = (value: string) => {
    setBudget(value);
    track('budget_answered', { budget: value, source });
    setPhase('result');
  };

  /** Leave the mid-quiz email step, with or without an address. */
  const leaveCaptureStep = (withEmail: boolean) => {
    if (withEmail) {
      const trimmed = email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
        setCaptureError('Enter an email we can send the score to.');
        return;
      }
      // Conversion action 2, and the reason the email is asked for here at all:
      // it has to exist somewhere other than this tab before they can abandon.
      track('email_captured', { step: captureEmailAfter ?? 0, source });
      void fetch('/api/intake/assessment/partial', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          answered: Object.keys(answers).length,
          source,
          attribution: attributionSummary(getAttribution()),
        }),
        keepalive: true,
      }).catch(() => {
        // Best effort. A failed partial capture must never block the quiz.
      });
    }
    setCaptureError('');
    setEmailStepSeen(true);
    setPhase('quiz');
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setPhase('quiz');
    setFirstName('');
    setEmail('');
    setCompany('');
    setErrorMessage('');
    setEmailStepSeen(false);
    setCaptureError('');
    setBudget('');
    setCompletedFired(false);
  };

  const canSubmit =
    phase === 'result' &&
    firstName.trim().length > 0 &&
    email.trim().length > 0 &&
    company.trim().length > 0 &&
    (!turnstileRequired || turnstileToken.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setPhase('submitting');
    setErrorMessage('');

    // Send the answers as readable label pairs so the team email is legible
    // without any lookup against this component.
    const answerDetail = QUESTIONS.map((q) => {
      const value = answers[q.id] ?? 0;
      const chosen = q.options.find((o) => o.score === value);
      return {
        question: q.prompt,
        answer: chosen?.label ?? 'No answer',
        score: value,
      };
    });

    try {
      const res = await fetch('/api/intake/assessment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          intake: {
            firstName: firstName.trim(),
            email: email.trim(),
            company: company.trim(),
            answers: answerDetail,
            score,
            band: detail.band,
            source,
            budget: budget || undefined,
            attribution: attributionSummary(getAttribution()),
          },
          turnstileToken: turnstileRequired ? turnstileToken : undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body?.error === 'validation_failed'
            ? 'Double-check your details and try again.'
            : body?.error === 'rate_limited'
              ? 'Too many submissions from this network. Try again in a bit.'
              : body?.error === 'turnstile_failed'
                ? 'We couldn’t verify the browser. Refresh and try again.'
                : body?.error === 'email_send_failed'
                  ? 'Your results didn’t send. Email us directly at hello@traqcollective.com.'
                  : 'Something went wrong. Try again.',
        );
      }
      track('assessment_submit', { band: detail.band, score, source });
      setPhase('success');
    } catch (err) {
      setPhase('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Try again.',
      );
    }
  };

  if (phase === 'success') {
    return (
      <div className={containerClassName}>
        <div className="rounded-[24px] border border-border-subtle bg-white px-6 py-12 text-center shadow-card sm:px-10 sm:py-14">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border-subtle bg-traq-tint text-traq-purple">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h2 className="mt-6 text-2xl font-semibold text-ink">
            Thanks{firstName ? `, ${firstName}` : ''}. Your results are on the way.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
            We have sent your full results and a tailored plan to{' '}
            <span className="font-semibold text-ink">{email}</span>. If you want
            to talk it through, book a free call and we will find where AI saves
            your team the most time.
          </p>
          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/book"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-traq-purple px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]"
            >
              Book a free call
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border-strong bg-white px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-traq-purple hover:text-traq-purple"
            >
              <RotateCcw className="h-4 w-4" />
              Retake the assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mid-quiz capture. The score is the thing being delivered, so the ask is
  // framed as a delivery address and stays skippable: a hard gate here costs
  // more completions than the addresses are worth.
  if (phase === 'capture') {
    return (
      <div className={containerClassName}>
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-4">
            <p className={LABEL_BASE}>Almost there</p>
            <p className="text-[13px] font-medium text-ink-faint">
              {answeredCount} of {QUESTIONS.length} answered
            </p>
          </div>

          <div
            className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border-subtle"
            role="progressbar"
            aria-valuenow={answeredCount}
            aria-valuemin={0}
            aria-valuemax={QUESTIONS.length}
          >
            <div
              className="h-full rounded-full bg-traq-purple transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <h2
            className={cn(
              promptGap,
              'text-balance text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl',
            )}
          >
            Where should we send your score?
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            {`You are ${answeredCount} questions in. We will send the full result so you keep it.`}
          </p>

          <div className="mt-6">
            <label className={LABEL_BASE} htmlFor="ar-capture-email">
              Work email
            </label>
            <input
              id="ar-capture-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (captureError) setCaptureError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  leaveCaptureStep(true);
                }
              }}
              className={cn(INPUT_BASE, 'mt-2')}
              placeholder="you@company.com"
              aria-invalid={captureError ? true : undefined}
              aria-describedby={captureError ? 'ar-capture-error' : undefined}
            />
            {captureError ? (
              <p
                id="ar-capture-error"
                className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-signal-warn"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {captureError}
              </p>
            ) : null}
          </div>

          <p className="mt-4 text-[13px] leading-relaxed text-ink-faint">
            This is how we deliver the score, not a gate. No spam, and you can
            finish the remaining questions either way. See our{' '}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener"
              className="underline underline-offset-4 transition-colors hover:text-traq-purple"
            >
              privacy policy
            </a>
            .
          </p>

          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => leaveCaptureStep(true)}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-traq-purple px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]"
            >
              {`Continue to question ${Math.min(answeredCount + 1, QUESTIONS.length)}`}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => leaveCaptureStep(false)}
              className="inline-flex items-center justify-center gap-2 text-[13px] font-semibold text-ink-soft transition-colors hover:text-traq-purple"
            >
              Skip, just show my score
            </button>
          </div>
        </div>
      </div>
    );
  }

  // The optional closing question. Unscored, skippable, and framed so that
  // "no budget yet" is a normal thing to click rather than a door closing.
  if (phase === 'budget') {
    return (
      <div className={containerClassName}>
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-4">
            <p className={LABEL_BASE}>Last one, optional</p>
            <p className="text-[13px] font-medium text-ink-faint">
              {QUESTIONS.length} of {QUESTIONS.length} answered
            </p>
          </div>

          <div
            className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border-subtle"
            role="progressbar"
            aria-valuenow={QUESTIONS.length}
            aria-valuemin={0}
            aria-valuemax={QUESTIONS.length}
          >
            <div className="h-full w-full rounded-full bg-traq-purple" />
          </div>

          <h2
            className={cn(
              promptGap,
              'text-balance text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl',
            )}
          >
            Do you have a budget in mind for this?
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            It helps us point you at a format that fits. There is no wrong
            answer, and not having one yet is useful to know too.
          </p>

          <fieldset className="mt-6 flex flex-col gap-3">
            <legend className="sr-only">Do you have a budget in mind for this?</legend>
            {BUDGET_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => answerBudget(option)}
                aria-pressed={budget === option}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left text-[15px] font-medium transition-colors',
                  budget === option
                    ? 'border-traq-purple bg-traq-tint text-traq-purple-ink'
                    : 'border-border-subtle bg-white text-ink hover:border-traq-purple/40',
                )}
              >
                <span>{option}</span>
                <span
                  className={cn(
                    'flex h-5 w-5 flex-none items-center justify-center rounded-full border transition-colors',
                    budget === option
                      ? 'border-traq-purple bg-traq-purple text-white'
                      : 'border-border-strong text-transparent',
                  )}
                  aria-hidden="true"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
              </button>
            ))}
          </fieldset>

          <button
            type="button"
            onClick={() => setPhase('result')}
            className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-ink-soft transition-colors hover:text-traq-purple"
          >
            Skip, show my score
          </button>
        </div>
      </div>
    );
  }

  // Quiz phase: one question at a time, with progress and a back step.
  if (phase === 'quiz') {
    return (
      <div className={containerClassName}>
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-4">
            <p className={LABEL_BASE}>
              {DIMENSION_LABELS[current.dimension]}
            </p>
            <p className="text-[13px] font-medium text-ink-faint">
              Question {step + 1} of {QUESTIONS.length}
            </p>
          </div>

          <div
            className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border-subtle"
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={QUESTIONS.length}
          >
            <div
              className="h-full rounded-full bg-traq-purple transition-all duration-300"
              style={{ width: `${Math.round(((step + 1) / QUESTIONS.length) * 100)}%` }}
            />
          </div>

          <h2
            className={cn(
              promptGap,
              'text-balance text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl',
            )}
          >
            {current.prompt}
          </h2>
          {current.hint ? (
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
              {current.hint}
            </p>
          ) : null}

          <fieldset className="mt-6 flex flex-col gap-3">
            <legend className="sr-only">{current.prompt}</legend>
            {current.options.map((option) => {
              const selected = answers[current.id] === option.score;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleSelect(current.id, option.score)}
                  aria-pressed={selected}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left text-[15px] font-medium transition-colors',
                    selected
                      ? 'border-traq-purple bg-traq-tint text-traq-purple-ink'
                      : 'border-border-subtle bg-white text-ink hover:border-traq-purple/40',
                  )}
                >
                  <span>{option.label}</span>
                  <span
                    className={cn(
                      'flex h-5 w-5 flex-none items-center justify-center rounded-full border transition-colors',
                      selected
                        ? 'border-traq-purple bg-traq-purple text-white'
                        : 'border-border-strong text-transparent',
                    )}
                    aria-hidden="true"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                </button>
              );
            })}
          </fieldset>

          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-ink-soft transition-colors hover:text-traq-purple"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous question
            </button>
          ) : (
            <p className="mt-6 text-[13px] text-ink-faint">
              Pick the answer closest to your situation. Takes about two minutes.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Result + capture phase (also covers 'submitting' and 'error').
  const submitting = phase === 'submitting';

  // The routing fix. A Building or Ready score is a qualified lead telling us
  // it has tools, confidence and budget, so peak intent goes to a calendar
  // rather than being spent on a page view. Early keeps the article only.
  /**
   * The routing.
   *
   * Building and Ready have just told us they have tools, confidence and
   * budget behind them, which is the qualification a discovery call would
   * otherwise spend ten minutes establishing, so those two get a calendar as
   * the headline action at the moment of peak intent.
   *
   * Early gets the guide first, because a sales call at that score wastes both
   * sides. It still gets a booking link underneath: someone who wants to talk
   * should never have to hunt for the way to do it, whatever they scored.
   */
  const bookHref = bookingHref
    ? `${bookingHref}${bookingHref.includes('?') ? '&' : '?'}score=${score}&band=${detail.band.toLowerCase()}`
    : null;

  const booking =
    bookHref && detail.band !== 'Early'
      ? {
          href: bookHref,
          heading:
            detail.band === 'Ready'
              ? 'Map your next three workflows'
              : 'Walk through your score',
          body:
            detail.band === 'Ready'
              ? 'You scored in the top band, so the useful conversation is which repetitive work to automate first. Thirty minutes, your answers already on screen.'
              : 'Thirty minutes on where the gap between your early adopters and the rest of the team actually is, and what closes it fastest.',
          cta: detail.band === 'Ready' ? 'Book the workflow call' : 'Book a call about your score',
        }
      : null;
  return (
    <div className={containerClassName}>
      <div className={cardClass}>
        <div className="flex items-center justify-between gap-4">
          <p className={LABEL_BASE}>Your result</p>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-soft transition-colors hover:text-traq-purple"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retake
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2">
          <span className="inline-flex items-center rounded-full border border-traq-purple/40 bg-traq-tint px-4 py-1.5 text-sm font-semibold text-traq-purple-ink">
            {detail.band}
          </span>
          <span className="text-[15px] font-medium text-ink-soft">
            Score {score} of {MAX_SCORE}
          </span>
        </div>

        <p className="mt-5 text-[15px] leading-relaxed text-ink-soft sm:text-[17px]">
          {detail.blurb}
        </p>

        <div className="mt-7">
          <h3 className="text-[13px] font-semibold uppercase tracking-widest text-ink-faint">
            Where you scored
          </h3>
          <ul className="mt-3 flex flex-col gap-3">
            {(Object.keys(dimensionBreakdown) as Dimension[]).map((dim) => {
              const { got, max } = dimensionBreakdown[dim];
              const pct = Math.round((got / max) * 100);
              return (
                <li key={dim}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-ink">
                      {DIMENSION_LABELS[dim]}
                    </span>
                    <span className="text-ink-faint">
                      {got}/{max}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border-subtle">
                    <div
                      className="h-full rounded-full bg-traq-purple"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-7">
          <h3 className="text-[13px] font-semibold uppercase tracking-widest text-ink-faint">
            Your next steps
          </h3>
          <ul className="mt-3 space-y-3">
            {detail.steps.map((stepText) => (
              <li key={stepText} className="flex items-start gap-3">
                <span
                  className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-traq-purple"
                  aria-hidden="true"
                />
                <span className="text-[15px] leading-relaxed text-ink-soft">
                  {stepText}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href={detail.guideHref}
            className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-traq-purple underline-offset-4 transition-colors hover:underline"
          >
            {detail.guideLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>

          {bookHref && !booking ? (
            <p className="mt-4 border-t border-border-subtle pt-4 text-[13.5px] leading-relaxed text-ink-soft">
              At this score the guide will get you further than a call would.
              If you would rather talk it through anyway,{' '}
              <Link
                href={bookHref}
                onClick={() => track('assessment_book_click', { band: detail.band, score })}
                className="font-semibold text-traq-purple underline underline-offset-4"
              >
                book thirty minutes
              </Link>
              .
            </p>
          ) : null}
        </div>

        {booking ? (
          <div className="mt-7 overflow-hidden rounded-2xl border border-traq-purple/40">
            <div className="border-b border-border-subtle bg-traq-tint px-5 py-4">
              <h3 className="text-[15px] font-semibold tracking-tight text-ink">
                {booking.heading}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                {booking.body}
              </p>
            </div>
            <div className="bg-white px-5 py-4">
              <ul className="flex flex-wrap gap-2" aria-label="Sent with your booking">
                {[
                  `Score ${score}/${MAX_SCORE}`,
                  `Band ${detail.band}`,
                  `All ${QUESTIONS.length} answers attached`,
                ].map((chip) => (
                  <li
                    key={chip}
                    className="rounded-md border border-border-subtle bg-bg-subtle px-2.5 py-1 text-[11.5px] font-semibold text-ink-soft"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
              <Link
                href={booking.href}
                onClick={() =>
                  track('assessment_book_click', {
                    band: detail.band,
                    score,
                  })
                }
                className="group mt-4 inline-flex items-center justify-center gap-2.5 rounded-full bg-traq-purple px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]"
              >
                {booking.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="mt-8 border-t border-border-subtle pt-8"
          noValidate
        >
          <h3 className="text-lg font-semibold text-ink">
            Send my full results and a tailored plan
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            Get your score and next steps in your inbox, plus a short plan built
            around where you scored. No spam, and we will never share your
            details.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL_BASE} htmlFor="ar-first">
                First name
              </label>
              <input
                id="ar-first"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                className={cn(INPUT_BASE, 'mt-2')}
                placeholder="Jane"
              />
            </div>
            <div>
              <label className={LABEL_BASE} htmlFor="ar-company">
                Company
              </label>
              <input
                id="ar-company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                autoComplete="organization"
                className={cn(INPUT_BASE, 'mt-2')}
                placeholder="Company name"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className={LABEL_BASE} htmlFor="ar-email">
              Work email
            </label>
            <input
              id="ar-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={cn(INPUT_BASE, 'mt-2')}
              placeholder="jane@company.com"
            />
          </div>

          {turnstileRequired ? (
            <div className="mt-5 flex justify-center">
              <Turnstile
                siteKey={turnstileSiteKey}
                onSuccess={(t) => setTurnstileToken(t)}
                options={{ theme: 'light', size: 'flexible' }}
              />
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-traq-purple px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-traq-purple-ink hover:shadow-cardHover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Send my results
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

          <p className="mt-5 text-[13px] text-ink-faint">
            Prefer to talk it through?{' '}
            <Link
              href="/book"
              className="font-semibold text-traq-purple underline-offset-2 hover:underline"
            >
              Book a free call
            </Link>{' '}
            and we will walk through your result together.
          </p>
        </form>
      </div>
    </div>
  );
}
