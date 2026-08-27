import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: 'Privacy · Traq Collective' },
  description:
    'How Traq Collective handles your data: what our contact form and analytics collect, how we use it, and how to reach us.',
  alternates: { canonical: 'https://traqcollective.com/privacy' },
};

const LAST_UPDATED = '27 August 2026';

export default function PrivacyPage() {
  return (
    <section className="px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40">
      <div className="mx-auto max-w-3xl">
        <div className="eyebrow eyebrow-accent">Privacy</div>
        <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
          Privacy policy
        </h1>
        <p className="mt-4 text-sm text-ink-faint">Last updated: {LAST_UPDATED}</p>
        <p className="mt-6 text-[15px] leading-relaxed text-ink-soft md:text-[17px]">
          This is the short, honest version. We only collect what we need to reply to you, to give
          you the result you asked for, and to understand how people find and use the site. We do
          not sell your data. We do run advertising measurement, because we advertise on Google
          Search, and the section below says exactly what that involves.
        </p>

        <div className="mt-12 space-y-12">
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              What we collect
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              When you use our contact form or AI chat, we collect the details you give us: your
              name, email address, company, the service you are interested in, and your message.
              When you book a call, the scheduler collects the time you pick and the contact details
              you enter.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              When you take the AI readiness assessment, we collect your answers, the score and band
              they produce, and the optional budget range if you choose to give one. If you enter
              your email part-way through so we can send you the result, we receive that email even
              if you do not finish. That is deliberate, and it is the only reason we ask for it
              there: so we can send you the score you started.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              We also use Google Analytics 4 to understand site traffic. It collects standard
              analytics data such as pages viewed, rough location (country or city level), device
              and browser type, and how you arrived at the site. It uses cookies to do this. We do
              not link this data to your name.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              If you reach us by clicking a Google Search ad, your browser arrives carrying a Google
              click identifier (a <span className="font-medium text-ink">gclid</span>) and campaign
              labels. We keep those for the duration of your visit and attach them to your enquiry,
              so we can tell which advert produced it and stop paying for the ones that do not work.
              It identifies the click, not you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              How we use it
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              We use the details from the contact form and chat to reply to you, to scope your
              project, and to follow up about working together. We send these emails through Resend,
              our email provider, which processes your message and email address so we can reach
              you and send a confirmation. We use the analytics data to see which pages and topics
              are useful, so we can improve the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Who we share it with
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              We use a small number of trusted providers to run the site: Resend for email delivery,
              Google Analytics for traffic, Cloudflare Turnstile to keep spam out of the forms, and
              Calendly when you book a call. Each processes only what it needs for that job.
              <span className="font-medium text-ink"> We never sell your data.</span> Where you came
              from a Google advert, Google Analytics reports back to Google Ads that a conversion
              happened and which click it belonged to. That measurement is about the advert, not
              about you, and we do not upload your name or email to any advertising platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              How long we keep it
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              We keep enquiry emails for as long as we are in contact and for a reasonable period
              after, in case you come back to us. If you gave us an email part-way through the
              assessment and never finished, we may send you one message about it and then leave you
              alone. You can ask us to delete your details at any time, and we will.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Your choices
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              You can ask to see, correct, or delete the personal data we hold about you. Email us
              and we will sort it out. You can also block analytics cookies in your browser settings
              if you prefer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Contact us</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              For anything about your data, or this policy, email{' '}
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
