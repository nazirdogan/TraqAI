import Hero from '@/components/sections/Hero';
import LocalBand from '@/components/sections/LocalBand';
import TrustedBy from '@/components/sections/TrustedBy';
import Problem from '@/components/sections/Problem';
import Services from '@/components/sections/Services';
import Process from '@/components/sections/Process';
import JourneySpine from '@/components/journey/JourneySpine';
import Offers from '@/components/sections/Offers';
import Founder from '@/components/sections/Founder';
import WhyUs from '@/components/sections/WhyUs';
import Proof from '@/components/sections/Proof';
import Impact from '@/components/sections/Impact';
import FAQ from '@/components/sections/FAQ';
import CTABanner from '@/components/sections/CTABanner';
import ContactIntake from '@/components/sections/ContactIntake';
import { WebPageJsonLd } from '@/components/seo/JsonLd';
import { STATIC_REVIEWED_ISO } from '@/lib/seo/reviewed';

export default function HomePage() {
  return (
    // The guided journey spine runs full-height down the left edge of the whole
    // page. It overlays the left margin (pointer-events-none) so it adds no
    // scroll and never covers content; nodes light up at each named stage.
    <div className="relative">
      <WebPageJsonLd
        name="Traq Collective | AI training, consulting and implementation"
        description="Traq Collective is your embedded AI partner: hands-on training, consulting and strategy, implementation, and agentic infrastructure. UAE and global."
        url="/"
        dateModified={STATIC_REVIEWED_ISO}
      />
      <JourneySpine />
      <Hero />
      <LocalBand />
      <TrustedBy />
      <Problem />
      <Services />
      <Process />
      <Offers />
      <Founder />
      <WhyUs />
      <Proof />
      <Impact />
      <FAQ />
      <CTABanner />
      <ContactIntake />
    </div>
  );
}
