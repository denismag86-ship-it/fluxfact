/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#09090b',
          elevated: '#18181b',
          card: '#1c1c1e',
          hover: '#27272a',
        },
        accent: {
          blue: '#007CF0',
          cyan: '#00DFD8',
          purple: '#7928CA',
          pink: '#FF0080',
          coral: '#FF6B6B',
          amber: '#FFD93D',
        },
        txt: {
          primary: '#f7f8f8',
          secondary: '#95a2b3',
          muted: '#52525b',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          hover: 'rgba(255,255,255,0.15)',
          accent: 'rgba(0,124,240,0.4)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      letterSpacing: {
        'display': '-0.04em',
        'heading': '-0.02em',
      },
      borderRadius: {
        'card': '16px',
        'pill': '9999px',
        'asymmetric': '52px 16px 16px 16px',
      },
      boxShadow: {
        'glow-blue': '0 0 60px -12px rgba(0,124,240,0.4)',
        'glow-purple': '0 0 60px -12px rgba(121,40,202,0.4)',
        'glow-cyan': '0 0 60px -12px rgba(0,223,216,0.3)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
        'input': '0 4px 16px rgba(0,0,0,0.3)',
        'result': '0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'count-up': 'count-up 0.5s cubic-bezier(0.4,0,0.2,1) forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s cubic-bezier(0.4,0,0.2,1) forwards',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'count-up': {
          from: { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
