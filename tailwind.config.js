/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#2563eb',
        'brand-yellow': '#facc15',
        'seat-free': '#84cc16',      // Verde para livre
        'seat-selected': '#f59e0b',   // Amarelo para selecionado
        'seat-occupied': '#ef4444',   // Vermelho para ocupado
      }
    }
  },
  plugins: [],
};
