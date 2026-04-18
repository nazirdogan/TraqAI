import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Globe } from 'lucide-react';
import { COMPANY, SERVICES } from '@/lib/constants';

const FOOTER_NAV = [
  {
    heading: 'Explore',
    links: [
      { label: 'Services', href: '/#services' },
      { label: 'Process', href: '/#process' },
      { label: 'Impact', href: '/#impact' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/#about' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border-subtle bg-bg-base">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-traq-purple/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <Link href="/" className="inline-block" aria-label="Traq Collective home">
              <Image
                src="/logos/wordmark-white.png"
                alt="Traq Collective"
                width={1888}
                height={696}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
              {COMPANY.tagline} We combine AI integration, automation, data intelligence and
              digital presence into one accountable delivery team.
            </p>
          </div>

          {FOOTER_NAV.map((group) => (
            <div key={group.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
                {group.heading}
              </h3>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-white/75">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 flex-none text-traq-light" />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-white">
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-none text-traq-light" />
                <a href={`tel:${COMPANY.phone.replace(/\s|\(|\)|-/g, '')}`} className="hover:text-white">
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="mt-0.5 h-4 w-4 flex-none text-traq-light" />
                <span>{COMPANY.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-border-subtle pt-8">
          <p className="text-xs uppercase tracking-widest text-white/40">Services</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/#${s.slug}`}
                className="text-xs text-white/55 transition-colors hover:text-white/90"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border-subtle pt-8 text-xs text-white/45 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Traq Collective. All rights reserved.</p>
          <p>Built for operators. Deployed worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
