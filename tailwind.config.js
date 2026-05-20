/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        dark: {
          bg: '#0f172a',
          element: '#1e293b',
          text: '#f0f4f8',
        },
        light: {
          bg: '#f5f7fa',
          element: '#e8ecf1',
          text: '#1a1a2e',
        },
      },
    },
  },
  plugins: [],
};
