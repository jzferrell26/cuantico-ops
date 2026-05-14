/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#0a0a0b',
        surface: '#111114',
        surface2: '#18181d',
        border: '#222228',
        accent: '#f0a500',
        accent2: '#e05c2a',
        'c-green': '#2dca73',
        'c-blue': '#4a9eff',
        'c-purple': '#9b6dff',
        'c-red': '#ff4a6e',
        muted: '#5a5a6a',
      },
    },
  },
  plugins: [],
}
