import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light, flat palette (gradient-free). Brand purple is solid only.
        'bg-base': '#FFFFFF',
        'bg-subtle': '#FAFAFA',
        ink: '#141414', // headings
        'ink-soft': '#555555', // body
        'ink-faint': '#8A8A8A', // captions
        'border-subtle': '#ECECEC',
        'border-strong': '#DADADA',
        'traq-purple': '#5B3FE4', // confirmed brand token (brand-kit/tokens.css)
        'traq-purple-ink': '#4A30C9',
        'traq-tint': '#F3F0FF', // solid pale-purple surface (NOT a gradient)
        // Solid brand scale, kept for accents (no gradients).
        traq: {
          purple: '#5B3FE4',
          light: '#7C63F0',
          dim: '#3D2BAA',
          deep: '#2A1D7A',
        },
        // Back-compat aliases for markup not yet rebuilt — all map to light values.
        bg: {
          base: '#FFFFFF',
          card: '#FFFFFF',
          elevated: '#FAFAFA',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        hand: ['var(--font-hand)', 'ui-rounded', 'cursive'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,20,20,0.04), 0 4px 16px rgba(20,20,20,0.06)',
        cardHover: '0 2px 4px rgba(20,20,20,0.06), 0 12px 28px rgba(20,20,20,0.10)',
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
