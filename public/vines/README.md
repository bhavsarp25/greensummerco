# Vine images — drop-in folder

This folder is served by Vite at `/vines/...`. Drop a transparent PNG /
WebP of a vine here and it replaces the stylised SVG vines that
currently frame the page.

## Supported filenames

The component looks for these in order, and uses the first one that
exists:

```
public/vines/vine.png
public/vines/vine.webp
public/vines/ivy.png
public/vines/ivy.webp
```

If only one image is uploaded, the component renders it on the left
edge AND on the right edge (CSS-mirrored), so a single asset frames
both sides of the page. To use a different image per side, add:

```
public/vines/vine-left.png    public/vines/vine-right.png
public/vines/vine-left.webp   public/vines/vine-right.webp
```

When `vine-left.*` / `vine-right.*` are present they win over the
generic `vine.*` / `ivy.*`.

## How to upload from GitHub

1. Open
   https://github.com/bhavsarp25/greensummerco/tree/cursor/gltf-hero-logo-1c49/public/vines
2. **Add file → Upload files**.
3. Drop your PNG / WebP in.
4. **Rename** to one of the supported filenames above before committing
   (filenames are matched exactly).
5. Commit. The page picks it up on next load.

## Image requirements

- **Transparent background.** PNG (with alpha) or WebP. JPEG won't
  work — it has no alpha channel and would render as a solid block.
- **Tall, thin orientation.** The vine should grow top-to-bottom; the
  source image's height should be at least 2x its width. Roughly
  the proportions of the example image you sent (~750px wide × 1500px
  tall) are ideal.
- **Top-anchored.** The top of the image is treated as the start of
  the vine; growth animates downward from there as the user scrolls.
- **Resolution.** ~1500 - 2400 px tall is plenty. Larger just bloats
  page weight.
- **File size.** Aim for < 800 KB per image. Convert PNG to WebP at
  quality 80 via [Squoosh](https://squoosh.app) — usually 3 - 5x
  smaller for the same perceived quality.

## How the growth animation works

The image is rendered inside a wrapper whose height grows from 0% to
100% as the user scrolls past the GROW BOLDLY section through the rest
of the site. Internally that wrapper has `overflow: hidden`, the image
sits at full size inside it, so the visual is the vine progressively
revealing more of itself from top to bottom — exactly the same
"growing" feel as the SVG vine but with photographic foliage.

Once any image is uploaded, the previous SVG vines disappear
automatically.

## Falling back to the SVG vines

Delete the file (or remove this folder's contents) and the page
reverts to the stylised SVG vines defined in
`src/components/scroll-effects.tsx`. No code changes needed in either
direction.
