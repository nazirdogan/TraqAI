'use client';

import { motion, useReducedMotion } from 'framer-motion';
import JsonLd from '@/components/seo/JsonLd';
import { FAQS } from '@/lib/constants';

const ease = [0.22, 1, 0.36, 1] as const;

// FAQPage schema is built from the same FAQS array that renders below, so the
// structured data always matches the visible on-page content.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function FAQ() {
  const reduce = useReducedMotion();
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="faq" className="relative bg-bg-subtle px-5 py-20 sm:px-8 sm:py-28 md:py-32">
      <JsonLd data={faqSchema} />
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <div className="eyebrow eyebrow-accent">FAQ</div>
          <h2 className="section-title mt-4">Questions teams ask before we start</h2>
          <p className="section-sub mx-auto mt-4 text-center">
            Straight answers on training, the fractional Head of AI role, and working with us.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.07 }}
          className="mt-10 flex flex-col gap-3 sm:mt-12 sm:gap-3.5"
        >
          {FAQS.map((faq) => (
            <motion.details
              key={faq.question}
              variants={item}
              transition={{ duration: 0.45, ease }}
              className="group rounded-[18px] border border-border-subtle bg-white shadow-card transition-colors duration-300 open:border-border-strong sm:rounded-[20px]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold leading-snug text-ink marker:hidden sm:px-6 sm:py-5 sm:text-base [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-border-subtle text-traq-purple transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <p className="m-0 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
                  {faq.answer}
                </p>
              </div>
            </motion.details>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
