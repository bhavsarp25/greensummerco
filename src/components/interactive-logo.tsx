import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
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
  maxYawDeg = 50,
  maxPitchDeg = 15,
  followSpeed = 0.08,
  tint = '#688952',
  roughness = 0.45,
  metalness = 0.1,
  override = 'extruded',
  edgeColor = '#e8e8e8',
  edgeRoughness = 0.18,
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

  if (resolvedSrc === undefined) {
    return <PlaceholderLogo dim />;
  }

  if (resolvedSrc === null) {
    return <PlaceholderLogo />;
  }

  // Shared, mutable reference to the normalised cursor position
  // (-1 .. +1 on each axis, where (0,0) is the centre of the viewport).
  // Updated synchronously by a window-level pointermove listener so the
  // model tracks the user's cursor wherever it is on the page, not just
  // when it's hovering the canvas. A ref (not state) so we don't re-render
  // every frame.
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 6, 5]} intensity={1.0} />
        <directionalLight position={[-5, 2, 3]} intensity={0.55} />
        <directionalLight position={[0, -3, -4]} intensity={0.25} />

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
  );
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
function applyExtrudedMaterials(
  mesh: Mesh,
  paintMaterial: MeshStandardMaterial,
  edgeMaterial: MeshStandardMaterial,
  threshold: number,
) {
  const geometry = mesh.geometry as BufferGeometry;
  if (!geometry.attributes.position) return;

  // Bake any local transform into vertex positions so face normals are
  // computed in the same frame regardless of how the GLTF is parented.
  geometry.applyMatrix4(mesh.matrixWorld);
  mesh.matrix.identity();
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);
  mesh.scale.set(1, 1, 1);
  mesh.updateMatrix();

  if (!geometry.index) {
    geometry.setIndex(buildSequentialIndex(geometry.attributes.position.count));
  }
  geometry.computeVertexNormals();

  const index = geometry.index!;
  const indexArray = index.array as ArrayLike<number>;
  const triCount = indexArray.length / 3;

  const positions = geometry.attributes.position;
  const px = positions.array as ArrayLike<number>;

  // Find the dominant axis by inspecting the AABB. 3DLogoLab extrudes
  // along the shortest axis; classifying "is this triangle facing the
  // extrusion axis" generalises to any orientation the model arrived in.
  geometry.computeBoundingBox();
  const bb = geometry.boundingBox!;
  const span = {
    x: bb.max.x - bb.min.x,
    y: bb.max.y - bb.min.y,
    z: bb.max.z - bb.min.z,
  };
  const extrudeAxis: 0 | 1 | 2 =
    span.z <= span.x && span.z <= span.y ? 2 : span.y <= span.x ? 1 : 0;

  // Reorder indices so all "paint" triangles come first, then all "edge"
  // triangles — that way we can describe the split as two contiguous
  // material groups.
  const paintIdx: number[] = [];
  const edgeIdx: number[] = [];

  const ax = (i: number, k: number) => px[indexArray[i] * 3 + k];

  for (let t = 0; t < triCount; t++) {
    const i0 = t * 3;
    // Compute triangle normal via cross product of two edges.
    const ax0 = ax(i0, 0), ay0 = ax(i0, 1), az0 = ax(i0, 2);
    const ax1 = ax(i0 + 1, 0), ay1 = ax(i0 + 1, 1), az1 = ax(i0 + 1, 2);
    const ax2 = ax(i0 + 2, 0), ay2 = ax(i0 + 2, 1), az2 = ax(i0 + 2, 2);
    const ex1 = ax1 - ax0, ey1 = ay1 - ay0, ez1 = az1 - az0;
    const ex2 = ax2 - ax0, ey2 = ay2 - ay0, ez2 = az2 - az0;
    const nx = ey1 * ez2 - ez1 * ey2;
    const ny = ez1 * ex2 - ex1 * ez2;
    const nz = ex1 * ey2 - ey1 * ex2;
    const len = Math.hypot(nx, ny, nz) || 1;
    const axisComponent =
      extrudeAxis === 0 ? nx / len : extrudeAxis === 1 ? ny / len : nz / len;

    const arr = Math.abs(axisComponent) >= threshold ? paintIdx : edgeIdx;
    arr.push(indexArray[i0], indexArray[i0 + 1], indexArray[i0 + 2]);
  }

  const totalLen = paintIdx.length + edgeIdx.length;
  const useUint32 = totalLen > 65535 || (positions.count > 65535);
  const Ctor = useUint32 ? Uint32Array : Uint16Array;
  const merged = new Ctor(totalLen);
  for (let i = 0; i < paintIdx.length; i++) merged[i] = paintIdx[i];
  for (let i = 0; i < edgeIdx.length; i++) merged[paintIdx.length + i] = edgeIdx[i];

  geometry.setIndex(new BufferAttribute(merged, 1));

  geometry.clearGroups();
  geometry.addGroup(0, paintIdx.length, 0);
  geometry.addGroup(paintIdx.length, edgeIdx.length, 1);

  mesh.material = [paintMaterial, edgeMaterial];
}

function buildSequentialIndex(count: number) {
  const Ctor = count > 65535 ? Uint32Array : Uint16Array;
  const arr = new Ctor(count);
  for (let i = 0; i < count; i++) arr[i] = i;
  return new BufferAttribute(arr, 1);
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
