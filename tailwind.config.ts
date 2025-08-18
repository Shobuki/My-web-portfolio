/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-red': '#e92932',
        'primary-black': '#110809',
        'secondary-black': '#2c2c2c',
        'text-primary': '#f2f2f2',
        'text-secondary': '#e0b4b6',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        raleway: ['var(--font-raleway)', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
