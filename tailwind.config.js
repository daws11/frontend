/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: '#0D92F4',
        'light-blue': '#77CDFF',
        'light-red': '#F95454',
        red: '#C62E2E',
        white: '#d5dfed',
      },
    },
  },
  plugins: [],
}