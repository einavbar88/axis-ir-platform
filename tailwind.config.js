/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      main: '#3c4f9d',
      'main-mid': '#7581cf',
      'main-dark': '#364387',
      'main-dark-50': '#36438750',
      'main-darkest': '#0f1653',
      'main-light': '#6cc4ba',
      'main-lighter': '#d1e3ff',
      'main-lightest': '#e8f5fd',
      'main-light-green': '#F7FFE0',
      'main-white': '#faffff',
      error: '#b60000',
      white: 'white',
      transparent: 'transparent',
      green: 'green',
      red: 'red',
      amber: 'orange',
      'gray-800': '#424242e5',
    },
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
};
