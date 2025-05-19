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
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};