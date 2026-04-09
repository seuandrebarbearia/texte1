/** @type {import('tailwindcss').Config}  */
module.exports = {
  content:["./**/*.{html,js}"],
  theme:{
    fontFamily:{
      'sans':['poppis','sans-serif']
    },
    extend: {
      backgroundImage:{
        "home":"url('/assets/fotob.png')"
      }
    },
  },
  plugins:[],
}
