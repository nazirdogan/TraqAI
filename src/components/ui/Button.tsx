import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'md' | 'lg';

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type AnchorProps = BaseProps & {
  href: string;
  external?: boolean;
  type?: never;
  onClick?: never;
  disabled?: never;
};

type ButtonElProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-traq-light focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:opacity-50 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary:
    'bg-traq-purple text-white shadow-glow hover:bg-traq-light hover:shadow-glow-strong active:scale-[0.98]',
  outline:
    'border border-border-strong bg-white/[0.02] text-white hover:bg-white/[0.06] hover:border-traq-light',
  ghost:
    'text-white/80 hover:text-white hover:bg-white/[0.06]',
};

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

export default function Button(props: AnchorProps | ButtonElProps) {
  const variant = props.variant ?? 'primary';
  const size = props.size ?? 'md';
  const classes = cn(base, variants[variant], sizes[size], props.className);

  if ('href' in props && props.href) {
    const { href, external, children, className: _className, variant: _v, size: _s, ...rest } = props;
    void _className;
    void _v;
    void _s;
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...(rest as Record<string, unknown>)}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { children, className: _className, variant: _v, size: _s, ...rest } = props as ButtonElProps;
  void _className;
  void _v;
  void _s;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
