# Self-hosted fonts (bundled by Vite)

Put font files **here** (not under `public/`) so URLs work on GitHub Pages (`/greensummerco/…`).

- `pinyon-script/pinyon-script.ttf`
- `google-sans-flex/google-sans-flex.ttf`

`src/index.css` references these paths; Vite copies them into `dist` with the correct base prefix.
