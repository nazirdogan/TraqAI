import { NextResponse } from 'next/server';
import { z } from 'zod';
import { anthropicClient } from '@/lib/intake/claude';
import { INTAKE_MODEL, SYSTEM_PROMPT, UPDATE_LEAD_PROFILE_TOOL } from '@/lib/intake/prompt';
import { chatMessageSchema } from '@/lib/intake/types';
import { checkRate } from '@/lib/intake/ratelimit';
import { clientIp, verifyTurnstile } from '@/lib/intake/turnstile';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(60),
  turnstileToken: z.string().min(1).max(4000).optional(),
  isFirstTurn: z.boolean().default(false),
});

function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  const burst = await checkRate('chat-burst', ip);
  if (!burst.ok) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfterSec: burst.retryAfterSec },
      { status: 429, headers: { 'Retry-After': String(burst.retryAfterSec) } },
    );
  }
  const hourly = await checkRate('chat-hour', ip);
  if (!hourly.ok) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfterSec: hourly.retryAfterSec },
      { status: 429, headers: { 'Retry-After': String(hourly.retryAfterSec) } },
    );
  }

  let parsed;
  try {
    const body = await request.json();
    parsed = requestSchema.parse(body);
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  if (parsed.isFirstTurn) {
    const ok = await verifyTurnstile(parsed.turnstileToken ?? '', ip);
    if (!ok) {
      return NextResponse.json({ error: 'turnstile_failed' }, { status: 403 });
    }
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(sseEvent(event, data)));
      };

      try {
        const anthropic = anthropicClient();
        const response = anthropic.messages.stream({
          model: INTAKE_MODEL,
          max_tokens: 1024,
          system: [
            {
              type: 'text',
              text: SYSTEM_PROMPT,
              cache_control: { type: 'ephemeral' },
            },
          ],
          tools: [UPDATE_LEAD_PROFILE_TOOL],
          messages: parsed.messages.map((m) => ({ role: m.role, content: m.content })),
        });

        for await (const event of response) {
          if (event.type === 'content_block_delta') {
            const delta = event.delta;
            if (delta.type === 'text_delta') {
              send('text', { delta: delta.text });
            }
          }
        }

        const final = await response.finalMessage();

        let assistantText = '';
        let fields: Record<string, unknown> | null = null;
        let readyToSubmit = false;

        for (const block of final.content) {
          if (block.type === 'text') {
            assistantText += block.text;
          } else if (block.type === 'tool_use' && block.name === 'update_lead_profile') {
            const input = (block.input ?? {}) as Record<string, unknown>;
            const { readyToSubmit: rts, ...rest } = input;
            if (rts === true) readyToSubmit = true;
            fields = rest;
          }
        }

        if (fields && Object.keys(fields).length > 0) {
          send('fields', fields);
        }

        send('final', {
          assistantText,
          fields: fields ?? {},
          readyToSubmit,
          usage: final.usage,
        });
        send('done', {});
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'upstream_error';
        send('error', { message });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
      'x-accel-buffering': 'no',
    },
  });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'intake/chat' });
}
