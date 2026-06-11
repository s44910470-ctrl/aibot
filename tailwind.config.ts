import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './store/**/*.{ts,tsx}',
    './types/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--bg))',
        panel: 'hsl(var(--panel))',
        panel2: 'hsl(var(--panel-2))',
        border: 'hsl(var(--border))',
        text: 'hsl(var(--text))',
        muted: 'hsl(var(--muted))',
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          glow: 'hsl(var(--accent-glow))',
        },
        success: 'hsl(var(--success))',
        danger: 'hsl(var(--danger))',
        warning: 'hsl(var(--warning))',
      },
      boxShadow: {
        glow: '0 0 30px hsl(var(--accent) / 0.18)',
        panel: '0 10px 30px rgba(0,0,0,0.35)',
      },
      backgroundImage: {
        'radial-grid': 'radial-gradient(circle at center, rgba(255,255,255,0.08) 0, transparent 1px)',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        pulseSoft: 'pulseSoft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
