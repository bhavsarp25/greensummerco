# Self-hosted fonts (`public/fonts/`)

Files here are served at **`/fonts/…`** in both dev and production (Vite copies `public/` to the build output).

## 1. Add your font files

1. Unzip the Google Fonts archive on your computer.
2. Copy the files you need into **`public/fonts/`** in this repo.
   - Prefer **`.woff2`**. If the zip only has **`.ttf`**, use that in `url()` with `format('truetype')`.
3. Use **simple filenames** (no spaces), e.g. `playfair-display-regular.woff2`.

Google Fonts are generally safe to ship; check the license in the zip if you use fonts elsewhere.

## 2. Register in `src/index.css`

Uncomment/edit the `@font-face` block in `src/index.css`:

- **`font-family`**: must match what Tailwind uses — by default **`SiteDisplay`** (or change both `index.css` and `tailwind.config.js`).
- **`url('/fonts/your-file.woff2')`**: must match the **exact** filename in this folder.
- Add **one `@font-face` per weight** you need (400, 600, 700, italic, etc.).

## 3. Use only on some elements

Body text stays on the **system** stack. Add **`font-display`** only where you want your custom font:

```tsx
<h1 className="font-display text-4xl">Headline only</h1>
<p>Paragraphs stay default sans — no class needed.</p>
```

To target another token (e.g. `font-brand`), add a second entry under `theme.extend.fontFamily` in `tailwind.config.js` and a matching `@font-face` name.

## Alternative: Google CDN

Instead of a zip, you can add a `<link>` for Google Fonts in `index.html` and point a Tailwind `fontFamily` key at that family name — still opt-in with a class on specific components.
