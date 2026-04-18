import FadeUp from '@/components/ui/FadeUp';
import SectionHeader from '@/components/ui/SectionHeader';
import ServiceCard from '@/components/ui/ServiceCard';
import { SERVICES } from '@/lib/constants';

export default function Services() {
  return (
    <section id="services" className="relative pt-10 pb-24 sm:pt-14 sm:pb-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeUp>
          <SectionHeader
            eyebrow="What we do"
            title={
              <>
                Six capabilities. <span className="text-gradient">One accountable team.</span>
              </>
            }
            description="Every engagement draws from the same menu — stitched together around the outcome you actually need, not the org chart of a vendor."
          />
        </FadeUp>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <FadeUp key={service.slug} delay={i * 0.06} className="h-full">
              <div id={service.slug} className="h-full">
                <ServiceCard service={service} />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
