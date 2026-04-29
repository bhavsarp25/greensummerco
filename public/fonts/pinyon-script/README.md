# Pinyon Script (brand / display)

Put **Pinyon Script** files from your Google Fonts zip in **this folder** (`public/fonts/pinyon-script/`).

## Required file name (easiest)

Rename your main **`.woff2`** file to:

`pinyon-script.woff2`

If you only have **`.ttf`**, rename it to:

`pinyon-script.ttf`

The CSS in `src/index.css` loads `pinyon-script.woff2` first, then falls back to `pinyon-script.ttf`.

After adding files, run the site — the wordmark, welcome line, selected headings, etc. use this face via the Tailwind class `font-brand`.
