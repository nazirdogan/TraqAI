import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: 'Terms · Traq Collective' },
  description:
    'The terms for using the Traq Collective website: what the site is for, how we handle your enquiries, and the basics of our liability.',
  alternates: { canonical: 'https://traqcollective.com/terms' },
};

const LAST_UPDATED = '10 June 2026';

export default function TermsPage() {
  return (
    <section className="px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40">
      <div className="mx-auto max-w-3xl">
        <div className="eyebrow eyebrow-accent">Terms</div>
        <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
          Terms of use
        </h1>
        <p className="mt-4 text-sm text-ink-faint">Last updated: {LAST_UPDATED}</p>
        <p className="mt-6 text-[15px] leading-relaxed text-ink-soft md:text-[17px]">
          These terms cover using this website. They are short and plain. By using the site, you
          agree to them.
        </p>

        <div className="mt-12 space-y-12">
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              What this site is for
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              This is the website of {COMPANY.name}. It explains how we help teams use AI and lets
              you get in touch or book a call. It is for information and to start a conversation. It
              is not a contract for our services. Any engagement is covered by a separate written
              agreement we set up with you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Using the site
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              Please use the site lawfully and do not try to break, overload, or misuse it. The
              content, copy, and brand on this site belong to {COMPANY.name}. You are welcome to
              read and share it, but please do not copy it as your own.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Your enquiries
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              When you send a message through the contact form, the AI chat, or by booking a call,
              we use your details to reply and to follow up about working together. Our{' '}
              <Link
                href="/privacy"
                className="font-semibold text-traq-purple transition-colors hover:text-traq-purple-ink"
              >
                privacy policy
              </Link>{' '}
              explains exactly what we collect and how we use it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Accuracy and liability
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              We keep the information on this site accurate and up to date, including the research
              stats we cite with their sources. Even so, we provide the site as is and cannot
              guarantee it is free of errors. We are not liable for decisions you make based on the
              site alone. Outcomes from any work we do together are set out in our written
              agreement, not here.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Changes to these terms
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              We may update these terms from time to time. The date at the top shows when we last
              changed them. If you keep using the site, you accept the current version.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Contact us</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              Questions about these terms? Email{' '}
              <a
                href={`mailto:${COMPANY.email}`}
                className="font-semibold text-traq-purple transition-colors hover:text-traq-purple-ink"
              >
                {COMPANY.email}
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-14 border-t border-border-subtle pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-traq-purple transition-colors hover:text-traq-purple-ink"
          >
            <span aria-hidden="true">&larr;</span>
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
