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
        iaf: {
          dark: '#070b14',
          card: '#0f172a',
          surface: '#131e36',
          border: '#1e293b',
          accent: '#0284c7', // Sky Blue
          saffron: '#f97316',
          green: '#10b981',
          danger: '#ef4444',
          gold: '#eab308',
          cyan: '#06b6d4',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
