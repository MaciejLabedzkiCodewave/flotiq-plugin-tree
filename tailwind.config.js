/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: {
          DEFAULT: '#FFFFFF',
        },
        gray: {
          DEFAULT: '#EEEEF4',
          100: '#e9e9e9',
          150: '#5b6770',
          200: '#efefef',
          250: '#cdcdcd',
        },
        red: {
          DEFAULT: '#EB5757',
        },
        blue: {
          DEFAULT: '#d9e5f0',
          600: '#006676',
        },
      },
      transitionDuration: {
        fast: '200ms',
        normal: '300ms',
        slow: '1000ms',
      },
    },
  },
  plugins: [],
};
