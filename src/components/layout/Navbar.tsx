'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  { label: 'Embedded AI Partner', href: '/fractional-head-of-ai' },
  { label: 'AI consulting in the UAE', href: '/ai-consulting-uae' },
];

// Top-level links shown after the Services dropdown. Kept lean: About,
// Insights, AI readiness and FAQ live in the footer, not the navbar.
const LINKS: NavLink[] = [
  { label: 'How we work', href: '/#how-we-work' },
  { label: 'Proof', href: '/#proof' },
  { label: 'Contact', href: '/#contact' },
];

/**
 * The "tubelight" lamp: a soft purple glow that sits on the active/hovered nav
 * item and slides between items via a shared layoutId. Adapted from the
 * tubelight-navbar primitive to the Traq purple theme.
 */
function Lamp() {
  return (
    <motion.span
      layoutId="navlamp"
      className="absolute inset-0 -z-10 rounded-full bg-traq-purple/5"
      initial={false}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      aria-hidden="true"
    >
      <span className="absolute -top-[9px] left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-traq-purple">
        <span className="absolute -left-2 -top-2 h-6 w-12 rounded-full bg-traq-purple/25 blur-md" />
        <span className="absolute -top-1 h-6 w-8 rounded-full bg-traq-purple/20 blur-md" />
        <span className="absolute left-2 top-0 h-4 w-4 rounded-full bg-traq-purple/20 blur-sm" />
      </span>
    </motion.span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  // Which nav item the tubelight lamp is currently lit on (hover-driven).
  const [hovered, setHovered] = useState<string | null>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The route-active item: Services when on any services route, otherwise none.
  const onServices =
    pathname?.startsWith('/services') ||
    pathname === '/fractional-head-of-ai' ||
    pathname === '/ai-consulting-uae';
  const routeActive = onServices ? 'Services' : null;
  // The lamp lights the hovered item, else the open dropdown, else the route.
  const lit = hovered ?? (servicesOpen ? 'Services' : routeActive);

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

  // Hover/focus open for the desktop Services dropdown.
  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
    setHovered('Services');
  };
  // Small delay so moving the cursor from the trigger to the menu doesn't close it.
  const closeServicesSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
  };

  // Close the Services dropdown on Escape; clear any pending timer on unmount.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setServicesOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

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

        {/* Desktop nav — tubelight pill. The lamp glides to the hovered/active item. */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {/* Services dropdown — opens on hover (and keyboard focus), animated in/out. */}
          <div
            ref={servicesRef}
            className="relative"
            onMouseEnter={openServices}
            onMouseLeave={closeServicesSoon}
            onFocus={openServices}
            onBlur={(e) => {
              if (!servicesRef.current?.contains(e.relatedTarget as Node)) {
                setServicesOpen(false);
              }
            }}
          >
            <Link
              href="/services"
              onClick={closeAll}
              aria-haspopup="true"
              aria-expanded={servicesOpen}
              className={cn(
                'relative inline-flex cursor-pointer items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                lit === 'Services' ? 'text-traq-purple' : 'text-ink/80 hover:text-traq-purple',
              )}
            >
              Services
              <ChevronDown
                className={cn('h-4 w-4 transition-transform', servicesOpen ? 'rotate-180' : '')}
                aria-hidden="true"
              />
              {lit === 'Services' ? <Lamp /> : null}
            </Link>

            <AnimatePresence>
              {servicesOpen ? (
                <motion.div
                  role="menu"
                  aria-label="Services"
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  style={{ x: '-50%' }}
                  className="absolute left-1/2 top-full z-50 w-72 origin-top pt-3.5"
                >
                  {/* pt-3.5 bridges the gap to the trigger so hover doesn't drop */}
                  <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-white/95 p-2 shadow-card backdrop-blur-xl">
                    {/* tubelight accent line at the top of the menu */}
                    <span
                      className="pointer-events-none absolute left-1/2 top-0 h-1 w-10 -translate-x-1/2 rounded-b-full bg-traq-purple"
                      aria-hidden="true"
                    />
                    {SERVICE_LINKS.map((link) => {
                      const active = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          role="menuitem"
                          onClick={closeAll}
                          className={cn(
                            'block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                            active
                              ? 'bg-traq-tint text-traq-purple'
                              : 'text-ink-soft hover:bg-traq-tint hover:text-traq-purple',
                          )}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={scrollToHash(link.href)}
              onMouseEnter={() => setHovered(link.label)}
              className={cn(
                'relative rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                lit === link.label ? 'text-traq-purple' : 'text-ink/80 hover:text-traq-purple',
              )}
            >
              {link.label}
              {lit === link.label ? <Lamp /> : null}
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
              className={cn(
                'flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-traq-tint hover:text-traq-purple',
                onServices ? 'text-traq-purple' : 'text-ink',
              )}
            >
              Services
              <ChevronDown
                className={cn('h-5 w-5 transition-transform', mobileServicesOpen ? 'rotate-180' : '')}
                aria-hidden="true"
              />
            </button>
            {mobileServicesOpen ? (
              <div className="mb-1 ml-2 flex flex-col gap-0.5 border-l border-traq-purple/30 pl-2">
                {SERVICE_LINKS.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeAll}
                      className={cn(
                        'rounded-xl px-4 py-2.5 text-[15px] transition-colors',
                        active
                          ? 'bg-traq-tint text-traq-purple'
                          : 'text-ink-soft hover:bg-traq-tint hover:text-traq-purple',
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}

            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={scrollToHash(link.href)}
                className="rounded-xl px-4 py-3 text-base text-ink transition-colors hover:bg-traq-tint hover:text-traq-purple"
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
