/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#E6F5E6',
          100: '#C2E0C2',
          200: '#9FCF9F',
          300: '#7BBE7B',
          400: '#58AD58',
          500: '#349C34', // Primary brand color
          600: '#2A882A',
          700: '#1F731F',
          800: '#155F15',
          900: '#0A4A0A',
          950: '#053505',
        },
        dark: {
          50: '#F2F2F3',
          100: '#E5E5E7',
          200: '#CCCCD0',
          300: '#B2B2B8',
          400: '#9999A1',
          500: '#7F7F8A',
          600: '#666673',
          700: '#4D4D59',
          800: '#333340',
          900: '#1A1A26',
          950: '#0D0D13', // Neutral dark shade (near black)
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Montserrat"', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px 2px rgba(52, 156, 52, 0.3)',
        'inner-glow': 'inset 0 0 15px 2px rgba(52, 156, 52, 0.2)',
      },
      backgroundImage: {
        'forest-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544v2.828L26.272 32l-1.414 1.414-28-28V0h3.428zM60 0v3.428L31.7 31.7l-1.414-1.414L57.172 3.414 60 0zM30 2.828l28 28V0h-4l-24 24V0h-4l24 24zM2.544 60L0 57.456v-2.828L29.272 25.27l1.414 1.414L2.544 60zM60 57.456L32.414 29.87l1.414-1.414L60 54.628v2.828zM62.544 0h-2.827L30 29.72V34h4.343L62.544 5.8V0zM0 5.8L28.2 34h4.346L0 2.536 0 5.8z\' fill=\'%2349bc49\' fill-opacity=\'0.04\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
      },
      animation: {
        'pulse-slow': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};