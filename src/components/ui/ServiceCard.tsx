import { Check } from 'lucide-react';
import type { Service } from '@/lib/constants';

type Props = {
  service: Service;
};

export default function ServiceCard({ service }: Props) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl glass p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-traq-purple/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-traq-purple/15 text-2xl ring-1 ring-traq-purple/30">
        <span aria-hidden="true">{service.icon}</span>
      </div>
      <h3 className="mt-6 text-xl font-semibold text-white">{service.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/65">{service.description}</p>

      <ul className="mt-6 space-y-3 text-sm text-white/75">
        {service.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-traq-purple/15 text-traq-light">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
