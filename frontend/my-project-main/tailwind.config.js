/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['"Cairo"', 'sans-serif'],
      } ,
       colors: {
        primary: '#4682B4',
        secondary: '#002147',
        tertiary: '#E5F5F9',
         black: '#434343',
         babyBlue: '#E5F5F9',
           yallow: '#F4BE40'

      },
      spacing: {
        '1': '0.25rem',   // 4px
        '2': '0.5rem',    // 8px
        '3': '0.75rem',   // 12px
        '4': '1rem',      // 16px
        '5': '1.25rem',   // 20px
        '6': '1.5rem',    // 24px
        '8': '2rem',      // 32px
        '10': '2.5rem',   // 40px
        '12': '3rem',     // 48px
      },
    },
  },
  plugins: [],
}