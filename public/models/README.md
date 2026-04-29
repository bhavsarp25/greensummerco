# Hero 3D logo — drop-in folder

This folder is served verbatim by Vite at `/models/...`. To replace the
hero placeholder logo with your own 3D model:

## Preferred: glTF "Separate" export (with sidecar textures)

If your DCC tool / exporter supports baking and embedding textures, use
**`.glb`** (single file, easiest). If it does **not** allow embedding
textures, export in **"glTF Separate"** mode instead — that produces a
folder of files which all need to live here together:

```
public/models/
  logo.gltf            <- JSON manifest (must be named exactly logo.gltf)
  logo.bin             <- geometry / animation buffer
  logo_baseColor.png   <- albedo / color map
  logo_normal.png      <- normal map (optional)
  logo_metallicRoughness.png
  ...                  <- any other textures referenced by logo.gltf
```

Upload all of those files to GitHub at the same time (drag the entire
folder contents into the GitHub upload box). The filenames of the
sidecar files don't matter — they're referenced by `logo.gltf` itself.
What matters is that they all live next to `logo.gltf`.

## Single-file fallback

A textureless or self-contained `.glb` is also accepted at:

```
public/models/logo.glb
```

The component prefers `logo.gltf` if both are present, since the JSON
manifest is what carries the texture references.

## How the component picks the model

`<InteractiveLogo>` (in `src/components/interactive-logo.tsx`) tries:

1. `/models/logo.gltf`
2. `/models/logo.glb`
3. fallback to the gradient-circle placeholder if neither exists

A real model only mounts the 3D canvas if the response Content-Type is
model-shaped (Vite's dev server falls back to `text/html` for unknown
paths, which would otherwise produce a false positive).

## Optional `<InteractiveLogo>` props

```tsx
<InteractiveLogo
  src="/models/logo.gltf"     // override path
  scale={1}                   // multiplier (camera auto-fits anyway)
  autoRotate={true}
  autoRotateSpeed={0.6}
  enableZoom={false}

  // Material override behaviour:
  //  'auto'  -> only replace materials that have NO textures (default)
  //  'never' -> use the GLTF's materials exactly as exported
  //  'always'-> replace every material with `tint` (debug)
  override="auto"
  tint="#688952"      // brand green; used when override applies
  roughness={0.45}    // 0 = mirror, 1 = matte
  metalness={0.1}     // 0 = painted, 1 = metal
/>
```

Once your textured GLTF is in place and looking right, switch to
`override="never"` so the component doesn't second-guess your textures.

## Tips

- Keep total asset size under **~5 MB** for snappy first paint.
  `gltf-transform optimize` or [gltf.report](https://gltf.report) shrink
  models a lot — they can quantise meshes, resize textures, drop unused
  data, etc.
- The camera auto-fits via `<Bounds>`, so model scale in your DCC tool
  doesn't matter.
- Embedded animation clips auto-play. If there are none, the model gets
  a gentle vertical bob so it never looks completely static.
- If your material is **procedural / node-based** (Blender shader nodes,
  Verge3D node materials, etc.) GLTF can't represent those — bake them
  to image textures before export.
