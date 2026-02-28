import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        erik: {
          bg:      '#0a1628',
          surface: '#111f3a',
          accent:  '#C9A84C',
          text:    '#f5f0e8',
          muted:   '#a89b7a',
          border:  '#C9A84C',
          nav:     '#0d1e3a',
          card:    '#0f2040',
        },
        marisa: {
          bg:      '#fff0f4',
          surface: '#fff8fa',
          accent:  '#e8829a',
          text:    '#5c2d3a',
          muted:   '#c2849a',
          border:  '#e8829a',
          nav:     '#fff0f4',
          card:    '#fff5f8',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl:   '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in':  'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      aspectRatio: {
        card: '3 / 2',
      },
    },
  },
  plugins: [],
}

export default config
