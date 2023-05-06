/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
          'fjalla-one': ['Fjalla One', 'cursive'],
          'montserrat': ['Montserrat', 'sans-serif']
      }
    },
   
  },
  plugins: [],
}