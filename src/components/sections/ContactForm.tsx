'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, Globe, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import FadeUp from '@/components/ui/FadeUp';
import Tag from '@/components/ui/Tag';
import { COMPANY, SERVICE_DROPDOWN_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/cn';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid work email'),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, 'Please share at least a sentence or two'),
});

type FormValues = z.infer<typeof schema>;

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmit = async (values: FormValues) => {
    setStatus('submitting');
    setErrorMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? 'Submission failed');
      }
      setStatus('success');
      reset();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const labelBase = 'text-[11px] font-semibold uppercase tracking-widest text-white/55';
  const inputBase =
    'mt-2 w-full rounded-xl border border-border-subtle bg-bg-base/60 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-traq-light focus:outline-none focus:ring-0';

  return (
    <section id="contact" className="relative pt-10 pb-24 sm:pt-14 sm:pb-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
        <FadeUp>
          <Tag>Let&rsquo;s talk</Tag>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Tell us where you&rsquo;re stuck. <span className="text-gradient">We&rsquo;ll tell you what&rsquo;s actually possible.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            A free 30-minute call, no pitch. We&rsquo;ll sketch a plain-language roadmap for how
            AI, automation and a sharper digital presence could change the numbers for you.
          </p>

          <ul className="mt-10 space-y-5">
            <li className="flex items-start gap-4">
              <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-traq-purple/15 text-traq-light ring-1 ring-traq-purple/30">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <p className={labelBase}>Email</p>
                <a href={`mailto:${COMPANY.email}`} className="mt-1 block text-sm text-white hover:text-traq-light">
                  {COMPANY.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-traq-purple/15 text-traq-light ring-1 ring-traq-purple/30">
                <Phone className="h-4 w-4" />
              </span>
              <div>
                <p className={labelBase}>Phone · WhatsApp</p>
                <a href={`tel:${COMPANY.phone.replace(/\s|\(|\)|-/g, '')}`} className="mt-1 block text-sm text-white hover:text-traq-light">
                  {COMPANY.phone}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-traq-purple/15 text-traq-light ring-1 ring-traq-purple/30">
                <Globe className="h-4 w-4" />
              </span>
              <div>
                <p className={labelBase}>Where we work</p>
                <p className="mt-1 text-sm text-white">{COMPANY.location}</p>
              </div>
            </li>
          </ul>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-4 rounded-[28px] bg-traq-purple/10 blur-3xl"
              aria-hidden="true"
            />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative glass-strong rounded-3xl p-7 shadow-card sm:p-9"
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelBase} htmlFor="firstName">
                    First name
                  </label>
                  <input
                    id="firstName"
                    {...register('firstName')}
                    className={cn(inputBase, errors.firstName && 'border-red-400/60')}
                    placeholder="Jane"
                    autoComplete="given-name"
                  />
                  {errors.firstName ? (
                    <p className="mt-1.5 text-xs text-red-300">{errors.firstName.message}</p>
                  ) : null}
                </div>
                <div>
                  <label className={labelBase} htmlFor="lastName">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    {...register('lastName')}
                    className={cn(inputBase, errors.lastName && 'border-red-400/60')}
                    placeholder="Doe"
                    autoComplete="family-name"
                  />
                  {errors.lastName ? (
                    <p className="mt-1.5 text-xs text-red-300">{errors.lastName.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-5">
                <label className={labelBase} htmlFor="email">
                  Work email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={cn(inputBase, errors.email && 'border-red-400/60')}
                  placeholder="jane@company.com"
                  autoComplete="email"
                />
                {errors.email ? (
                  <p className="mt-1.5 text-xs text-red-300">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelBase} htmlFor="company">
                    Company
                  </label>
                  <input
                    id="company"
                    {...register('company')}
                    className={inputBase}
                    placeholder="Company name"
                    autoComplete="organization"
                  />
                </div>
                <div>
                  <label className={labelBase} htmlFor="service">
                    Interested in
                  </label>
                  <select
                    id="service"
                    {...register('service')}
                    className={cn(inputBase, 'appearance-none pr-10')}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {SERVICE_DROPDOWN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5">
                <label className={labelBase} htmlFor="message">
                  What are you trying to solve?
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register('message')}
                  className={cn(inputBase, 'resize-none', errors.message && 'border-red-400/60')}
                  placeholder="Give us a sense of the workflow, the numbers involved, or the outcome you&rsquo;re chasing."
                />
                {errors.message ? (
                  <p className="mt-1.5 text-xs text-red-300">{errors.message.message}</p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-traq-purple px-6 py-3.5 text-sm font-medium text-white shadow-glow transition-all hover:bg-traq-light hover:shadow-glow-strong disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending…' : 'Send message'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              {status === 'success' ? (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" />
                  <p>Thanks — we&rsquo;ve got it. Expect a reply within one business day.</p>
                </div>
              ) : null}
              {status === 'error' ? (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
                  <p>
                    {errorMessage ||
                      'Something went wrong. Please try again or email us directly.'}
                  </p>
                </div>
              ) : null}

              <p className="mt-5 text-xs text-white/45">
                We&rsquo;ll never share your details. You can reply &ldquo;unsubscribe&rdquo; at any
                time.
              </p>
            </form>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
