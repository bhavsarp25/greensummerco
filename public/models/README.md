# Hero 3D logo — drop-in folder

This folder is served verbatim by Vite at `/models/...`. To replace the
hero placeholder logo with your own 3D model:

1. Export your model as **GLB** (single binary) or **GLTF** (json + assets).
   - `.glb` is preferred — one file, embedded textures, no broken paths.
2. Save it here as **`logo.glb`** (or `logo.gltf`):
   ```
   public/models/logo.glb
   ```
3. Commit & push. The hero will pick it up automatically — `<InteractiveLogo>`
   tries `/models/logo.glb`, falls back to `/models/logo.gltf`, and finally
   to the gradient-circle placeholder if neither exists.

## Optional tweaks

`<InteractiveLogo>` accepts props if you need to tune things:

```tsx
<InteractiveLogo
  src="/models/logo.glb"   // override path
  scale={1.2}              // bigger / smaller
  autoRotate={true}        // turntable
  autoRotateSpeed={1}
  enableZoom={false}       // disallow user zoom
/>
```

## Tips

- Keep the file under **~5 MB** so first paint stays fast. `gltf-transform optimize`
  or [gltf.report](https://gltf.report/) can shrink models a lot.
- Center the model on the origin in your DCC tool (Blender, etc.) — the camera
  is positioned assuming the model sits at (0, 0, 0).
- If the model looks too dark, it has no embedded lights — that's fine, the
  scene already adds ambient + directional light. Adjust your materials' base
  color / roughness in the source file rather than fighting the scene.
- Animations embedded in the GLTF are auto-played.
