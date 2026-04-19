import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { anthropicClient } from '@/lib/intake/claude';
import { INTAKE_MODEL, SYSTEM_PROMPT, UPDATE_LEAD_PROFILE_TOOL } from '@/lib/intake/prompt';
import {
  chatMessageSchema,
  leadProfileSchema,
  type LeadProfile,
  type PartialLeadProfile,
} from '@/lib/intake/types';
import { checkRate } from '@/lib/intake/ratelimit';
import { clientIp } from '@/lib/intake/turnstile';
import TeamLeadEmail from '@/emails/TeamLeadEmail';
import LeadConfirmationEmail from '@/emails/LeadConfirmationEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const submitSchema = z.object({
  messages: z.array(chatMessageSchema).min(2).max(60),
  confirmedFields: leadProfileSchema.partial(),
});

async function finalExtraction(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
): Promise<PartialLeadProfile> {
  const anthropic = anthropicClient();
  const result = await anthropic.messages.create({
    model: INTAKE_MODEL,
    max_tokens: 1024,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    tools: [UPDATE_LEAD_PROFILE_TOOL],
    tool_choice: { type: 'tool', name: UPDATE_LEAD_PROFILE_TOOL.name },
    messages: [
      ...messages,
      {
        role: 'user',
        content:
          'Final extraction pass. Call update_lead_profile with the complete, final LeadProfile based on everything above. Include every required field. Do not set readyToSubmit.',
      },
    ],
  });

  for (const block of result.content) {
    if (block.type === 'tool_use' && block.name === 'update_lead_profile') {
      const input = (block.input ?? {}) as Record<string, unknown>;
      const { readyToSubmit: _rts, ...rest } = input;
      return rest as PartialLeadProfile;
    }
  }
  return {};
}

function mergeProfile(ai: PartialLeadProfile, edits: PartialLeadProfile): PartialLeadProfile {
  const merged: PartialLeadProfile = { ...ai };
  for (const [key, val] of Object.entries(edits)) {
    if (val === undefined || val === null) continue;
    if (typeof val === 'string' && val.trim() === '') continue;
    if (Array.isArray(val) && val.length === 0) continue;
    (merged as Record<string, unknown>)[key] = val;
  }
  return merged;
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  const gate = await checkRate('submit-hour', ip);
  if (!gate.ok) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfterSec: gate.retryAfterSec },
      { status: 429, headers: { 'Retry-After': String(gate.retryAfterSec) } },
    );
  }

  let parsed;
  try {
    parsed = submitSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  let aiProfile: PartialLeadProfile;
  try {
    aiProfile = await finalExtraction(
      parsed.messages.map((m) => ({ role: m.role, content: m.content })),
    );
  } catch {
    return NextResponse.json({ error: 'extraction_failed' }, { status: 502 });
  }

  const merged = mergeProfile(aiProfile, parsed.confirmedFields);
  const profileResult = leadProfileSchema.safeParse(merged);
  if (!profileResult.success) {
    return NextResponse.json(
      {
        error: 'incomplete_profile',
        missing: profileResult.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }
  const profile: LeadProfile = profileResult.data;

  const resendKey = process.env.RESEND_API_KEY;
  const teamEmail = process.env.TEAM_INTAKE_EMAIL ?? 'hello@traqcollective.com';
  const fromEmail = process.env.FROM_EMAIL ?? 'Traq Collective <hello@traqcollective.com>';

  if (!resendKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[intake/submit] dev mode — skipping Resend. Profile:', profile);
      return NextResponse.json({ ok: true, dev: true });
    }
    return NextResponse.json({ error: 'email_not_configured' }, { status: 500 });
  }

  const resend = new Resend(resendKey);

  try {
    const teamSend = resend.emails.send({
      from: fromEmail,
      to: teamEmail,
      replyTo: profile.email,
      subject: `New qualified lead: ${profile.firstName} ${profile.lastName} @ ${profile.company} — ${profile.problemTag}`,
      react: TeamLeadEmail({ profile, transcript: parsed.messages }),
    });

    const leadSend = resend.emails.send({
      from: fromEmail,
      to: profile.email,
      subject: `Thanks ${profile.firstName} — a Traq specialist will be in touch shortly`,
      react: LeadConfirmationEmail({ profile }),
    });

    const [teamRes, leadRes] = await Promise.all([teamSend, leadSend]);
    if (teamRes.error || leadRes.error) {
      return NextResponse.json(
        { error: 'email_send_failed', teamError: teamRes.error, leadError: leadRes.error },
        { status: 502 },
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'email_send_failed';
    return NextResponse.json({ error: 'email_send_failed', detail: message }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'intake/submit' });
}
