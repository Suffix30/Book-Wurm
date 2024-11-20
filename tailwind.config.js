/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cyber-cyan': '#66FCF1',
        'cyber-cyan-dark': '#45A29E',
        'cyber-black': '#0a0a0f',
      },
      fontFamily: {
        mono: ['"Courier New"', 'monospace']
      },
      boxShadow: {
        'cyber': '0 0 10px rgba(102, 252, 241, 0.2), inset 0 0 10px rgba(102, 252, 241, 0.1)',
        'cyber-lg': '0 0 20px rgba(102, 252, 241, 0.3), inset 0 0 20px rgba(102, 252, 241, 0.2)',
      }
    },
  },
  plugins: [],
};