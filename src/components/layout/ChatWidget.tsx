'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import IntakeChatPanel from '@/components/intake/IntakeChatPanel';
import { useIntakeChat } from '@/hooks/useIntakeChat';
import { track } from '@/components/analytics/Analytics';
import { cn } from '@/lib/cn';

// /book is already the dedicated booking destination, so a second entry point
// into the AI intake would just compete with it. Bare /lp/* funnel pages are
// handled by the ChromeGate wrapper this renders inside. Mirrors the pattern
// MobileCtaBar already uses for /book.
const HIDDEN_ON = new Set(['/book']);

/**
 * ChatWidget
 *
 * A site-wide floating launcher for the AI intake chat, so a visitor on any
 * page (a service page, /fractional-head-of-ai, an insight) can start the
 * conversation without first finding their way to the homepage contact
 * section. Runs its own instance of the intake chat engine, independent of
 * the one embedded in ContactIntake on the homepage.
 */
export default function ChatWidget() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const chat = useIntakeChat();

  if (pathname && HIDDEN_ON.has(pathname)) return null;

  const toggle = () => {
    setOpen((v) => {
      const next = !v;
      if (next) track('chat_widget_open');
      return next;
    });
  };

  return (
    <div className="fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-3 lg:bottom-6 lg:right-6">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'w-[380px] max-w-[calc(100vw-2rem)]',
              chat.phase === 'chat' ? 'h-[540px]' : 'max-h-[75vh] overflow-y-auto',
            )}
          >
            <IntakeChatPanel chat={chat} compact />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggle}
        aria-label={open ? 'Close chat' : 'Chat with Traq AI'}
        aria-expanded={open}
        className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-traq-purple text-white shadow-cardHover transition-all hover:-translate-y-0.5 hover:bg-traq-purple-ink active:scale-95"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
