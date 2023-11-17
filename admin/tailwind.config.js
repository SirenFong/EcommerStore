/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5542F6',
        highlight: '#EaE8FB',
        bgGray: '#fbfafd',
      },
      width: {
        '400': '4rem',
      }
    },
  },
  plugins: [],
}

