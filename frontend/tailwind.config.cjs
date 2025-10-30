/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ensure we scan HTML and all JS/JSX/TS/TSX files
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
  // Add any custom fonts/colors here if needed
  theme: {
    extend: {},
  },
  // Safelist classes that might be missed by the scanner (forces generation)
  safelist: [
    'bg-blue-700',
    'text-blue-700',
    'bg-green-600',
    'bg-yellow-500',
    'hover:bg-yellow-600',
    'hover:bg-blue-700',
    'text-gray-700',
    'text-gray-600',
    'text-white',
    'font-bold',
    'text-5xl',
    'text-xl'
  ],
  plugins: [],
}
