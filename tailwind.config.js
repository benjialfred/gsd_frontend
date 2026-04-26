/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gsd: {
          blue: {
            DEFAULT: '#0b2b56',
            dark: '#071b36',
          },
          gold: {
            DEFAULT: '#dca54a',
            light: '#ebd18b',
          },
          red: '#c82a2a',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
