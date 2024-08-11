/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pink-20': '#F9E1E0',
        'pink-50': '#FEADB9',
        'pink-80': '#BC85A3',
        'purple-10': '#9799BA',
        'blue-50': '#BC85A3',
        'yellow-20': '#FFD66D',
      },
      backgroundImage: {
        'gradient-pinked': 'linear-gradient(90deg, #FDBCCF 0%, #F25EA3 100%)',
        'mobile-home': "url('./src/assets/bia.jpg')",
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
    },
    screens: {
      xs: '480px',
      sm: '768px',
      md: '1060px',
    },
  },
  plugins: [],
};
