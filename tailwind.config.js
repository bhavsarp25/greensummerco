/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Google Sans Flex"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        /** Pinyon Script — use only on specific headings/copy (see App + ConvergingHeadline). */
        brand: ['"Pinyon Script"', 'cursive'],
      },
    },
  },
  plugins: [],
};
