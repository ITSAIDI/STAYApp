// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{jsx}', 
    './components/**/*.{jsx}',
  ],
  theme: {
    extend: {
      colors: {
        green1: '#13452D',
        green2: '#227E51',
      },
      screens: {
        'xl': '1440px',    // Super large screens
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    
  ],
};
