# Animated wallpaper — drop-in folder

This folder is served verbatim by Vite at `/wallpaper/...`. To use your
animated HTML wallpaper as the landing-page background:

## Single-file wallpaper

If your wallpaper is a single self-contained `.html` file (CSS and JS
inlined, or referenced via CDNs), save it as:

```
public/wallpaper/index.html
```

That's all. The landing page mounts it as a full-bleed `<iframe>` and
the existing 3D logo + scroll chevron sit on top.

## Multi-file wallpaper

If your wallpaper is a folder (e.g. `index.html` plus local CSS / JS /
image / video assets), drop **the entire folder contents** into
`public/wallpaper/` so the relative paths inside `index.html` resolve.
Final shape:

```
public/wallpaper/
  index.html
  style.css       (or whatever sub-files it references)
  script.js
  textures/leaf.png
  ...
```

Important:

- The entry point **must** be named `index.html`.
- Internal references in your HTML must be **relative**
  (e.g. `<link href="style.css">`, **not** `<link href="/style.css">`).
  If they use absolute paths, change them to relative ones, or rename
  every absolute reference to start with `/wallpaper/...`.

## How to upload from GitHub

1. Open https://github.com/bhavsarp25/greensummerco/tree/main/public/wallpaper
   (or the active feature branch under `cursor/...`).
2. Click **Add file → Upload files**.
3. Drag in `index.html` (and any sub-files if your wallpaper is multi-file).
4. Commit.
5. Refresh the live preview. The wallpaper now plays behind the logo.

## Static image fallback

The static-image background workflow (PNG/JPG/WebP at
`/images/background.{webp,jpg,png}`) still works. The wallpaper takes
priority: if `/wallpaper/index.html` exists, the iframe renders; if not,
the page falls back to the static image, and finally to the cream
gradient.

## Iframe sandboxing & cursor passthrough

The iframe is configured so:

- **Pointer events pass through it.** The cursor-tracking 3D logo and
  the scroll-down chevron continue to receive mouse events normally.
  Your wallpaper still animates because it's animation-driven, not
  interaction-driven. If your wallpaper *needs* mouse input (e.g.
  parallax-on-mousemove inside the iframe), tell me and I'll switch
  pointer events back on for it.
- **Scrolling is forwarded to the parent page.** Wheel events inside
  the iframe scroll the main site, so the user never gets "stuck" on
  the wallpaper.
- **The iframe is sandboxed** — no top-level navigation, no popups,
  no parent-page access. Safe to drop in third-party HTML.

## Performance tips

- Animated wallpapers render every frame. Keep frame work cheap:
  prefer CSS transforms / opacity, `will-change`, and short loops over
  per-frame layout thrash.
- If the page feels sluggish on lower-end devices once the wallpaper
  is in, ping me and I'll add a `prefers-reduced-motion` short-circuit
  that swaps in a static screenshot of the first frame.
