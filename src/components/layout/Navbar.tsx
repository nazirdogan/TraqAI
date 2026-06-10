'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { track } from '@/components/analytics/Analytics';
import { cn } from '@/lib/cn';

type NavLink = { label: string; href: string };

// Real routes (full pages), not in-page anchors.
const SERVICE_LINKS: NavLink[] = [
  { label: 'All services', href: '/services' },
  { label: 'AI training', href: '/services/ai-training' },
  { label: 'Consulting & strategy', href: '/services/ai-consulting' },
  { label: 'Implementation', href: '/services/ai-implementation' },
  { label: 'Agentic AI', href: '/services/agentic-ai' },
  { label: 'Fractional Head of AI', href: '/fractional-head-of-ai' },
  { label: 'AI consulting in the UAE', href: '/ai-consulting-uae' },
];

// Top-level links shown after the Services dropdown. These are real routes
// where possible; the remaining home anchors still scroll smoothly on /.
const LINKS: NavLink[] = [
  { label: 'How we work', href: '/#how-we-work' },
  { label: 'Proof', href: '/#proof' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close the desktop Services dropdown on outside click or Escape.
  useEffect(() => {
    if (!servicesOpen) return;
    const onClick = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setServicesOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [servicesOpen]);

  const closeAll = () => {
    setOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  };

  const scrollToHash = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) {
      closeAll();
      return;
    }
    // Only intercept in-page anchors when we're already on the home page.
    if (window.location.pathname !== '/') {
      closeAll();
      return;
    }
    const id = href.slice(hashIndex + 1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.history.replaceState) {
      window.history.replaceState(null, '', `#${id}`);
    }
    closeAll();
  };

  return (
    <header className="fixed left-1/2 top-3 z-50 w-[calc(100%-20px)] max-w-7xl -translate-x-1/2 transition-all duration-300 sm:top-5 sm:w-[calc(100%-40px)]">
      <div
        className={cn(
          'flex items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 sm:px-6',
          scrolled
            ? 'border-border-subtle bg-white/85 shadow-card backdrop-blur-xl'
            : 'border-transparent bg-transparent',
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-traq-purple"
          aria-label="Traq Collective home"
          onClick={closeAll}
        >
          <Image
            src="/logos/wordmark-purple.png"
            alt="Traq Collective"
            width={1888}
            height={696}
            priority
            className="h-[26px] w-auto"
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {/* Services dropdown */}
          <div ref={servicesRef} className="relative">
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-traq-tint hover:text-ink',
                servicesOpen ? 'bg-traq-tint text-ink' : 'text-ink-soft',
              )}
            >
              Services
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  servicesOpen ? 'rotate-180' : '',
                )}
                aria-hidden="true"
              />
            </button>

            {servicesOpen ? (
              <div
                role="menu"
                aria-label="Services"
                className="absolute left-0 top-[calc(100%+10px)] w-64 rounded-2xl border border-border-subtle bg-white p-2 shadow-card"
              >
                {SERVICE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    onClick={closeAll}
                    className="block rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-traq-tint hover:text-ink"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={scrollToHash(link.href)}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-traq-tint hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex">
          <Link
            href="/book"
            onClick={() => {
              closeAll();
              track('cta_book_click', { location: 'navbar_desktop' });
            }}
            className="inline-flex items-center gap-2 rounded-full bg-traq-purple px-4 py-2.5 text-[13px] font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover"
          >
            Book a call <span aria-hidden="true">→</span>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-white text-ink lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-x-0 top-[72px] origin-top transition-all duration-300 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="mx-3 max-h-[calc(100vh-96px)] overflow-y-auto rounded-2xl border border-border-subtle bg-white p-4 shadow-card sm:mx-4">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {/* Mobile Services group (expandable) */}
            <button
              type="button"
              aria-expanded={mobileServicesOpen}
              onClick={() => setMobileServicesOpen((v) => !v)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-base text-ink transition-colors hover:bg-traq-tint"
            >
              Services
              <ChevronDown
                className={cn(
                  'h-5 w-5 transition-transform',
                  mobileServicesOpen ? 'rotate-180' : '',
                )}
                aria-hidden="true"
              />
            </button>
            {mobileServicesOpen ? (
              <div className="mb-1 ml-2 flex flex-col gap-0.5 border-l border-border-subtle pl-2">
                {SERVICE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeAll}
                    className="rounded-xl px-4 py-2.5 text-[15px] text-ink-soft transition-colors hover:bg-traq-tint hover:text-ink"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}

            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={scrollToHash(link.href)}
                className="rounded-xl px-4 py-3 text-base text-ink transition-colors hover:bg-traq-tint"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/book"
              onClick={() => {
                closeAll();
                track('cta_book_click', { location: 'navbar_mobile' });
              }}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-traq-purple px-5 py-3 text-sm font-semibold text-white"
            >
              Book a call <span aria-hidden="true">→</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
