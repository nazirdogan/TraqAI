import { z } from 'zod';

/**
 * The ad click that produced a lead, as discrete fields.
 *
 * The human-readable `attribution` string on the schemas below is for the team
 * email and stays. It is not enough on its own: an offline conversion upload
 * needs the raw gclid as its own value, and regex-ing it back out of a summary
 * line ("google / cpc, gclid Cj0K...") is exactly the kind of fragility that
 * loses conversions silently.
 */
export const clickAttributionSchema = z.object({
  gclid: z.string().trim().max(200).optional(),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(160).optional(),
  utmContent: z.string().trim().max(160).optional(),
  utmTerm: z.string().trim().max(160).optional(),
  landingPath: z.string().trim().max(200).optional(),
});

export type ClickAttribution = z.infer<typeof clickAttributionSchema>;

export const SERVICES_OF_INTEREST = [
  'AI Training & Workshops',
  'Consultation & Strategy',
  'Implementation & Enablement',
  'Agentic AI & Autonomous Infrastructure',
] as const;
export type ServiceOfInterest = (typeof SERVICES_OF_INTEREST)[number];

export const TIMELINES = ['asap', '1-3 months', '3-6 months', 'exploring'] as const;
export type Timeline = (typeof TIMELINES)[number];

export const BUDGET_BANDS = [
  '<$10k',
  '$10-25k',
  '$25-75k',
  '$75k+',
  'not sure',
] as const;
export type BudgetBand = (typeof BUDGET_BANDS)[number];

export const leadProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(200),
  role: z.string().trim().min(1).max(120).optional(),
  company: z.string().trim().min(1).max(160),
  industry: z.string().trim().min(1).max(120),
  problem: z.string().trim().min(1).max(2000),
  painPoints: z.array(z.string().trim().min(1).max(400)).max(10).optional(),
  desiredOutcome: z.string().trim().min(1).max(1000),
  servicesOfInterest: z
    .array(z.enum(SERVICES_OF_INTEREST))
    .min(1)
    .max(SERVICES_OF_INTEREST.length),
  timeline: z.enum(TIMELINES),
  budgetBand: z.enum(BUDGET_BANDS),
  problemTag: z.string().trim().min(1).max(60),
});

export type LeadProfile = z.infer<typeof leadProfileSchema>;
export type PartialLeadProfile = Partial<LeadProfile>;

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(8000),
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const REQUIRED_FIELDS: Array<keyof LeadProfile> = [
  'firstName',
  'lastName',
  'email',
  'company',
  'industry',
  'problem',
  'desiredOutcome',
  'servicesOfInterest',
  'timeline',
  'budgetBand',
];

export function isProfileComplete(profile: PartialLeadProfile): boolean {
  for (const field of REQUIRED_FIELDS) {
    const value = profile[field];
    if (value === undefined || value === null) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
  }
  return true;
}

export const quickIntakeSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  email: z.string().trim().email('Enter a valid email').max(200),
  company: z.string().trim().min(1, 'Company is required').max(160),
  problem: z.string().trim().min(10, 'Share at least a sentence').max(2000),
  servicesOfInterest: z
    .array(z.enum(SERVICES_OF_INTEREST))
    .min(1, 'Pick at least one service')
    .max(SERVICES_OF_INTEREST.length),
  /** The ad click that produced this lead, if any. */
  click: clickAttributionSchema.optional(),
});

export type QuickIntake = z.infer<typeof quickIntakeSchema>;

// --- AI Readiness Assessment (lead magnet) ---------------------------------
// Mirrors the payload the client computes in AssessmentForm: a light scorecard
// plus name/email/company capture. The band is the three-way readiness label.

export const READINESS_BANDS = ['Early', 'Building', 'Ready'] as const;
export type ReadinessBand = (typeof READINESS_BANDS)[number];

export const assessmentAnswerSchema = z.object({
  question: z.string().trim().min(1).max(400),
  answer: z.string().trim().min(1).max(200),
  score: z.number().int().min(0).max(3),
});
export type AssessmentAnswer = z.infer<typeof assessmentAnswerSchema>;

export const assessmentIntakeSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  email: z.string().trim().email('Enter a valid email').max(200),
  company: z.string().trim().min(1, 'Company is required').max(160),
  answers: z.array(assessmentAnswerSchema).min(1).max(20),
  score: z.number().int().min(0).max(60),
  band: z.enum(READINESS_BANDS),
  /**
   * Which page the assessment was completed on, e.g. a paid-search landing
   * page slug. Optional so the existing /ai-readiness form keeps working
   * unchanged; without it a paid lead is indistinguishable from an organic one.
   */
  source: z.string().trim().max(120).optional(),
  /**
   * Optional, unscored. Whether a budget exists yet and roughly what it is,
   * asked at the end of the landing-page assessment so a call can open at the
   * right format instead of guessing.
   */
  budget: z.string().trim().max(80).optional(),
  /** gclid and utm values for the click that produced this lead. */
  attribution: z.string().trim().max(500).optional(),
  /** The same click, structured, so it can be uploaded as an offline conversion. */
  click: clickAttributionSchema.optional(),
});

export type AssessmentIntake = z.infer<typeof assessmentIntakeSchema>;

/**
 * A partial assessment lead, sent the moment the email is captured mid-quiz.
 *
 * Without this the address collected at question three lives only in React
 * state and dies with the tab, which defeats the point of asking for it early:
 * the people worth recovering are exactly the ones who never reach the end.
 */
export const assessmentPartialSchema = z.object({
  email: z.string().trim().email('Enter a valid email').max(200),
  /** How many questions were answered when the email was given. */
  answered: z.number().int().min(0).max(20),
  source: z.string().trim().max(120).optional(),
  attribution: z.string().trim().max(500).optional(),
  click: clickAttributionSchema.optional(),
});

export type AssessmentPartial = z.infer<typeof assessmentPartialSchema>;

// --- The 2027 AI Plan session (application for a capped in-person seat) -----
// A free, two hour working session in Dubai, capped at 20 people. Every
// application is screened by hand afterwards, so nothing here scores, ranks or
// rejects: the schema's only job is to make sure a complete application arrives
// intact. Company size and the leadership answer are captured for context and
// are deliberately not gates.

export const COMPANY_SIZES = ['1 to 10', '11 to 50', '51 to 200', '200+'] as const;
export type CompanySize = (typeof COMPANY_SIZES)[number];

export const YES_NO = ['Yes', 'No'] as const;
export type YesNo = (typeof YES_NO)[number];

export const aiPlanSessionSchema = z.object({
  name: z.string({ required_error: 'Enter your name' }).trim().min(1, 'Enter your name').max(120),
  role: z
    .string({ required_error: 'Enter your role or job title' })
    .trim()
    .min(1, 'Enter your role or job title')
    .max(160),
  company: z.string({ required_error: 'Enter your company' }).trim().min(1, 'Enter your company').max(160),
  companySize: z.enum(COMPANY_SIZES, {
    errorMap: () => ({ message: 'Choose a company size' }),
  }),
  email: z
    .string({ required_error: 'Enter your email address' })
    .trim()
    .min(1, 'Enter your email address')
    .email('Enter a valid email address')
    .max(200),
  // No user-facing character limit, per the brief. The ceiling here is a
  // request-size guard, set far above anything a person types in this box.
  repetitiveWork: z
    .string({ required_error: 'Tell us the one repetitive thing' })
    .trim()
    .min(1, 'Tell us the one repetitive thing')
    .max(5000, 'That is longer than this box can take. Trim it a little.'),
  paysForAiTools: z.enum(YES_NO, {
    errorMap: () => ({ message: 'Choose Yes or No' }),
  }),
  leadsAiStrategy: z.enum(YES_NO, {
    errorMap: () => ({ message: 'Choose Yes or No' }),
  }),
  strategyRole: z
    .string({ required_error: 'Tell us your role in that' })
    .trim()
    .min(1, 'Tell us your role in that')
    .max(300),
  canAttendFullSession: z
    .boolean({ required_error: 'Confirm you can attend the full session' })
    .refine((v) => v === true, { message: 'Confirm you can attend the full session' }),
  /** The click that produced the application, if it came from an ad. */
  click: clickAttributionSchema.optional(),
});

export type AiPlanSessionApplication = z.infer<typeof aiPlanSessionSchema>;

// --- The pre-session task -------------------------------------------------
// Asked of confirmed attendees only, about a week out. Three facts about one
// real workflow, used live in the room on their own numbers. The estimates are
// captured as short text rather than numbers on purpose: "about six hours,
// more in month end" is a truer answer than a spinner forced to one integer,
// and the room works off the shape of the number, not its precision.

export const aiPlanPrepSchema = z.object({
  name: z.string({ required_error: 'Enter your name' }).trim().min(1, 'Enter your name').max(120),
  email: z
    .string({ required_error: 'Enter your email address' })
    .trim()
    .min(1, 'Enter your email address')
    .email('Enter a valid email address')
    .max(200),
  company: z.string({ required_error: 'Enter your company' }).trim().min(1, 'Enter your company').max(160),
  workflow: z
    .string({ required_error: 'Describe the workflow' })
    .trim()
    .min(1, 'Describe the workflow')
    .max(5000, 'That is longer than this box can take. Trim it a little.'),
  hoursPerWeek: z
    .string({ required_error: 'Give a rough number of hours' })
    .trim()
    .min(1, 'Give a rough number of hours')
    .max(120),
  peopleInvolved: z
    .string({ required_error: 'Say how many people touch it' })
    .trim()
    .min(1, 'Say how many people touch it')
    .max(120),
  anythingElse: z.string().trim().max(3000).optional(),
});

export type AiPlanPrep = z.infer<typeof aiPlanPrepSchema>;
