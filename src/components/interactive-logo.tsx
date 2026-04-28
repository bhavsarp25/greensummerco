import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Center,
  Environment,
  Html,
  OrbitControls,
  useAnimations,
  useGLTF,
} from '@react-three/drei';
import type { Group } from 'three';

interface InteractiveLogoProps {
  /**
   * URL(s) to a GLB/GLTF file, served from /public. The first one that
   * actually exists is used. Defaults probe `/models/logo.glb` then
   * `/models/logo.gltf`.
   */
  src?: string | string[];
  /** Uniform scale applied to the loaded model. */
  scale?: number;
  /** Spin the model on its Y axis. */
  autoRotate?: boolean;
  /** Speed of auto-rotation (drei units, ~1 = a few seconds per turn). */
  autoRotateSpeed?: number;
  /** Allow scroll-to-zoom interaction. */
  enableZoom?: boolean;
}

const DEFAULT_CANDIDATES = ['/models/logo.glb', '/models/logo.gltf'];

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
  autoRotate = true,
  autoRotateSpeed = 0.6,
  enableZoom = false,
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

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} />
        <directionalLight position={[-5, -2, -3]} intensity={0.4} />

        <Suspense fallback={<LoaderHtml />}>
          <Center>
            <Model src={resolvedSrc} scale={scale} />
          </Center>
          <Environment preset="studio" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={enableZoom}
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}

function Model({ src, scale }: { src: string; scale: number }) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(src);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    names.forEach((name) => {
      actions[name]?.reset().fadeIn(0.3).play();
    });
    return () => {
      names.forEach((name) => actions[name]?.fadeOut(0.3));
    };
  }, [actions, names]);

  // Gentle bobbing if there are no embedded animations.
  useFrame((state) => {
    if (!group.current || names.length > 0) return;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
  });

  return (
    <group ref={group} scale={scale}>
      <primitive object={scene} />
    </group>
  );
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

useGLTF.preload('/models/logo.glb');
