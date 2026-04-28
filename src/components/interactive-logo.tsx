import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Bounds,
  Center,
  Environment,
  Html,
  useAnimations,
  useGLTF,
} from '@react-three/drei';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  MathUtils,
  MeshStandardMaterial,
  type Group,
  type Mesh,
} from 'three';

interface InteractiveLogoProps {
  /**
   * URL(s) to a GLB/GLTF file, served from /public. The first one that
   * actually exists is used. Defaults probe `/models/logo.gltf` then
   * `/models/logo.glb`.
   */
  src?: string | string[];
  /** Uniform scale applied to the loaded model. */
  scale?: number;
  /**
   * Maximum left/right rotation in degrees as the cursor moves across the
   * page. The model lerps smoothly toward this; it never exceeds it.
   */
  maxYawDeg?: number;
  /**
   * Maximum up/down rotation in degrees as the cursor moves across the
   * page. Same clamping behaviour as `maxYawDeg`.
   */
  maxPitchDeg?: number;
  /**
   * 0..1 lerp factor per frame applied to rotation. Higher = snappier
   * tracking. Lower = smoother / more inertial.
   */
  followSpeed?: number;
  /**
   * Override the model's material color. Useful when the GLTF was exported
   * without textures (procedural / node-based shaders don't survive GLTF
   * export — the result is a white default material). Accepts any CSS
   * color string. Defaults to the brand green.
   */
  tint?: string;
  /** Roughness applied alongside `tint`. 0 = mirror, 1 = matte. */
  roughness?: number;
  /** Metalness applied alongside `tint`. 0 = plastic/painted, 1 = metal. */
  metalness?: number;
  /**
   * Material override behaviour:
   *  - 'auto' (default) — replace any textureless material with `tint`.
   *    Meshes that already carry textures keep them.
   *  - 'never' — don't touch the GLTF's materials. Use this once your
   *    GLTF is exported with real textures so the original look shows.
   *  - 'always' — replace every material with `tint`, even textured ones.
   *  - 'extruded' — split each mesh into two materials by face normal:
   *    front/back-facing triangles get `tint` (the painted face of the
   *    logo) and side-facing triangles get the chrome/metal material.
   *    Use this for extruded 2D logos like 3DLogoLab.
   */
  override?: 'auto' | 'never' | 'always' | 'extruded';
  /**
   * For override='extruded': color used on the side / extrusion edges.
   * Defaults to a polished chrome.
   */
  edgeColor?: string;
  /** For override='extruded': roughness of the side material. */
  edgeRoughness?: number;
  /** For override='extruded': metalness of the side material. */
  edgeMetalness?: number;
  /**
   * For override='extruded': dot-product threshold between the face
   * normal and ±Z. Faces with |n.z| above this are treated as front/back
   * (painted); below it as sides (chrome). 0.5 ~= 60° cone.
   */
  edgeAngleThreshold?: number;
}

// Prefer the .gltf manifest first: when textures are exported as sidecar
// files (the only option in some tools when "embed" is unavailable), the
// .gltf JSON references them by relative path and three.js will fetch
// them automatically. Fall back to the .glb if that's the only file
// present.
const DEFAULT_CANDIDATES = ['/models/logo.gltf', '/models/logo.glb'];

/**
 * Hero logo component.
 *
 * If a real GLTF/GLB is present in /public/models/, it is rendered with
 * react-three-fiber + drei (orbit controls, auto-rotate, animations).
 * Otherwise we fall back to the gradient-circle text placeholder, so the
 * page never breaks while the asset is being prepared.
 */
export function InteractiveLogo({
  src,
  scale = 1,
  maxYawDeg = 40,
  maxPitchDeg = 15,
  followSpeed = 0.08,
  tint = '#557042',
  roughness = 0.38,
  metalness = 0.08,
  override = 'extruded',
  edgeColor = '#f0f0f0',
  edgeRoughness = 0.16,
  edgeMetalness = 1.0,
  edgeAngleThreshold = 0.55,
}: InteractiveLogoProps) {
  const candidates = src ? (Array.isArray(src) ? src : [src]) : DEFAULT_CANDIDATES;
  const [resolvedSrc, setResolvedSrc] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    async function probe() {
      for (const url of candidates) {
        try {
          const res = await fetch(url, { method: 'HEAD', cache: 'no-cache' });
          if (!res.ok) continue;
          // Vite's dev server falls back to index.html (text/html) for any
          // path it doesn't recognise, so a 200 alone isn't proof. Only
          // accept binary / GLTF-ish content types.
          const ct = (res.headers.get('content-type') ?? '').toLowerCase();
          const looksLikeModel =
            ct.includes('model/') ||
            ct.includes('octet-stream') ||
            ct.includes('gltf') ||
            ct.includes('application/json');
          if (looksLikeModel) {
            if (!cancelled) setResolvedSrc(url);
            return;
          }
        } catch {
          // network/parse error -> keep trying the next candidate
        }
      }
      if (!cancelled) setResolvedSrc(null);
    }

    probe();
    return () => {
      cancelled = true;
    };
  }, [candidates.join('|')]);

  // NOTE: All hooks must run unconditionally on every render. Don't return
  // early above this point — moving any hook below a conditional return
  // produces "Rendered fewer hooks than expected" and crashes the page.
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  if (resolvedSrc === undefined) {
    return <PlaceholderLogo dim />;
  }

  if (resolvedSrc === null) {
    return <PlaceholderLogo />;
  }

  return (
    <CanvasErrorBoundary fallback={<PlaceholderLogo />}>
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[5, 6, 5]} intensity={1.4} />
        <directionalLight position={[-5, 2, 3]} intensity={0.85} />
        <directionalLight position={[0, -3, -4]} intensity={0.3} />

        <Suspense fallback={<LoaderHtml />}>
          {/* <Bounds> auto-fits the camera to whatever size the model is,
              so a 0.1-unit logo and a 20-unit logo both fill the frame. */}
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <Model
                src={resolvedSrc}
                scale={scale}
                tint={tint}
                roughness={roughness}
                metalness={metalness}
                override={override}
                edgeColor={edgeColor}
                edgeRoughness={edgeRoughness}
                edgeMetalness={edgeMetalness}
                edgeAngleThreshold={edgeAngleThreshold}
                pointerRef={pointerRef}
                maxYawDeg={maxYawDeg}
                maxPitchDeg={maxPitchDeg}
                followSpeed={followSpeed}
              />
            </Center>
          </Bounds>
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
    </CanvasErrorBoundary>
  );
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[InteractiveLogo] canvas error, falling back:', error, info);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function Model({
  src,
  scale,
  tint,
  roughness,
  metalness,
  override,
  edgeColor,
  edgeRoughness,
  edgeMetalness,
  edgeAngleThreshold,
  pointerRef,
  maxYawDeg,
  maxPitchDeg,
  followSpeed,
}: {
  src: string;
  scale: number;
  tint: string;
  roughness: number;
  metalness: number;
  override: 'auto' | 'never' | 'always' | 'extruded';
  edgeColor: string;
  edgeRoughness: number;
  edgeMetalness: number;
  edgeAngleThreshold: number;
  pointerRef: { current: { x: number; y: number } };
  maxYawDeg: number;
  maxPitchDeg: number;
  followSpeed: number;
}) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(src);
  const { actions, names } = useAnimations(animations, group);

  const paintMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(tint),
        roughness,
        metalness,
      }),
    [tint, roughness, metalness],
  );

  const edgeMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(edgeColor),
        roughness: edgeRoughness,
        metalness: edgeMetalness,
      }),
    [edgeColor, edgeRoughness, edgeMetalness],
  );

  useEffect(() => {
    if (override === 'never') return;
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;

      if (override === 'always') {
        mesh.material = paintMaterial;
        return;
      }

      if (override === 'extruded') {
        applyExtrudedMaterials(
          mesh,
          paintMaterial,
          edgeMaterial,
          edgeAngleThreshold,
        );
        return;
      }

      // 'auto'
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const allTextureless = mats.every((mat) => {
        const std = mat as MeshStandardMaterial;
        const hasMap = Boolean(
          std?.map ??
            std?.normalMap ??
            std?.roughnessMap ??
            std?.metalnessMap ??
            std?.emissiveMap,
        );
        return !hasMap;
      });
      if (allTextureless) {
        mesh.material = paintMaterial;
      }
    });
  }, [scene, paintMaterial, edgeMaterial, override, edgeAngleThreshold]);

  useEffect(() => {
    names.forEach((name) => {
      actions[name]?.reset().fadeIn(0.3).play();
    });
    return () => {
      names.forEach((name) => actions[name]?.fadeOut(0.3));
    };
  }, [actions, names]);

  // Cursor-follow rotation, clamped to (maxYawDeg, maxPitchDeg). The
  // pointer ref carries -1..+1 across the viewport, which we map to
  // ±maxDeg on each axis. Y is inverted so moving the cursor up tilts
  // the logo up (right-hand rotation around X).
  const maxYaw = MathUtils.degToRad(maxYawDeg);
  const maxPitch = MathUtils.degToRad(maxPitchDeg);
  useFrame(() => {
    if (!group.current) return;
    const px = MathUtils.clamp(pointerRef.current.x, -1, 1);
    const py = MathUtils.clamp(pointerRef.current.y, -1, 1);
    const targetYaw = px * maxYaw;
    const targetPitch = -py * maxPitch;
    group.current.rotation.y = MathUtils.lerp(
      group.current.rotation.y,
      targetYaw,
      followSpeed,
    );
    group.current.rotation.x = MathUtils.lerp(
      group.current.rotation.x,
      targetPitch,
      followSpeed,
    );
  });

  return (
    <group ref={group} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

/**
 * For an extruded 2D logo: walk the mesh's triangles, compute each face's
 * dominant normal axis, and split the geometry into two material groups
 * — front/back-facing triangles use the paint material, side-facing
 * triangles use the chrome/metal edge material.
 *
 * This works because logos coming out of 3DLogoLab (and most "extrude
 * the SVG along Z" pipelines) have very consistent face normals: ±Z for
 * the painted faces and roughly perpendicular to Z for the cut sides.
 *
 * The classification is per-triangle, so it survives whatever orientation
 * the model was exported in — we use the world-space normal averaged
 * across each triangle's three vertices.
 */
/**
 * Marker stashed on a geometry the first time we partition it, so that
 * StrictMode double-invocations and HMR re-runs reuse the same partition
 * instead of re-mutating the (cached, shared) geometry.
 */
type PartitionedGeometry = BufferGeometry & {
  __extrudedPartitioned?: { paintCount: number; edgeCount: number };
};

function applyExtrudedMaterials(
  mesh: Mesh,
  paintMaterial: MeshStandardMaterial,
  edgeMaterial: MeshStandardMaterial,
  threshold: number,
) {
  try {
    const geometry = mesh.geometry as PartitionedGeometry | undefined;
    if (!geometry || !geometry.attributes?.position) return;

    // useGLTF caches the parsed scene, so this geometry is shared across
    // re-renders (and across StrictMode double-invocations). Partition
    // the index buffer ONCE and remember it on the geometry itself; on
    // any subsequent run, just rebind the materials.
    const cached = geometry.__extrudedPartitioned;
    if (cached) {
      geometry.clearGroups();
      geometry.addGroup(0, cached.paintCount, 0);
      geometry.addGroup(cached.paintCount, cached.edgeCount, 1);
      mesh.material = [paintMaterial, edgeMaterial];
      return;
    }

    const positions = geometry.attributes.position;
    const px = positions.array as ArrayLike<number>;
    const vertexCount = positions.count;

    // Ensure an index buffer exists. Without one, "indexed triangles"
    // fall through to sequential indexing.
    if (!geometry.index) {
      const Ctor = vertexCount > 65535 ? Uint32Array : Uint16Array;
      const seq = new Ctor(vertexCount);
      for (let i = 0; i < vertexCount; i++) seq[i] = i;
      geometry.setIndex(new BufferAttribute(seq, 1));
    }

    const idx = geometry.index!.array as ArrayLike<number>;
    const triCount = (idx.length / 3) | 0;
    if (triCount === 0) return;

    geometry.computeBoundingBox();
    const bb = geometry.boundingBox!;
    const span = {
      x: bb.max.x - bb.min.x,
      y: bb.max.y - bb.min.y,
      z: bb.max.z - bb.min.z,
    };
    const extrudeAxis: 0 | 1 | 2 =
      span.z <= span.x && span.z <= span.y ? 2 : span.y <= span.x ? 1 : 0;

    const paintIdx: number[] = [];
    const edgeIdx: number[] = [];

    for (let t = 0; t < triCount; t++) {
      const i0 = t * 3;
      const a = idx[i0] * 3;
      const b = idx[i0 + 1] * 3;
      const c = idx[i0 + 2] * 3;
      const ex1 = px[b] - px[a];
      const ey1 = px[b + 1] - px[a + 1];
      const ez1 = px[b + 2] - px[a + 2];
      const ex2 = px[c] - px[a];
      const ey2 = px[c + 1] - px[a + 1];
      const ez2 = px[c + 2] - px[a + 2];
      const nx = ey1 * ez2 - ez1 * ey2;
      const ny = ez1 * ex2 - ex1 * ez2;
      const nz = ex1 * ey2 - ey1 * ex2;
      const len = Math.hypot(nx, ny, nz) || 1;
      const axisComp =
        extrudeAxis === 0 ? nx / len : extrudeAxis === 1 ? ny / len : nz / len;
      const target = Math.abs(axisComp) >= threshold ? paintIdx : edgeIdx;
      target.push(idx[i0], idx[i0 + 1], idx[i0 + 2]);
    }

    const totalLen = paintIdx.length + edgeIdx.length;
    const Ctor = vertexCount > 65535 ? Uint32Array : Uint16Array;
    const merged = new Ctor(totalLen);
    for (let i = 0; i < paintIdx.length; i++) merged[i] = paintIdx[i];
    for (let i = 0; i < edgeIdx.length; i++) {
      merged[paintIdx.length + i] = edgeIdx[i];
    }

    geometry.setIndex(new BufferAttribute(merged, 1));
    geometry.clearGroups();
    geometry.addGroup(0, paintIdx.length, 0);
    geometry.addGroup(paintIdx.length, edgeIdx.length, 1);
    geometry.__extrudedPartitioned = {
      paintCount: paintIdx.length,
      edgeCount: edgeIdx.length,
    };

    mesh.material = [paintMaterial, edgeMaterial];
  } catch (err) {
    // If anything goes sideways, fall back to a single-material render
    // so the page still loads instead of taking down the whole React
    // tree with a render error.
    console.error('[InteractiveLogo] extruded material split failed:', err);
    mesh.material = paintMaterial;
  }
}

function LoaderHtml() {
  return (
    <Html center>
      <div className="text-[#688952] text-sm tracking-widest opacity-70">
        LOADING…
      </div>
    </Html>
  );
}

function PlaceholderLogo({ dim = false }: { dim?: boolean }) {
  return (
    <div className={`w-full h-full flex items-center justify-center ${dim ? 'opacity-70' : ''}`}>
      <div className="relative">
        <div
          className="w-64 h-64 rounded-full bg-gradient-to-br from-[#688952] to-[#D8CDB1] shadow-2xl animate-pulse"
          style={{ animationDuration: '3s' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-2xl tracking-widest text-center px-4">
            GREEN
            <br />
            SUMMER
            <br />
            COLLECTIVE
          </div>
        </div>
      </div>
    </div>
  );
}

useGLTF.preload('/models/logo.gltf');
