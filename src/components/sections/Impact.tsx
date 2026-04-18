import FadeUp from '@/components/ui/FadeUp';
import SectionHeader from '@/components/ui/SectionHeader';
import ImpactCard from '@/components/ui/ImpactCard';
import { IMPACT_METRICS } from '@/lib/constants';

export default function Impact() {
  return (
    <section id="impact" className="relative pt-10 pb-24 sm:pt-14 sm:pb-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeUp>
          <SectionHeader
            eyebrow="Impact"
            title={
              <>
                Real numbers from <span className="text-gradient">real engagements.</span>
              </>
            }
            description="We measure every project. These are representative outcomes from recent work — the full case studies are available under NDA."
          />
        </FadeUp>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {IMPACT_METRICS.map((m, i) => (
            <FadeUp key={m.label} delay={i * 0.08} className="h-full">
              <ImpactCard metric={m} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
