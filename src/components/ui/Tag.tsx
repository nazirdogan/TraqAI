import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  tone?: 'purple' | 'neutral';
};

export default function Tag({ children, className, tone = 'purple' }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide uppercase',
        tone === 'purple'
          ? 'border-traq-purple/30 bg-traq-purple/10 text-traq-light'
          : 'border-white/10 bg-white/[0.04] text-white/80',
        className,
      )}
    >
      <span
        className={cn(
          'inline-block h-1.5 w-1.5 rounded-full',
          tone === 'purple' ? 'bg-traq-light shadow-[0_0_8px_rgba(124,99,240,0.8)]' : 'bg-white/60',
        )}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}
