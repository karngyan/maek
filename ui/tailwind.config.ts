import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config: Config = {
  darkMode: ['selector'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: colors.teal[50],
          100: colors.teal[100],
          200: colors.teal[200],
          300: colors.teal[300],
          400: colors.teal[400],
          500: colors.teal[500],
          600: colors.teal[600],
          700: colors.teal[700],
          800: colors.teal[800],
          900: colors.teal[900],
          950: colors.teal[950],
        },
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-animate')],
}

export default config
