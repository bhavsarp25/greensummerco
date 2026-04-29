# Google Sans Flex (site UI / body)

Put your **Google Sans Flex** font files from your zip in **this folder** (`public/fonts/google-sans-flex/`).

## Required file name (easiest)

Rename your variable or regular **`.woff2`** to:

`google-sans-flex.woff2`

If you only have **`.ttf`**:

`google-sans-flex.ttf`

`src/index.css` uses these paths for the global `body` font and Tailwind `font-sans`.

**Note:** If your download uses a long name (e.g. `GoogleSansFlex-VariableFont.woff2`), you can either rename it as above or edit the `url('/fonts/google-sans-flex/...')` lines in `src/index.css` to match your real filename.
