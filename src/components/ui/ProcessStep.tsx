import type { ProcessStepData } from '@/lib/constants';

type Props = {
  step: ProcessStepData;
  isLast?: boolean;
};

export default function ProcessStep({ step }: Props) {
  return (
    <div className="relative flex h-full flex-col">
      <div className="flex items-center gap-4">
        <div className="relative flex h-12 w-12 flex-none items-center justify-center rounded-full border border-traq-light/40 bg-bg-card text-sm font-semibold text-traq-light shadow-glow">
          <span
            className="absolute inset-0 animate-pulse-slow rounded-full bg-traq-purple/25 blur-md"
            aria-hidden="true"
          />
          <span className="relative">{step.number}</span>
        </div>
      </div>
      <h3 className="mt-6 text-lg font-semibold text-white">{step.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/65">{step.description}</p>
    </div>
  );
}
