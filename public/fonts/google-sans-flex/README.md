# Google Sans Flex (site UI / body)

Put your **Google Sans Flex** font files from your zip in **this folder** (`public/fonts/google-sans-flex/`).

## File name

The site expects:

`google-sans-flex.ttf`

`src/index.css` uses this path for the global `body` font and Tailwind `font-sans`.

For a smaller payload later, add `google-sans-flex.woff2` list `format('woff2')` **before** the `ttf` line in `src/index.css`.
