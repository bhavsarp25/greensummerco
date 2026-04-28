# Green Summer Collective

Marketing site for Green Summer Collective — a digital growth agency. Built from a Figma Sites design, scaffolded with Vite + React + TypeScript + Tailwind CSS.

## Stack

- **Vite** — dev server and build tool
- **React 18** + **TypeScript**
- **Tailwind CSS** — utility-first styling
- **lucide-react** — icons

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview
```

The static output goes to `dist/`.

## Project structure

```
src/
  App.tsx                       # main page (nav, hero, about, services, clients, contact)
  main.tsx                      # React entry point
  index.css                     # Tailwind directives + globals
  components/
    interactive-logo.tsx        # hero logo (placeholder — replace with real 3D logo)
    clients-section.tsx         # clickable client grid
    client-detail.tsx           # individual client case-study page
    client-data.ts              # client list (id, name, services, results)
```

## Notes

The `InteractiveLogo` component is a placeholder. The original Figma export referenced a 3D / interactive logo that wasn't included — drop that file in at `src/components/interactive-logo.tsx` (and add any deps like `three` / `@react-three/fiber` to `package.json`) when ready.

Brand colors live as inline Tailwind arbitrary values:
- Primary green: `#688952`
- Cream accent: `#D8CDB1`

## License

Proprietary — © 2026 Green Summer Collective.
