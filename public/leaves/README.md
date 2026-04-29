# Decorative leaf images — drop-in folder

This folder is served verbatim by Vite at `/leaves/...`. Drop transparent
PNG leaf cutouts here and they get composited at the top corners of
the GROW BOLDLY section, with the SVG vines growing out from underneath
them as the user scrolls past.

## Supported filenames

The corner component looks for these paths in order, and uses the first
one that exists:

| Slot | Probed paths |
|---|---|
| Top-left | `/leaves/top-left.png`, `/leaves/top-left.webp`, `/leaves/leaves-left.png`, `/leaves/leaves-left.webp` |
| Top-right | `/leaves/top-right.png`, `/leaves/top-right.webp`, `/leaves/leaves-right.png`, `/leaves/leaves-right.webp` |

If you only upload one image, the component will mirror it to the other
side automatically — so a single `top-left.png` produces both the top-
left and (CSS-mirrored) top-right corner. Upload a separate image for
each side if you want them to differ.

## How to upload

1. Open
   https://github.com/bhavsarp25/greensummerco/tree/cursor/gltf-hero-logo-1c49/public/leaves
2. **Add file → Upload files**.
3. Drag in your leaf PNG(s).
4. **Rename** to one of the names in the table above before committing
   (filenames matter; transparent background is required).
5. Commit.

The hot-reloading dev server picks them up on the next page load — no
code changes required.

## Image requirements

- **Transparent background.** PNG (lossless) or WebP (smaller). JPEG
  has no alpha channel and will look like a rectangle of solid colour
  pasted on top.
- **Leaves should anchor to the top edge** of the image, like the two
  reference photos: stems / branches start at the top, leaves spill
  downward into the frame. The component crops to that anchor.
- **Aspect ratio.** Anything from 16:9 to 4:3 works. The image is sized
  to a fraction of the viewport (default 38% width on desktop), so
  finer detail in the original is preferved.
- **Resolution.** ~1200 - 1800 px wide is plenty. Anything larger will
  just bloat the page weight.
- **File size.** Keep each PNG under ~500 KB. Use Squoosh
  (https://squoosh.app) to convert to WebP at quality 80 — usually
  3 - 5x smaller for the same perceived quality.

## How the vines connect

Once a leaf image is in place, the SVG vines (defined in
`src/components/scroll-effects.tsx`) start from the bottom-inside edge
of each corner leaf and grow downward as the user scrolls past the
GROW BOLDLY section. Without a leaf image, the vines still grow from
the same anchor point — they just don't have visible foliage at the
top.
