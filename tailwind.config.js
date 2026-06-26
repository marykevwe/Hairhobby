/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f5',
          100: '#ffe4ec',
          200: '#fecddc',
          300: '#fda4bd',
          400: '#fb6f98',
          500: '#f43f7f',
          600: '#e11d69',
          700: '#be185d',
          800: '#9f174f',
          900: '#831843'
        },
        ink: {
          900: '#1c1320',
          800: '#2a1d2c'
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 45px rgba(15, 23, 42, 0.08)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    },
  },
  plugins: [],
}
