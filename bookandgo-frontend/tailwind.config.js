/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFFF00',
          dark: '#FFD700',
          light: '#FFDB58',
        },
        secondary: {
          DEFAULT: '#FFA500',
          dark: '#FF8C00',
        },
        accent: {
          yellow: '#FFFF00',
          gold: '#FFD700',
          mustard: '#FFDB58',
          orange: '#FFA500',
          darkOrange: '#FF8C00',
          white: '#FFFFFF',
          black: '#000000',
          gray: {
            100: '#F7FAFC',
            200: '#EDF2F7',
            300: '#E2E8F0',
            400: '#CBD5E0',
            500: '#A0AEC0',
            600: '#718096',
            700: '#4A5568',
            800: '#2D3748',
            900: '#1A202C',
          },
        },
      },
    },
    fontFamily: {
      sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
    },
  },
  plugins: [],
}