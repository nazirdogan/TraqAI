import Hero from '@/components/sections/Hero';
import TrustedBy from '@/components/sections/TrustedBy';
import Problem from '@/components/sections/Problem';
import Services from '@/components/sections/Services';
import Process from '@/components/sections/Process';
import WhyUs from '@/components/sections/WhyUs';
import Impact from '@/components/sections/Impact';
import ContactIntake from '@/components/sections/ContactIntake';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Problem />
      <Services />
      <Process />
      <WhyUs />
      <Impact />
      <ContactIntake />
    </>
  );
}
