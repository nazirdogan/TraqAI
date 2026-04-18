import FadeUp from '@/components/ui/FadeUp';
import Tag from '@/components/ui/Tag';
import TechBadge from '@/components/ui/TechBadge';
import { BENEFITS, DELIVERY_TIMELINE, TECH_STACK } from '@/lib/constants';
import { CheckCircle2 } from 'lucide-react';

export default function WhyUs() {
  return (
    <section id="about" className="relative pt-10 pb-24 sm:pt-14 sm:pb-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-start lg:gap-16">
        <FadeUp>
          <Tag>Why Traq</Tag>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Built by builders. <span className="text-gradient">Not consultants.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            We&rsquo;re a full-stack team that ships AI integrations, automations, data pipelines and
            the web presence around them — as one accountable delivery surface. No hand-offs, no
            outsourcing, no &ldquo;that&rsquo;s the other vendor&rsquo;s problem.&rdquo;
          </p>

          <ul className="mt-10 space-y-6">
            {BENEFITS.map((b) => (
              <li key={b.title} className="flex items-start gap-4">
                <span className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-traq-purple/15 ring-1 ring-traq-purple/30 text-traq-light">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white">{b.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/65">{b.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-4 rounded-[28px] bg-traq-purple/10 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative glass-strong rounded-3xl p-7 shadow-card sm:p-9">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                Technology stack
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                Every engagement runs on fluent, vendor-neutral infrastructure.
              </h3>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4">
                {TECH_STACK.map((tech) => (
                  <TechBadge key={tech.name} tech={tech} />
                ))}
              </div>

              <div className="mt-10">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                  Delivery timeline
                </p>
                <div className="mt-4 overflow-hidden rounded-full border border-border-subtle bg-bg-base/60">
                  <div className="flex h-10">
                    {DELIVERY_TIMELINE.map((phase, i) => (
                      <div
                        key={phase.label}
                        className={`relative flex h-full items-center justify-center border-r border-border-subtle last:border-r-0 ${
                          i === 0
                            ? 'bg-white/[0.04] text-white/65'
                            : i === 1
                            ? 'bg-traq-purple/25 text-white'
                            : 'bg-traq-purple/45 text-white'
                        }`}
                        style={{ width: phase.width }}
                      >
                        <span className="text-[11px] font-medium uppercase tracking-widest">
                          {phase.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-[11px] uppercase tracking-widest text-white/45">
                  {DELIVERY_TIMELINE.map((phase) => (
                    <span key={phase.range}>{phase.range}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
