import Hero from '@/components/sections/Hero';
import TrustedBy from '@/components/sections/TrustedBy';
import Problem from '@/components/sections/Problem';
import Services from '@/components/sections/Services';
import Process from '@/components/sections/Process';
import JourneySpine from '@/components/journey/JourneySpine';
import Offers from '@/components/sections/Offers';
import Founder from '@/components/sections/Founder';
import Proof from '@/components/sections/Proof';
import WhyUs from '@/components/sections/WhyUs';
import Impact from '@/components/sections/Impact';
import FAQ from '@/components/sections/FAQ';
import CTABanner from '@/components/sections/CTABanner';
import ContactIntake from '@/components/sections/ContactIntake';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      {/* Guided journey: the spine threads Problem -> What we do -> How we work.
          It overlays the existing whitespace (z-0, pointer-events-none) so it
          adds no scroll and never covers section content. */}
      <div className="relative">
        <JourneySpine />
        <Problem />
        <Services />
        <Process />
      </div>
      <Offers />
      <Founder />
      <Proof />
      <WhyUs />
      <Impact />
      <FAQ />
      <CTABanner />
      <ContactIntake />
    </>
  );
}
