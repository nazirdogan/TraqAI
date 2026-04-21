import Link from 'next/link';

export default function CTABanner() {
  return (
    <section className="relative px-5 pb-28 pt-16 sm:px-8 sm:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="cta-panel">
          <div className="eyebrow eyebrow-accent">Let&rsquo;s build</div>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[52px]">
            Your team gets a working pilot in{' '}
            <span className="text-gradient">1–3 weeks.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-[17px]">
            A short call is enough to know whether there&rsquo;s real leverage here. No deck. No
            discovery call about the discovery call.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3.5">
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-bg-base shadow-glow transition-all hover:-translate-y-px hover:bg-[#f0edff] hover:shadow-glow-strong active:scale-[0.98]"
            >
              Book a Free Call
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
            <a
              href="mailto:hello@traqcollective.com"
              className="inline-flex items-center gap-2.5 rounded-full border border-border-strong bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-traq-light hover:bg-white/[0.08]"
            >
              hello@traqcollective.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
