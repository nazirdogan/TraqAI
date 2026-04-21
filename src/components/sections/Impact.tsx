import { IMPACT_METRICS } from '@/lib/constants';

export default function Impact() {
  return (
    <section id="impact" className="relative px-5 py-28 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="eyebrow">Measured impact</div>
          <h2 className="section-title mt-4">
            Every engagement has a <span className="text-gradient">number on it.</span>
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {IMPACT_METRICS.map((m) => (
            <div
              key={m.label}
              className="relative overflow-hidden rounded-3xl border border-border-subtle bg-gradient-to-b from-[rgba(20,24,48,0.6)] to-[rgba(14,17,32,0.85)] px-8 py-9 transition-all duration-300 hover:-translate-y-1 hover:border-traq-light/40"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                {m.industry}
              </div>
              <div className="impact-value mb-4">{m.value}</div>
              <div className="m-0 mb-2.5 text-[17px] font-semibold tracking-tight text-white">
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
