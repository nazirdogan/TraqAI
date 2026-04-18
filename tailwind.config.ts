import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        traq: {
          purple: '#5B3FE4',
          light: '#7C63F0',
          dim: '#3D2BAA',
          deep: '#2A1D7A',
        },
        bg: {
          base: '#080A12',
          card: '#0E1120',
          elevated: '#141830',
        },
        border: {
          subtle: 'rgba(124, 99, 240, 0.14)',
          strong: 'rgba(124, 99, 240, 0.32)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-overlay':
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 60px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 60px)',
        'mesh-purple':
          'radial-gradient(circle at 20% 20%, rgba(91,63,228,0.22) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(124,99,240,0.18) 0, transparent 40%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(91,63,228,0.25)',
        'glow-strong': '0 0 80px rgba(91,63,228,0.45)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 30px 60px -30px rgba(0,0,0,0.8)',
      },
      animation: {
        'mesh-drift': 'meshDrift 22s ease-in-out infinite alternate',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        meshDrift: {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '100%': { transform: 'translate3d(-3%, 2%, 0) scale(1.08)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.7' },
        },
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
