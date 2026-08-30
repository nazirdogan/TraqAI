'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { setEnhancedConversionData, track } from '@/components/analytics/Analytics';
import { getAttribution } from '@/lib/attribution';
import { type ChatMessage, type PartialLeadProfile, REQUIRED_FIELDS } from '@/lib/intake/types';

export type ChatPhase = 'chat' | 'review' | 'submitting' | 'success' | 'error';
export type DisplayMessage = ChatMessage & { id: string; streaming?: boolean };
export type ChoiceSet = { options: string[]; allowMultiple: boolean };

const OPENING_MESSAGE: DisplayMessage = {
  id: 'opening',
  role: 'assistant',
  content:
    "Hi, I'm the Traq intake. Mind if I ask a few quick questions about your team and your tools, so we show up to our first call already up to speed?\n\nLet's start with the basics: what's your full name?",
};

function randId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function progressPct(profile: PartialLeadProfile): number {
  const filled = REQUIRED_FIELDS.filter((f) => {
    const v = profile[f];
    if (v === undefined || v === null) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  }).length;
  return Math.round((filled / REQUIRED_FIELDS.length) * 100);
}

/**
 * The AI intake chat engine: message streaming, choice chips, Turnstile-gated
 * first turn, and the review/submit handoff. Shared by the homepage contact
 * section and the site-wide floating chat widget so both talk to
 * /api/intake/chat identically and never drift apart.
 */
export function useIntakeChat() {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? '';
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRequired = Boolean(turnstileSiteKey);

  const [phase, setPhase] = useState<ChatPhase>('chat');
  const [messages, setMessages] = useState<DisplayMessage[]>([OPENING_MESSAGE]);
  const [profile, setProfile] = useState<PartialLeadProfile>({});
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [firstSend, setFirstSend] = useState(true);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [choices, setChoices] = useState<ChoiceSet | null>(null);
  const [multiSelected, setMultiSelected] = useState<string[]>([]);

  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const canSend =
    phase === 'chat' &&
    !sending &&
    input.trim().length > 0 &&
    (!turnstileRequired || !firstSend || turnstileToken.length > 0);

  const sendMessage = useCallback(
    async (text: string) => {
      setSending(true);
      setErrorMessage('');
      setChoices(null);
      setMultiSelected([]);

      const userMsg: DisplayMessage = { id: randId(), role: 'user', content: text };
      const assistantId = randId();
      const assistantPlaceholder: DisplayMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        streaming: true,
      };

      const historyForServer: ChatMessage[] = [...messages, userMsg].map(({ role, content }) => ({
        role,
        content,
      }));

      setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);

      try {
        const res = await fetch('/api/intake/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            messages: historyForServer,
            turnstileToken: firstSend ? turnstileToken : undefined,
            isFirstTurn: firstSend,
          }),
        });

        if (!res.ok || !res.body) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            body?.error === 'rate_limited'
              ? 'We’re getting a lot of activity right now. Give it a minute and try again.'
              : body?.error === 'turnstile_failed'
                ? 'We couldn’t verify the browser. Refresh and try again.'
                : 'Something went wrong. Try again.',
          );
        }

        setFirstSend(false);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let wroteText = false;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let idx: number;
          while ((idx = buffer.indexOf('\n\n')) !== -1) {
            const raw = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);
            const lines = raw.split('\n');
            let event = 'message';
            let data = '';
            for (const line of lines) {
              if (line.startsWith('event: ')) event = line.slice(7).trim();
              else if (line.startsWith('data: ')) data += line.slice(6);
            }
            if (!data) continue;
            let parsed: unknown;
            try {
              parsed = JSON.parse(data);
            } catch {
              continue;
            }

            if (event === 'text') {
              const { delta } = parsed as { delta: string };
              wroteText = true;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + delta } : m,
                ),
              );
            } else if (event === 'fields') {
              const fields = parsed as PartialLeadProfile;
              setProfile((prev) => ({ ...prev, ...fields }));
            } else if (event === 'choices') {
              const c = parsed as ChoiceSet;
              if (c && Array.isArray(c.options) && c.options.length > 0) {
                setChoices(c);
                setMultiSelected([]);
              }
            } else if (event === 'final') {
              const { assistantText, fields, readyToSubmit: rts } = parsed as {
                assistantText: string;
                fields: PartialLeadProfile;
                readyToSubmit: boolean;
              };
              if (!wroteText && assistantText) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: assistantText } : m,
                  ),
                );
              }
              if (fields && Object.keys(fields).length > 0) {
                setProfile((prev) => ({ ...prev, ...fields }));
              }
              if (rts) setReadyToSubmit(true);
            } else if (event === 'error') {
              const { message } = parsed as { message: string };
              throw new Error(message || 'Upstream error');
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m)),
        );
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setErrorMessage(
          err instanceof Error ? err.message : 'Something went wrong. Try again.',
        );
      } finally {
        setSending(false);
      }
    },
    [firstSend, messages, turnstileToken],
  );

  const handleSend = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!canSend) return;
      const text = input.trim();
      setInput('');
      void sendMessage(text);
    },
    [canSend, input, sendMessage],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const goReview = useCallback(() => {
    setPhase('review');
  }, []);

  const goBackToChat = useCallback(() => {
    setPhase('chat');
  }, []);

  const submitFinal = useCallback(
    async (confirmed: PartialLeadProfile) => {
      setPhase('submitting');
      setErrorMessage('');
      try {
        const res = await fetch('/api/intake/submit', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            messages: messages.map(({ role, content }) => ({ role, content })),
            confirmedFields: confirmed,
            click: getAttribution(),
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            body?.error === 'incomplete_profile'
              ? 'A couple of fields still look thin. Fill them in and try again.'
              : body?.error === 'rate_limited'
                ? 'Too many submissions from this network. Try again in a bit.'
                : body?.error === 'email_send_failed'
                  ? 'Your brief didn’t send. Email us directly at hello@traqcollective.com.'
                  : 'Something went wrong. Try again.',
          );
        }
        setEnhancedConversionData(confirmed.email ?? '');
        track('chat_lead_submit');
        setPhase('success');
      } catch (err) {
        setPhase('error');
        setErrorMessage(
          err instanceof Error ? err.message : 'Something went wrong. Try again.',
        );
      }
    },
    [messages],
  );

  return {
    turnstileSiteKey,
    turnstileToken,
    setTurnstileToken,
    turnstileRequired,
    phase,
    setPhase,
    messages,
    profile,
    setProfile,
    input,
    setInput,
    sending,
    errorMessage,
    firstSend,
    readyToSubmit,
    choices,
    multiSelected,
    setMultiSelected,
    scrollerRef,
    canSend,
    sendMessage,
    handleSend,
    handleKeyDown,
    goReview,
    goBackToChat,
    submitFinal,
  };
}

export type IntakeChat = ReturnType<typeof useIntakeChat>;
