import { IMPACT_METRICS } from '@/lib/constants';

export default function Impact() {
  return (
    <section id="impact" className="relative px-5 py-20 sm:px-8 sm:py-28 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-16">
          <div className="eyebrow">Measured impact</div>
          <h2 className="section-title mt-4">
            Every engagement has a <span className="text-gradient">number on it.</span>
          </h2>
        </div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {IMPACT_METRICS.map((m) => (
            <div
              key={m.label}
              className="relative overflow-hidden rounded-2xl border border-border-subtle bg-gradient-to-b from-[rgba(20,24,48,0.6)] to-[rgba(14,17,32,0.85)] px-6 py-7 transition-all duration-300 hover:-translate-y-1 hover:border-traq-light/40 sm:rounded-3xl sm:px-8 sm:py-9"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45 sm:mb-5">
                {m.source}
              </div>
              <div className="impact-value mb-3 sm:mb-4">{m.value}</div>
              <div className="m-0 mb-2 text-base font-semibold tracking-tight text-white sm:mb-2.5 sm:text-[17px]">
                {m.label}
              </div>
              <p className="m-0 text-[13px] leading-relaxed text-white/60">{m.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
