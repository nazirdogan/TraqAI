import Tag from './Tag';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? <Tag>{eyebrow}</Tag> : null}
      <h2
        className={cn(
          'max-w-3xl text-balance font-semibold tracking-tight text-white',
          'text-3xl sm:text-4xl md:text-5xl',
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg',
            align === 'center' ? 'text-center' : 'text-left',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
