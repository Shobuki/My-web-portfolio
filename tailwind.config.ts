/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-red': '#ff5451',
        'primary': '#ffb3ad',
        'primary-black': '#150c0d',
        'secondary-black': '#281d1e',
        'surface-card': '#2c2c2c',
        'surface-high': '#332728',
        'surface-dim': '#1b1112',
        'outline': '#ad8885',
        'outline-variant': '#5d3f3d',
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
