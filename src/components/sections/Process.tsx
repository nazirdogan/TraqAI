import FadeUp from '@/components/ui/FadeUp';
import SectionHeader from '@/components/ui/SectionHeader';
import ProcessStep from '@/components/ui/ProcessStep';
import { PROCESS_STEPS } from '@/lib/constants';

export default function Process() {
  return (
    <section id="process" className="relative pt-10 pb-24 sm:pt-14 sm:pb-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeUp>
          <SectionHeader
            eyebrow="How we work"
            title={
              <>
                A process designed to <span className="text-gradient">ship in weeks, not quarters.</span>
              </>
            }
            description="Short loops, real pilots, and no slide-deck theatre. You see working software early and we iterate with your team until it fits."
          />
        </FadeUp>

        <div className="relative mt-20">
          <div
            className="pointer-events-none absolute left-6 right-6 top-6 hidden h-px bg-gradient-to-r from-transparent via-traq-light/50 to-transparent md:block"
            aria-hidden="true"
          />
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {PROCESS_STEPS.map((step, i) => (
              <FadeUp key={step.number} delay={i * 0.08} className="h-full">
                <ProcessStep step={step} />
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
