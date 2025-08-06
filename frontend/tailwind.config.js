/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Inclui todos os arquivos do app
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'indigo-500': '#4f46e5',
        'emerald-500': '#10b981',
        'white': '#ffffff',
        'gray-500': '#6b7280',
        'gray-700': '#374151',
        'gray-800': '#1f2937',
        'green-100': '#d1fae5',
        'green-800': '#065f46',
        'red-500': '#ef4444',
      },
    },
  },
  plugins: [],
}