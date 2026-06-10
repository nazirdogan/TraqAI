import Hero from '@/components/sections/Hero';
import TrustedBy from '@/components/sections/TrustedBy';
import Problem from '@/components/sections/Problem';
import Services from '@/components/sections/Services';
import Process from '@/components/sections/Process';
import JourneySpine from '@/components/journey/JourneySpine';
import Offers from '@/components/sections/Offers';
import Founder from '@/components/sections/Founder';
import WhyUs from '@/components/sections/WhyUs';
import Impact from '@/components/sections/Impact';
import FAQ from '@/components/sections/FAQ';
import CTABanner from '@/components/sections/CTABanner';
import ContactIntake from '@/components/sections/ContactIntake';

export default function HomePage() {
  return (
    // The guided journey spine runs full-height down the left edge of the whole
    // page. It overlays the left margin (pointer-events-none) so it adds no
    // scroll and never covers content; nodes light up at each named stage.
    <div className="relative">
      <JourneySpine />
      <Hero />
      <TrustedBy />
      <Problem />
      <Services />
      <Process />
      <Offers />
      <Founder />
      <WhyUs />
      <Impact />
      <FAQ />
      <CTABanner />
      <ContactIntake />
    </div>
  );
}
