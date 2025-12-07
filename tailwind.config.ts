import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm & Lovely Pastel Palette
        blush: {
          50: '#fff5f7',
          100: '#ffebef',
          200: '#ffd6df',
          300: '#ffb6c8',
          400: '#ff8fa8',
          500: '#ff6b8a',
          600: '#f43f6a',
          700: '#db2756',
          800: '#b52249',
          900: '#972141',
        },
        peach: {
          50: '#fff8f5',
          100: '#fff0eb',
          200: '#ffddd2',
          300: '#ffc4b0',
          400: '#ffa285',
          500: '#ff7f5c',
          600: '#f55d3a',
          700: '#db4525',
          800: '#b53b20',
          900: '#96341d',
        },
        cream: {
          50: '#fffdf9',
          100: '#fffbf5',
          200: '#fff5e6',
          300: '#ffecd1',
          400: '#ffe0b8',
          500: '#ffd49f',
          600: '#f5c078',
          700: '#dba454',
          800: '#b5873a',
          900: '#966e2a',
        },
        lavender: {
          50: '#faf7fc',
          100: '#f5eff9',
          200: '#ecdff4',
          300: '#dfc8ec',
          400: '#cca8df',
          500: '#b586cf',
          600: '#9a62b8',
          700: '#824e9a',
          800: '#6b427e',
          900: '#593867',
        },
        sage: {
          50: '#f6faf6',
          100: '#ecf5ed',
          200: '#d8eadb',
          300: '#b8d9bd',
          400: '#90c298',
          500: '#6aa876',
          600: '#528a5d',
          700: '#436f4b',
          800: '#385a3e',
          900: '#2f4a34',
        },
        // Glass colors - warm tinted
        glass: {
          white: 'rgba(255, 252, 250, 0.5)',
          light: 'rgba(255, 250, 247, 0.6)',
          medium: 'rgba(255, 248, 245, 0.7)',
          heavy: 'rgba(255, 253, 251, 0.85)',
          warm: 'rgba(255, 240, 235, 0.5)',
        },
      },
      fontFamily: {
        sans: ['var(--font-quicksand)', 'system-ui', 'sans-serif'],
        display: ['var(--font-quicksand)', 'system-ui', 'sans-serif'],
        handwriting: ['var(--font-caveat)', 'cursive'],
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(180, 140, 140, 0.12)',
        'glass-lg': '0 12px 48px rgba(180, 140, 140, 0.18)',
        'glass-inner': 'inset 0 1px 0 rgba(255, 255, 255, 0.4)',
        'polaroid': '0 4px 16px rgba(180, 140, 130, 0.15), 0 2px 6px rgba(0, 0, 0, 0.06)',
        'polaroid-hover': '0 16px 32px rgba(180, 140, 130, 0.2), 0 6px 12px rgba(0, 0, 0, 0.08)',
        'cute': '0 4px 14px rgba(255, 182, 193, 0.35)',
        'cute-lg': '0 8px 24px rgba(255, 182, 193, 0.4)',
        'glow': '0 0 20px rgba(255, 182, 193, 0.4)',
        'glow-peach': '0 0 20px rgba(255, 200, 180, 0.4)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 3s infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'heart-beat': 'heart-beat 0.4s ease-in-out',
        'gradient-shift': 'gradient-shift 12s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(0.5deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
        'bounce-soft': {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'heart-beat': {
          '0%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.15)' },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom, 0)',
        'safe-top': 'env(safe-area-inset-top, 0)',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [],
};

export default config;
