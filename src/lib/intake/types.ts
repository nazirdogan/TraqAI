import { z } from 'zod';

export const SERVICES_OF_INTEREST = [
  'AI Integration',
  'Process Automation',
  'Data Intelligence',
  'ERP',
  'Website',
  'Secure AI / Consultation',
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
  role: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(160),
  industry: z.string().trim().min(1).max(120),
  problem: z.string().trim().min(1).max(2000),
  painPoints: z.array(z.string().trim().min(1).max(400)).max(10),
  desiredOutcome: z.string().trim().min(1).max(1000),
  servicesOfInterest: z.array(z.enum(SERVICES_OF_INTEREST)).max(SERVICES_OF_INTEREST.length),
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
  'role',
  'company',
  'industry',
  'problem',
  'painPoints',
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
});

export type QuickIntake = z.infer<typeof quickIntakeSchema>;
