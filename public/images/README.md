# Images — drop-in folder

This folder is served verbatim by Vite at `/images/...`. To replace the
landing page's plain cream gradient with your own background, save your
image here as one of:

```
public/images/background.webp   <- preferred (smallest, modern, lossy or lossless)
public/images/background.jpg
public/images/background.jpeg
public/images/background.png
```

The first one that exists is used (in the order above), so a `.webp`
will win over a `.jpg` if both are present.

## How to upload

From GitHub:

1. Open https://github.com/bhavsarp25/greensummerco/tree/main/public/images
   (or the active feature branch under `cursor/...`).
2. **Add file → Upload files**.
3. Drag in your image.
4. Rename it to one of the supported names listed above before
   committing (or rename via a follow-up commit). Names are matched
   exactly.
5. Commit.

The hot-reloading dev server will pick it up on the next page load.

## Sizing & optimisation

The image fills the **landing viewport** at `center / cover`, so it gets
cropped to whatever shape the user's window is. Best results:

- **Aspect-agnostic content.** Important visual elements should sit
  near the centre — top/bottom edges may be cropped on tall screens,
  left/right edges may be cropped on wide screens.
- **Resolution.** ~2560 px wide is plenty for retina; 4K is overkill.
- **File size.** Keep under ~1 MB so first paint is fast. Convert PNG
  or JPG to WebP at quality 80 with [Squoosh](https://squoosh.app) —
  usually 5–10× smaller for the same perceived quality.
- **Brightness.** A subtle cream wash
  (`rgba(255,255,255,0.55) -> rgba(216,205,177,0.35)`) is layered on
  top by `<LogoLanding>` to keep the 3D logo readable. If your image
  is already light, the result will look slightly washed out — tell me
  and I'll dial that wash down.

## Want a different image per page?

This folder can hold any number of files. The convention is:

| Page | Path |
|---|---|
| Landing | `/images/background.{webp,jpg,...}` |
| Hero (Grow Boldly) | `/images/hero.{webp,jpg,...}` (not yet wired) |
| Section accents | `/images/<section>.{webp,jpg,...}` (not yet wired) |

Ask and I'll wire up additional candidates wherever you want.
