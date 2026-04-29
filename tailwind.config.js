/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        /**
         * Opt-in display font — use `className="font-display"` only on
         * elements that should use files from public/fonts/ (see index.css
         * @font-face). Everything else keeps the default system sans stack.
         */
        display: [
          'SiteDisplay',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'Times',
          'serif',
        ],
      },
    },
  },
  plugins: [],
};
