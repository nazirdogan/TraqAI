import Link from 'next/link';
import { MapPin, Globe2, Phone } from 'lucide-react';

/**
 * LocalBand — a slim credibility strip directly under the hero that grounds the
 * Traq entity in the UAE without narrowing it: based in the UAE, on-site in
 * Dubai & Abu Dhabi, and remote delivery worldwide, with the local phone number.
 * Reinforces the "globally fluent, locally embedded" positioning and feeds the
 * geo signal AI engines read for UAE-scoped queries, while the global line keeps
 * geo-neutral reach intact.
 */
const ITEMS = [
  {
    icon: MapPin,
    title: 'Based in the UAE',
    detail: 'On-site in Dubai & Abu Dhabi',
  },
  {
    icon: Globe2,
    title: 'Global delivery',
    detail: 'Remote with teams worldwide',
  },
] as const;

export default function LocalBand() {
  return (
    <section className="bg-bg-base px-5 pb-2 pt-2 sm:px-8 sm:pb-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-stretch gap-2 rounded-[20px] border border-border-subtle bg-white p-3 shadow-card sm:flex-row sm:items-center sm:p-4">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex flex-1 items-center gap-3 px-2 py-1.5">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-traq-tint text-traq-purple">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-ink">{item.title}</span>
                  <span className="block text-[13px] text-ink-soft">{item.detail}</span>
                </span>
              </div>
            );
          })}

          {/* Local phone — a real, clickable contact, not a dead label. */}
          <Link
            href="tel:+971508687196"
            className="flex flex-1 items-center gap-3 rounded-[14px] px-2 py-1.5 transition-colors hover:bg-traq-tint sm:flex-none sm:px-4"
          >
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-traq-tint text-traq-purple">
              <Phone className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-[13px] text-ink-faint">Call us in the UAE</span>
              <span className="block text-sm font-semibold text-ink">+971 50 868 7196</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
