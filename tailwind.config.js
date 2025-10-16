/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#00529B',    // Um azul mais corporativo e moderno
        'brand-yellow': '#FFC72C', // Um amarelo vibrante
        'brand-green': '#00A86B',   // Um verde para sucesso e confirmação
        'seat-free': '#22c55e',      // Verde para livre
        'seat-selected': '#f59e0b',   // Amarelo para selecionado
        'seat-occupied': '#ef4444',   // Vermelho para ocupado
        'light-gray': '#f8f9fa',
        'dark-text': '#1a202c',
        'medium-text': '#4a5568',
      }
    }
  },
  plugins: [],
};
