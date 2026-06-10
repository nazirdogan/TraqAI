import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Globe } from 'lucide-react';
import { COMPANY, SERVICES } from '@/lib/constants';

// Map each capability to its dedicated service page so the footer feeds the
// SEO surface instead of a single home anchor.
const SERVICE_HREF: Record<string, string> = {
  'ai-training': '/services/ai-training',
  'ai-consulting': '/services/ai-consulting',
  'ai-implementation': '/services/ai-implementation',
  'agentic-ai': '/services/agentic-ai',
};

const FOOTER_NAV = [
  {
    heading: 'Services',
    links: [
      { label: 'All services', href: '/services' },
      { label: 'AI training', href: '/services/ai-training' },
      { label: 'Consulting & strategy', href: '/services/ai-consulting' },
      { label: 'Implementation', href: '/services/ai-implementation' },
      { label: 'Agentic AI', href: '/services/agentic-ai' },
      { label: 'Embedded AI Partner', href: '/fractional-head-of-ai' },
      { label: 'AI consulting in the UAE', href: '/ai-consulting-uae' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Insights', href: '/insights' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Book a call', href: '/book' },
      { label: 'Contact', href: '/#contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border-subtle bg-bg-base sm:mt-24">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-14">
          <div>
            <Link href="/" className="inline-block" aria-label="Traq Collective home">
              <Image
                src="/logos/wordmark-purple.png"
                alt="Traq Collective"
                width={1888}
                height={696}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-soft">
              {COMPANY.tagline} We train your people, wire AI into the way you already work, and
              stay until your team can run it without us.
            </p>
          </div>

          {FOOTER_NAV.map((group) => (
            <div key={group.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
                {group.heading}
              </h3>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-soft transition-colors hover:text-traq-purple"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-ink-soft">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 flex-none text-traq-purple" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="transition-colors hover:text-traq-purple"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-none text-traq-purple" />
                <a
                  href={`tel:${COMPANY.phone.replace(/\s|\(|\)|-/g, '')}`}
                  className="transition-colors hover:text-traq-purple"
                >
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="mt-0.5 h-4 w-4 flex-none text-traq-purple" />
                <span>{COMPANY.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border-subtle pt-8 sm:mt-14">
          <p className="text-xs uppercase tracking-widest text-ink-faint">What we do</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 sm:gap-x-6">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={SERVICE_HREF[s.slug] ?? '/services'}
                className="text-xs text-ink-soft transition-colors hover:text-traq-purple"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-border-subtle pt-8 text-xs text-ink-faint sm:mt-10 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Traq Collective. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link href="/privacy" className="transition-colors hover:text-traq-purple">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-traq-purple">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
