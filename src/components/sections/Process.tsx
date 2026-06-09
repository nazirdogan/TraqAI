import { PROCESS_STEPS } from '@/lib/constants';

export default function Process() {
  return (
    <section id="process" className="relative px-5 py-20 sm:px-8 sm:py-28 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-16">
          <div className="eyebrow">How we work</div>
          <h2 className="section-title mt-4">
            A process designed to <span className="text-gradient">ship in weeks, not quarters.</span>
          </h2>
          <p className="section-sub mx-auto">
            Short loops, real pilots, and no slide-deck theatre. You see working software early and we
            iterate with your team until it fits.
          </p>
        </div>

        <div className="relative mt-10 grid gap-8 sm:mt-14 sm:gap-10 md:mt-20 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <div className="process-rail" aria-hidden="true" />
          {PROCESS_STEPS.map((step) => (
            <div key={step.number} className="relative z-[1] text-center md:text-left">
              <div className="process-node mx-auto md:mx-0">{step.number}</div>
              <h3 className="m-0 mb-2 text-base font-semibold leading-tight tracking-tight text-white sm:text-[18px]">
                {step.title}
              </h3>
              <p className="m-0 text-[13px] leading-relaxed text-white/60 [text-wrap:pretty] sm:text-[14px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
