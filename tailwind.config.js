// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // Add more paths if needed
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',   // Replace with your desired color
        secondary: '#9333EA',
        accent: '#F59E0B',
      },
    },
  },
  plugins: [],
}
