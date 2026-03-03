/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Deep navy base — not generic #09090b
        bg: {
          DEFAULT: '#0A0E27',
          elevated: '#141B3C',
          card: '#1A2248',
          hover: '#1F2B55',
        },
        // Distinctive dual-accent: cyan + magenta
        accent: {
          cyan: '#00E5FF',
          magenta: '#FF006E',
          green: '#00FF88',
          amber: '#FFB700',
          // Legacy aliases for gradual migration
          blue: '#00E5FF',
          purple: '#8B5CF6',
          pink: '#FF006E',
        },
        txt: {
          primary: '#F0F5FF',
          secondary: '#A0B0D0',
          muted: '#5B6B8A',
        },
        border: {
          DEFAULT: '#1F2847',
          hover: '#2D3A66',
          accent: 'rgba(0,229,255,0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      letterSpacing: {
        'display': '-0.03em',
        'heading': '-0.02em',
      },
      borderRadius: {
        'card': '12px',
        'pill': '9999px',
      },
      boxShadow: {
        'glow-cyan': '0 0 40px -8px rgba(0,229,255,0.4)',
        'glow-magenta': '0 0 40px -8px rgba(255,0,110,0.4)',
        'glow-green': '0 0 40px -8px rgba(0,255,136,0.3)',
        'card': '0 2px 8px rgba(0,229,255,0.06)',
        'card-hover': '0 0 20px rgba(0,229,255,0.15)',
        'input': '0 2px 8px rgba(0,0,0,0.3)',
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s cubic-bezier(0.4,0,0.2,1) forwards',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'neon-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0,229,255,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0,229,255,0.6)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
