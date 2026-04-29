/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"DM Sans"',
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
        display: [
          '"Instrument Serif"',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'Times',
          'serif',
        ],
      },
      fontSize: {
        /** Comfortable editorial display scale for hero lines */
        'display-sm': ['2.75rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-md': ['3.5rem', { lineHeight: '1.04', letterSpacing: '-0.025em' }],
        'display-lg': ['4.5rem', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-xl': ['5.5rem', { lineHeight: '1.01', letterSpacing: '-0.03em' }],
      },
    },
  },
  plugins: [],
};
