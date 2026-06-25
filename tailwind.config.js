/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'royal-blue': '#0F172A',
        'jade': '#10B981',
        'danger': '#EF4444',
        'warning': '#F59E0B',
        'surface': '#F8FAFC',
        'surface-alt': '#F1F5F9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-jade': 'pulseJade 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseJade: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16,185,129,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(16,185,129,0)' },
        },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(15,23,42,0.08)',
        'card-hover': '0 8px 40px rgba(15,23,42,0.14)',
        'sidebar': '4px 0 24px rgba(15,23,42,0.18)',
        'jade-glow': '0 0 20px rgba(16,185,129,0.25)',
      },
    },
  },
  plugins: [],
};
