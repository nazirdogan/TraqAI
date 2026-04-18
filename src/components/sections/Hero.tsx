'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Tag from '@/components/ui/Tag';
import { HERO_PIPELINE, HERO_STATS } from '@/lib/constants';

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const pipelineItem = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <div className="mesh-bg" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:items-center">
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col">
          <motion.div variants={item} className="flex">
            <Tag>
              <Sparkles className="h-3 w-3" />
              AI integration · automation · digital presence
            </Tag>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-7 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]"
          >
            We wire AI into how your business{' '}
            <span className="text-gradient">actually works.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            Traq Collective is a delivery team that combines AI integration, process automation,
            data intelligence and digital presence — so the tools, workflows and site that run your
            business all finally pull in the same direction.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-traq-purple px-6 py-3.5 text-sm font-medium text-white shadow-glow transition-all hover:bg-traq-light hover:shadow-glow-strong active:scale-[0.98]"
            >
              Book a Free Call
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/#services"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border-strong bg-white/[0.02] px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/[0.06] hover:border-traq-light"
            >
              Explore Services
            </Link>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border-subtle pt-8"
          >
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs font-medium uppercase tracking-widest text-white/45">
                  {stat.label}
                </dt>
                <dd className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Pipeline Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div
            className="pointer-events-none absolute -inset-4 rounded-[32px] bg-traq-purple/15 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-[28px] glass-strong p-6 shadow-card sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/55">
                <span className="h-2 w-2 animate-pulse-slow rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                Live Pipeline
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="h-2 w-2 rounded-full bg-traq-light" />
              </div>
            </div>

            <motion.ul
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
              }}
              className="space-y-3"
            >
              {HERO_PIPELINE.map((step, i) => (
                <motion.li
                  key={step.label}
                  variants={pipelineItem}
                  className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-white/[0.03] p-4 transition-colors hover:border-traq-light/30 hover:bg-white/[0.06]"
                >
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-traq-purple/15 text-lg ring-1 ring-traq-purple/30">
                    <span aria-hidden="true">{step.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">{step.label}</p>
                      <span
                        className={`flex-none rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                          i === 0
                            ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                            : i === 1
                            ? 'border-traq-light/30 bg-traq-purple/20 text-traq-light'
                            : i === 2
                            ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
                            : 'border-sky-400/30 bg-sky-400/10 text-sky-300'
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-white/55">{step.description}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            <div className="mt-6 flex items-center justify-between rounded-xl border border-border-subtle bg-bg-base/60 px-4 py-3 text-xs text-white/55">
              <span>Uptime</span>
              <span className="flex items-center gap-2 text-white/85">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                99.98%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
