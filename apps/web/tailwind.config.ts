import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#12121a',
        card: '#1a1a26',
        border: '#2a2a3d',
        primary: {
          DEFAULT: '#00e676',
          dark: '#00c853',
          glow: 'rgba(0, 230, 118, 0.3)',
        },
        accent: {
          DEFAULT: '#7c4dff',
          glow: 'rgba(124, 77, 255, 0.3)',
        },
        danger: '#ff5252',
        warning: '#ffab00',
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      animation: {
        'pulse-odds': 'pulse-odds 0.5s ease-in-out',
        'ticker': 'ticker 30s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-odds': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)', color: '#00e676' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0,230,118,0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0,230,118,0.4)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
