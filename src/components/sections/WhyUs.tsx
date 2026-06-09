import { BENEFITS } from '@/lib/constants';

export default function WhyUs() {
  return (
    <section id="about" className="relative px-5 py-20 sm:px-8 sm:py-28 md:py-32">
      <div className="mx-auto grid max-w-7xl items-start gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="text-left">
          <div className="eyebrow">Why Traq</div>
          <h2 className="section-title mt-4">
            Built by builders. <span className="text-gradient">Not consultants.</span>
          </h2>
          <p className="section-sub max-w-xl">
            We&rsquo;re senior operators who got tired of delivery theatre. Every engagement ends with
            production code, real metrics, and a team that knows how to run it.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
            <div className="chip">
              <span className="chip-dot" />
              Live pipeline
            </div>
            <div className="chip">Ship · Measure · Iterate</div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-3.5">
          {BENEFITS.map((b, i) => (
            <div
              key={b.title}
              className="rounded-[18px] border border-border-subtle bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-traq-light/40 hover:bg-traq-purple/[0.06] sm:rounded-[20px] sm:p-6"
            >
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-traq-light sm:mb-3.5">
                {`0${i + 1} / Principle`}
              </div>
              <h3 className="m-0 mb-2 text-base font-semibold leading-tight tracking-tight text-white sm:mb-2.5 sm:text-[17px]">
                {b.title}
              </h3>
              <p className="m-0 text-[13px] leading-relaxed text-white/60">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
