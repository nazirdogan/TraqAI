import type { TechBadgeData } from '@/lib/constants';

type Props = {
  tech: TechBadgeData;
};

export default function TechBadge({ tech }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85 transition-colors hover:border-traq-light/30 hover:bg-white/[0.06]">
      <span
        className="h-2 w-2 flex-none rounded-full"
        style={{
          backgroundColor: tech.dotColor,
          boxShadow: `0 0 10px ${tech.dotColor}`,
        }}
        aria-hidden="true"
      />
      <span className="truncate">{tech.name}</span>
    </div>
  );
}
