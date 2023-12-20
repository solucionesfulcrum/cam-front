/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js" 
  ],
  theme: {
    extend: {
      colors:{
        //success: colors.green,
        //primary: colors.blue,
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
    // require('@tailwindcss/forms'),
    require('flowbite/plugin')
  ],
}
