import Image from 'next/image';
import Link from 'next/link';
import { PRICE_LABEL, STRIPE_PAYMENT_LINK, sessionFinished } from '@/lib/build-ai-session';

export const BTN =
  'inline-flex min-h-[52px] items-center justify-center rounded-full bg-traq-purple px-8 py-4 text-[16px] font-semibold text-white shadow-card transition-colors hover:bg-traq-purple-ink active:scale-[0.98]';

/**
 * The one action on the page. After the session has ended it becomes a line
 * instead, so a late visitor is not sent to pay for something already over.
 */
export function BookButton({ className = '' }: { className?: string }) {
  if (sessionFinished()) {
    return (
      <p className={`text-[16px] leading-7 text-ink-soft ${className}`}>
        This session has finished. Email{' '}
        <a className="font-semibold text-traq-purple underline underline-offset-2" href="mailto:hello@traqcollective.com">
          hello@traqcollective.com
        </a>{' '}
        to hear about the next one.
      </p>
    );
  }
  return (
    <a href={STRIPE_PAYMENT_LINK} className={`${BTN} ${className}`}>
      Book your seat, {PRICE_LABEL}
    </a>
  );
}

export function BuildAiHeader() {
  return (
    <header className="border-b border-border-subtle bg-white">
      <div className="mx-auto flex max-w-5xl items-center px-5 py-4 sm:px-8">
        <Link href="/" aria-label="Traq Collective home">
          <Image src="/logos/wordmark-purple.png" alt="Traq Collective" width={190} height={70} className="h-7 w-auto" priority />
        </Link>
      </div>
    </header>
  );
}

export function BuildAiFooter() {
  return (
    <footer className="border-t border-border-subtle bg-white">
      <div className="mx-auto max-w-5xl px-5 py-10 text-[13px] leading-6 text-ink-faint sm:px-8">
        <p>
          Traq Collective L.L.C-FZ. Questions:{' '}
          <a className="font-medium text-traq-purple-ink underline underline-offset-2" href="mailto:hello@traqcollective.com">
            hello@traqcollective.com
          </a>
        </p>
        <p className="mt-2">
          <Link className="underline underline-offset-2" href="/terms">Terms</Link>
          {' · '}
          <Link className="underline underline-offset-2" href="/privacy">Privacy</Link>
        </p>
      </div>
    </footer>
  );
}
