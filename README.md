# Green Summer Collective

Marketing site for Green Summer Collective — a digital growth agency.
Single-page React app with an interactive 3D logo, scroll-driven
animations, photographic side vines, and drop-in folders for swapping
brand assets without touching code.

Live (when GitHub Pages is configured — see Deployment): <https://bhavsarp25.github.io/greensummerco/>

---

## Stack

- **Vite 5** — dev server + build
- **React 18** + **TypeScript 5.6** (strict)
- **Tailwind CSS 3** — utility styling, brand colours `#557042` (green) and `#D8CDB1` (cream) used as inline arbitrary values
- **three.js** + **@react-three/fiber@8** + **@react-three/drei@9** — interactive 3D logo (R3F v8 / drei v9 are the React-18 compatible majors; do not upgrade past those without also upgrading React)
- **framer-motion 12** — scroll-driven animations
- **lucide-react** — icons
- **clsx** + **tailwind-merge** — `cn()` class-merge helper at `src/lib/utils.ts`

## Quick start

```bash
git clone https://github.com/bhavsarp25/greensummerco.git
cd greensummerco
npm install
VITE_BASE=/ npm run dev        # http://localhost:5173/
```

The dev server binds `0.0.0.0:5173` (so it's reachable from a LAN /
container / cloud agent), with a fixed port so URLs are stable across
restarts. Hot module reload is enabled.

> **Why `VITE_BASE=/`?** The default `base` in `vite.config.ts` is
> `/greensummerco/` because the production deploy target is the GitHub
> Pages project URL `bhavsarp25.github.io/greensummerco/`. In dev that
> would mean visiting `http://localhost:5173/greensummerco/` — fine if
> you remember, annoying if you don't. Setting `VITE_BASE=/` for the
> dev session puts the app back at the root URL. The build script
> doesn't pass it, so production builds keep the Pages base.

If you'd rather not type `VITE_BASE=/` every time, add it to a
`.env.local` (gitignored):

```
VITE_BASE=/
```

### Behind a tunnel (cloudflared / ngrok / Cursor port-forward)

```bash
cloudflared tunnel --url http://localhost:5173        # in one terminal
VITE_HMR_HOST=<the-tunnel-host>.trycloudflare.com npm run dev
```

`vite.config.ts` already accepts any host (`server.allowedHosts: true`)
and routes the HMR websocket to the public host when `VITE_HMR_HOST`
is set, so live reload works through the tunnel.

### Production build

```bash
npm run build        # tsc -b && vite build  ->  dist/
npm run preview      # serve dist/ on http://localhost:4173/
```

Build output goes to `dist/`. The `public/` folder is copied verbatim
into `dist/`, so anything dropped there ships as a static asset.

---

## Project structure

```
src/
  main.tsx                      React entry point
  App.tsx                       Page composition (sections, vines, menu)
  index.css                     Tailwind directives + bounce-slow keyframe + reduced-motion overrides
  lib/
    utils.ts                    cn() class-merge helper (clsx + tailwind-merge)
  components/
    interactive-logo.tsx        3D logo (R3F + drei). Loads /models/logo.gltf,
                                splits front/edge faces by normal for two-tone material,
                                follows the cursor with clamped yaw/pitch.
    logo-landing.tsx            Full-viewport landing section. Mounts the wallpaper
                                iframe, the static-image fallback, and the 3D logo
                                with a parallax-fade on scroll + scroll-down chevron.
    scroll-effects.tsx          ConvergingHeadline, GrowingVine (SVG + PhotoVine),
                                LeafCorners.
    reveal.tsx                  IntersectionObserver-driven fade-up wrapper used
                                on the about / services / clients / contact sections.
    liquid-glass-menu.tsx       Top-right glass pill + dropdown. Fades in past the
                                landing. Per-character flip-cascade on hover.
    clients-section.tsx         Grid of client cards.
    client-detail.tsx           Per-client case-study view.
    client-data.ts              Static array of 6 sample clients (replace with real ones).

public/
  models/      Drop-in 3D logo. /models/logo.gltf or .glb
  wallpaper/   Drop-in animated HTML background. /wallpaper/index.html
  images/      Drop-in static background. /images/background.{webp,jpg,jpeg,png}
  vines/       Drop-in photographic side vines. /vines/vine.{png,webp} (or per-side)
  leaves/      Drop-in foliage at the top corners of the GROW BOLDLY section.
               /leaves/top-{left,right}.{png,webp}

.github/workflows/
  deploy.yml   Builds the site on every push to main and publishes to GitHub Pages.

vite.config.ts                  base = '/greensummerco/' (override via VITE_BASE).
                                Dev server bound 0.0.0.0:5173, HMR tunnel-aware.
tailwind.config.js              Scans index.html + src/**.
tsconfig.json                   Strict, ES2020, JSX react-jsx, includes src/.
```

---

## Drop-in asset folders (the most useful thing about this repo)

Every customisable asset lives under `public/<folder>/` with a fixed
filename. Drop a new file in, refresh, done — no code changes. Each
folder has its own `README.md` documenting the workflow, supported
extensions, sizing, and behaviour. Summary:

| Folder | What | Filename | Falls back to |
|---|---|---|---|
| `public/models/` | Hero 3D logo | `logo.gltf` (preferred) or `logo.glb` | gradient-circle text placeholder |
| `public/wallpaper/` | Animated background on the landing | `index.html` (single-file or folder root) | static image (below) → cream gradient |
| `public/images/` | Static background image | `background.{webp,jpg,jpeg,png}` | cream gradient |
| `public/vines/` | Photo side vines | `vine.{png,webp}` (mirrored) or `vine-left.*` + `vine-right.*` | stylised SVG vines |
| `public/leaves/` | Top-corner foliage on the GROW BOLDLY section | `top-left.{png,webp}` and/or `top-right.{png,webp}` | nothing (just no foliage) |

Detection across all five folders uses the same pattern: HEAD request
+ inspect the `Content-Type` header (and for `wallpaper/`, also a
body-marker check) to discriminate real assets from Vite's
SPA-HTML fallback. False positives can't sneak through.

---

## Deployment

GitHub Pages, via the workflow at `.github/workflows/deploy.yml`. On
every push to `main` it runs `npm ci && npm run build` and publishes
`dist/` to the `github-pages` environment.

**One-time repo setting required:** Settings → Pages → **Build and
deployment → Source → GitHub Actions**. The repo currently has the
legacy "Deploy from a branch" source selected, which serves the raw
unbuilt source from `main` and produces a blank page. Once the source
is switched, the workflow takes over and the live site updates on
every push.

---

## Conventions

- **Brand colours.** Green `#557042`, cream `#D8CDB1`. Used as Tailwind
  arbitrary values (`text-[#557042]`, `bg-[#D8CDB1]/30`, etc.) — there
  is intentionally no Tailwind theme override, so search-and-replace
  works cleanly when the palette changes.
- **No mid-render hooks.** Components like `<InteractiveLogo>` keep all
  hooks unconditional and use early `return` for placeholders only at
  the bottom. Don't violate this — React 18 will unmount the subtree
  with "Rendered fewer hooks than expected" if you do.
- **Defensive 3D scene.** `<InteractiveLogo>` is wrapped in a
  `CanvasErrorBoundary` that falls back to the gradient-circle
  placeholder if anything in the WebGL pipeline throws. The page
  stays up no matter what happens to a model.
- **Accessibility.** `prefers-reduced-motion` overrides in
  `src/index.css` disable the chevron bounce, the parallax
  `will-change` transitions, and the converging-headline / vine
  animations.

---

## Common edits

| Want | Where to look |
|---|---|
| Change brand green | search-replace `#557042` across `src/**` |
| Change client list | `src/components/client-data.ts` |
| Change services tile copy | the `services` array in `src/App.tsx` |
| Change contact email / phone | `src/App.tsx` (search the section) |
| Change nav items / order | the `navItems` array in `src/App.tsx` |
| Tune logo cursor-follow range | `<InteractiveLogo maxYawDeg={…} maxPitchDeg={…} followSpeed={…} />` props |
| Tune vine timing | `<GrowingVine startSelector="…" endSelector="…" />` in `App.tsx` |

---

## License

Proprietary — © 2026 Green Summer Collective.
