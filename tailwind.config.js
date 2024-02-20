/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors:{
        success: {
          50:"#e2f6ff",
          100: '#b4e8ff',
          200: '#83d9ff',
          300: '#50c9ff',
          400: '#28bdff',
          500: '#02b1ff',
          600: '#04a2f1',
          700: '#058fdd',
          800: '#057ec9',
          900: '#055da7',
        },
        primary: {
          50: '#e1f7f6',
          100: '#b6ece9',
          200: '#8ae0dc',
          300: '#60d2d1',
          400: '#48c8c9',
          500: '#3abfc3',
          600: '#37aeb1',
          700: '#008BD2',
          //700: '#339999',          
          800: '#2f8583',
          900: '#28615b',
        },
      },
      container:{
        screens:{
          sm:'640px',
          md:'768px',
          lg:'1024px',
          xl:'1024px',
          '2x1': '1536px',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
