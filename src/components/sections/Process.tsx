import { PROCESS_STEPS } from '@/lib/constants';

export default function Process() {
  return (
    <section id="process" className="relative px-5 py-28 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="eyebrow">How we work</div>
          <h2 className="section-title mt-4">
            A process designed to <span className="text-gradient">ship in weeks, not quarters.</span>
          </h2>
          <p className="section-sub mx-auto">
            Short loops, real pilots, and no slide-deck theatre. You see working software early and we
            iterate with your team until it fits.
          </p>
        </div>

        <div className="relative mt-20 grid gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <div className="process-rail" aria-hidden="true" />
          {PROCESS_STEPS.map((step) => (
            <div key={step.number} className="relative z-[1] text-left">
              <div className="process-node">{step.number}</div>
              <h3 className="m-0 mb-2 text-[18px] font-semibold leading-tight tracking-tight text-white">
                {step.title}
              </h3>
              <p className="m-0 text-[14px] leading-relaxed text-white/60 [text-wrap:pretty]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
