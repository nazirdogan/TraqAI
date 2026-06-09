'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { track } from '@/components/analytics/Analytics';
import { cn } from '@/lib/cn';

const LINKS = [
  { label: 'Sound familiar?', href: '/#problem' },
  { label: 'What we do', href: '/#services' },
  { label: 'How we work', href: '/#how-we-work' },
  { label: 'Ways to work', href: '/#ways-to-work' },
  { label: 'Proof', href: '/#proof' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

  const scrollToHash = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) {
      setOpen(false);
      return;
    }
    // Only intercept in-page anchors when we're already on the home page.
    if (window.location.pathname !== '/') {
      setOpen(false);
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
    setOpen(false);
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
          onClick={() => setOpen(false)}
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
              setOpen(false);
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
        <div className="mx-3 rounded-2xl border border-border-subtle bg-white p-4 shadow-card sm:mx-4">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
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
                setOpen(false);
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
