'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';

const LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'Process', href: '/#process' },
  { label: 'Why Traq', href: '/#about' },
  { label: 'Impact', href: '/#impact' },
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
    if (hashIndex === -1) return;
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
    <header className="fixed left-1/2 top-5 z-50 w-[calc(100%-40px)] max-w-7xl -translate-x-1/2 transition-all duration-300">
      <div
        className={cn(
          'flex items-center justify-between rounded-full border px-6 py-3 transition-all duration-300',
          scrolled
            ? 'border-border-strong bg-bg-card/75 shadow-card backdrop-blur-2xl'
            : 'border-transparent bg-transparent',
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-traq-light rounded-lg"
          aria-label="Traq Collective home"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logos/wordmark-white.png"
            alt="Traq Collective"
            width={1888}
            height={696}
            priority
            className="h-[26px] w-auto"
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={scrollToHash(link.href)}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Link
            href="/#contact"
            onClick={scrollToHash('/#contact')}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold text-bg-base transition-all hover:bg-[#f0edff] hover:shadow-glow"
          >
            Book a call <span aria-hidden="true">→</span>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-white/[0.04] text-white md:hidden"
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
          'md:hidden fixed inset-x-0 top-[80px] origin-top transition-all duration-300',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="mx-4 glass-strong rounded-2xl p-4 shadow-card">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={scrollToHash(link.href)}
                className="rounded-xl px-4 py-3 text-base text-white/85 transition-colors hover:bg-white/[0.06]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={scrollToHash('/#contact')}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-bg-base"
            >
              Book a call <span aria-hidden="true">→</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
