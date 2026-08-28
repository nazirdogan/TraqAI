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
