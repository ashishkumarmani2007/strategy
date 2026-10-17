/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vsBg: '#071226',
        vsNavy: '#0B1B3A',
        vsPanel: '#0E1F3F',
        vsPanelLight: '#132850',
        vsBlue: '#2D8CFF',
        vsCoral: '#FF6B5E',
        vsGreen: '#3DDC97',
        vsAmber: '#FFC14D',
        vsText: '#E8EEF8',
        vsMuted: '#9FB0CC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 1.5s linear infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
