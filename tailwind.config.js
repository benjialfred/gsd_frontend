/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary) / <alpha-value>)',
        gold: 'hsl(var(--gold) / <alpha-value>)',
        ivory: 'hsl(var(--ivory) / <alpha-value>)',
        dark: 'hsl(var(--dark) / <alpha-value>)',
        success: 'hsl(var(--success) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
        error: 'hsl(var(--error) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        // Retain legacy variables as fallbacks if needed
        gsd: {
          blue: {
            DEFAULT: '#1A3A5C',
            dark: '#0F172A',
          },
          gold: {
            DEFAULT: '#C9A84C',
            light: '#ebd18b',
          },
          red: '#DC2626',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        slowPan: {
          '0%, 100%': { transform: 'scale(1.05) translate(0px, 0px)' },
          '50%': { transform: 'scale(1.1) translate(-1%, -1%)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      animation: {
        slowPan: 'slowPan 30s ease-in-out infinite',
        'gradient-x': 'gradient-x 4s ease infinite',
      },
    },
  },
  plugins: [],
}
