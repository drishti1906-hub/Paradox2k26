/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'paradox-black': '#050505',
        'paradox-dark': '#0d0d12',
        'paradox-purple': '#7c3aed',
        'paradox-purple-dark': '#4c1d95',
        'paradox-aqua': '#22d3ee',
        'paradox-lime': '#a3e635',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'neon-purple': '0 0 10px rgba(124, 58, 237, 0.7), 0 0 20px rgba(124, 58, 237, 0.5)',
        'neon-aqua': '0 0 10px rgba(34, 211, 238, 0.7), 0 0 20px rgba(34, 211, 238, 0.5)',
        'neon-lime': '0 0 10px rgba(163, 230, 53, 0.7), 0 0 20px rgba(163, 230, 53, 0.5)',
      },
      backgroundImage: {
        'space-gradient': 'radial-gradient(circle at center, #1e1b4b 0%, #050505 100%)',
      }
    },
  },
  plugins: [],
}
