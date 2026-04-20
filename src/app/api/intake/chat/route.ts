import { NextResponse } from 'next/server';
import { z } from 'zod';
import { anthropicClient } from '@/lib/intake/claude';
import {
  INTAKE_MODEL,
  PRESENT_CHOICES_TOOL,
  SYSTEM_PROMPT,
  UPDATE_LEAD_PROFILE_TOOL,
} from '@/lib/intake/prompt';
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

const TOOLS = [UPDATE_LEAD_PROFILE_TOOL, PRESENT_CHOICES_TOOL];

function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

type ToolUseBlock = {
  id: string;
  name: string;
  input: Record<string, unknown>;
};

type ChoiceState = {
  options: string[];
  allowMultiple: boolean;
};

function extractBlocks(
  content: Array<{ type: string; text?: string; id?: string; name?: string; input?: unknown }>,
): {
  text: string;
  toolUses: ToolUseBlock[];
} {
  let text = '';
  const toolUses: ToolUseBlock[] = [];
  for (const block of content) {
    if (block.type === 'text' && typeof block.text === 'string') {
      text += block.text;
    } else if (block.type === 'tool_use' && block.id && block.name) {
      toolUses.push({
        id: block.id,
        name: block.name,
        input: (block.input ?? {}) as Record<string, unknown>,
      });
    }
  }
  return { text, toolUses };
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
        const conversation = parsed.messages.map((m) => ({ role: m.role, content: m.content }));

        let fields: Record<string, unknown> = {};
        let readyToSubmit = false;
        let choices: ChoiceState | null = null;
        let assistantText = '';

        const processFinal = (final: Awaited<ReturnType<ReturnType<typeof anthropic.messages.stream>['finalMessage']>>) => {
          const { text, toolUses } = extractBlocks(final.content);
          assistantText += text;
          for (const tu of toolUses) {
            if (tu.name === 'update_lead_profile') {
              const { readyToSubmit: rts, ...rest } = tu.input;
              if (rts === true) readyToSubmit = true;
              if (Object.keys(rest).length > 0) {
                fields = { ...fields, ...rest };
                send('fields', rest);
              }
            } else if (tu.name === 'present_choices') {
              const options = Array.isArray(tu.input.options)
                ? (tu.input.options as unknown[]).filter((o) => typeof o === 'string') as string[]
                : [];
              const allowMultiple = tu.input.allowMultiple === true;
              if (options.length > 0) {
                choices = { options, allowMultiple };
                send('choices', choices);
              }
            }
          }
          return toolUses;
        };

        const firstPass = anthropic.messages.stream({
          model: INTAKE_MODEL,
          max_tokens: 1024,
          system: [
            { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
          ],
          tools: TOOLS,
          messages: conversation,
        });

        for await (const event of firstPass) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            send('text', { delta: event.delta.text });
          }
        }

        const firstFinal = await firstPass.finalMessage();
        const firstToolUses = processFinal(firstFinal);
        const firstTextLength = assistantText.trim().length;

        // If the model ONLY called tools (no visible text) and stopped on
        // tool_use, the question was never produced. Feed tool_results back
        // and run a second pass to get it. If text WAS produced in pass one,
        // skip the second pass — otherwise we'd stream the question twice.
        if (
          firstFinal.stop_reason === 'tool_use' &&
          firstToolUses.length > 0 &&
          firstTextLength === 0
        ) {
          const secondPass = anthropic.messages.stream({
            model: INTAKE_MODEL,
            max_tokens: 1024,
            system: [
              { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
            ],
            tools: TOOLS,
            messages: [
              ...conversation,
              { role: 'assistant', content: firstFinal.content },
              {
                role: 'user',
                content: firstToolUses.map((tu) => ({
                  type: 'tool_result' as const,
                  tool_use_id: tu.id,
                  content: tu.name === 'present_choices' ? 'chips shown' : 'recorded',
                })),
              },
            ],
          });

          for await (const event of secondPass) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              send('text', { delta: event.delta.text });
            }
          }

          const secondFinal = await secondPass.finalMessage();
          processFinal(secondFinal);
        }

        send('final', {
          assistantText,
          fields,
          readyToSubmit,
          choices,
          usage: firstFinal.usage,
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
