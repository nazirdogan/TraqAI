import type { ImpactMetric } from '@/lib/constants';

type Props = {
  metric: ImpactMetric;
};

export default function ImpactCard({ metric }: Props) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl glass p-8">
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 h-48 w-48 rounded-full bg-traq-purple/15 blur-3xl"
        aria-hidden="true"
      />
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-white/65">
        {metric.industry}
      </span>
      <div className="mt-8 text-6xl font-semibold tracking-tight text-gradient">{metric.value}</div>
      <h3 className="mt-4 text-lg font-semibold text-white">{metric.label}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/65">{metric.description}</p>
    </article>
  );
}
