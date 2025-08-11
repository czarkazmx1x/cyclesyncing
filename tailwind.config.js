/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for cycle phases
        menstrual: '#F87171',
        follicular: '#FBBF24',
        ovulatory: '#34D399',
        luteal: '#A78BFA',
      },
    },
  },
  plugins: [],
}