import Hero from '@/components/sections/Hero';
import TrustedBy from '@/components/sections/TrustedBy';
import Problem from '@/components/sections/Problem';
import Services from '@/components/sections/Services';
import Process from '@/components/sections/Process';
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
      <Problem />
      <Services />
      <Process />
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
