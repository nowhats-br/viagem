/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': '#6d28d9',
        'brand-yellow': '#facc15',
        'seat-free': '#84cc16',
        'seat-selected': '#f59e0b',
        'seat-occupied': '#d1d5db',
      }
    }
  },
  plugins: [],
};
