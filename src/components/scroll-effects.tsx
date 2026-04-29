import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * --------------------------------------------------------------------------
 * ConvergingHeadline
 * --------------------------------------------------------------------------
 * Inspired by Skiper31's character-convergence pattern:
 * each character starts spread out (translated horizontally + skewed in
 * 3D) and converges into the final headline as the user scrolls.
 *
 * Re-themed for Green Summer Collective: green-on-cream palette, a
 * leading green line + label above the headline (the "tendril coming
 * in from the side" motif), and per-line / per-color spans so we can
 * keep the brand split between "GROW BOLDLY." (green) and
 * "THRIVE DIGITALLY." (charcoal).
 *
 * The animation uses the section's own scroll progress, so it fires
 * exactly when the section enters the viewport — no fixed-pixel scroll
 * thresholds, works at every viewport height.
 */
interface ConvergingHeadlineProps {
  /** Lines of the headline. Use { text, color: 'primary' | 'secondary' }. */
  lines: { text: string; color?: 'primary' | 'secondary' }[];
  /** Eyebrow text shown above the headline (small uppercase). */
  eyebrow?: string;
  /** Long-form supporting paragraph below the headline. */
  subtitle?: string;
  /** Optional CTA. */
  cta?: { label: string; onClick: () => void };
  /** Anchor id assigned to the section. */
  id?: string;
}

export function ConvergingHeadline({
  lines,
  eyebrow,
  subtitle,
  cta,
  id,
}: ConvergingHeadlineProps) {
  const ref = useRef<HTMLElement | null>(null);

  // Track scroll progress of THIS section relative to the viewport.
  // 'start end' = section's top hits viewport bottom (entry).
  // 'end start' = section's bottom passes viewport top (exit).
  // We treat 0..0.5 as the "enter" phase where the convergence happens.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Eyebrow + the leading line draw in just a moment ahead of the chars.
  const eyebrowOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const eyebrowY = useTransform(scrollYProgress, [0.15, 0.3], [10, 0]);
  const tendrilScale = useTransform(scrollYProgress, [0.18, 0.42], [0, 1]);

  const subtitleOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const subtitleY = useTransform(scrollYProgress, [0.45, 0.6], [16, 0]);

  const ctaOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.55, 0.7], [16, 0]);

  return (
    <section
      ref={ref}
      id={id}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-[#D8CDB1]/20 via-white to-white overflow-hidden"
    >
      {eyebrow && (
        <motion.div
          className="flex items-center gap-3 mb-8 text-[#557042]"
          style={{ opacity: eyebrowOpacity, y: eyebrowY }}
        >
          <motion.span
            className="block h-px bg-[#557042] origin-left"
            style={{ width: 64, scaleX: tendrilScale }}
          />
          <span className="text-xs tracking-[0.3em] uppercase">{eyebrow}</span>
          <motion.span
            className="block h-px bg-[#557042] origin-right"
            style={{ width: 64, scaleX: tendrilScale }}
          />
        </motion.div>
      )}

      <h1
        className="text-5xl md:text-7xl lg:text-8xl text-center leading-[1.02] tracking-tight"
        style={{ perspective: '600px' }}
      >
        {lines.map((line, lineIdx) => {
          const chars = line.text.split('');
          const center = (chars.length - 1) / 2;
          const colorClass =
            line.color === 'secondary' ? 'text-gray-800' : 'text-[#557042]';
          return (
            <span key={lineIdx} className={`block ${colorClass}`}>
              {chars.map((c, i) => (
                <ConvergingChar
                  key={`${lineIdx}-${i}`}
                  ch={c}
                  distanceFromCenter={i - center}
                  scrollYProgress={scrollYProgress}
                  lineDelayPx={lineIdx * 8}
                />
              ))}
            </span>
          );
        })}
      </h1>

      {subtitle && (
        <motion.p
          className="text-gray-600 text-center max-w-2xl text-lg md:text-xl mt-8"
          style={{ opacity: subtitleOpacity, y: subtitleY }}
        >
          {subtitle}
        </motion.p>
      )}

      {cta && (
        <motion.button
          onClick={cta.onClick}
          className="mt-10 px-10 py-4 bg-[#557042] text-white rounded-full hover:bg-[#557042]/90 transition-colors text-lg shadow-md hover:shadow-lg"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          {cta.label}
        </motion.button>
      )}
    </section>
  );
}

interface ConvergingCharProps {
  ch: string;
  distanceFromCenter: number;
  scrollYProgress: MotionValue<number>;
  lineDelayPx: number;
}

function ConvergingChar({
  ch,
  distanceFromCenter,
  scrollYProgress,
  lineDelayPx,
}: ConvergingCharProps) {
  const isSpace = ch === ' ';

  // Each character starts displaced horizontally proportional to its
  // distance from the centre of the line, plus a slight upward offset
  // and a subtle 3D tilt; converges by the time scroll hits 0.5.
  const x = useTransform(
    scrollYProgress,
    [0.2, 0.5],
    [distanceFromCenter * 60, 0],
  );
  const y = useTransform(
    scrollYProgress,
    [0.2, 0.5],
    [Math.abs(distanceFromCenter) * 12 + lineDelayPx, 0],
  );
  const rotateX = useTransform(
    scrollYProgress,
    [0.2, 0.5],
    [distanceFromCenter * 18, 0],
  );
  const opacity = useTransform(scrollYProgress, [0.2, 0.45], [0, 1]);

  return (
    <motion.span
      className="inline-block"
      style={{
        x,
        y,
        rotateX,
        opacity,
        width: isSpace ? '0.35em' : undefined,
      }}
    >
      {isSpace ? '\u00A0' : ch}
    </motion.span>
  );
}

/**
 * --------------------------------------------------------------------------
 * GrowingVine
 * --------------------------------------------------------------------------
 * Inspired by Skiper19's stroke-progress technique: an SVG path's
 * stroke is drawn from 0% to 100% as the user scrolls.
 *
 * Re-themed for Green Summer Collective: instead of a generic curl,
 * the path is a hand-tuned organic vine tendril that meanders down the
 * left edge of the page, with a few small leaf accents that fade in
 * along the way. Sits in a fixed-position layer over the page so it
 * appears to "grow" between sections as the user scrolls.
 */
interface GrowingVineProps {
  /**
   * 0..1 cutoff in document scroll: the vine starts drawing when
   * progress passes `start` and is fully drawn at `end`. Ignored
   * when `startSelector` / `endSelector` are provided.
   */
  start?: number;
  end?: number;
  /**
   * CSS selector for the element whose top, when crossing the top of
   * the viewport, marks the start of the vine animation. e.g. '#hero'.
   * Falls back to the numeric `start` if the element can't be found.
   */
  startSelector?: string;
  /**
   * CSS selector for the element whose bottom, when crossing the
   * bottom of the viewport, marks 100% drawn. e.g. '#contact'.
   * Falls back to the numeric `end` if the element can't be found.
   */
  endSelector?: string;
  /**
   * Render the vine on a single side or mirrored on both sides
   * (default). 'mirror' produces a left + right pair so the page is
   * framed symmetrically.
   */
  side?: 'left' | 'right' | 'mirror';
  /** Stroke colour. */
  color?: string;
  /** Stroke width of the main vine. */
  strokeWidth?: number;
}

/**
 * Decorative vine that draws itself along the side(s) of the viewport
 * as the user scrolls. When side='mirror' (the default), the vine is
 * rendered twice — once on the left, once on the right with horizontal
 * symmetry — framing the page with leafy growth.
 */
export function GrowingVine({
  start = 0,
  end = 0.5,
  startSelector,
  endSelector,
  side = 'mirror',
  color = '#557042',
  strokeWidth = 3,
}: GrowingVineProps) {
  // Compute start/end as fractions of document scroll height by
  // looking up the selector elements' offsets. Recomputed on resize
  // since layout-driven values change with viewport size.
  const [range, setRange] = useState<{ start: number; end: number }>({
    start,
    end,
  });

  useEffect(() => {
    if (!startSelector && !endSelector) {
      setRange({ start, end });
      return;
    }
    function recompute() {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setRange({ start, end });
        return;
      }
      let s = start;
      let e = end;
      if (startSelector) {
        const el = document.querySelector(startSelector) as HTMLElement | null;
        if (el) s = el.offsetTop / docHeight;
      }
      if (endSelector) {
        const el = document.querySelector(endSelector) as HTMLElement | null;
        if (el) {
          // 100% drawn when the bottom of the end element has scrolled
          // past the top of the viewport.
          e = (el.offsetTop + el.offsetHeight - window.innerHeight) / docHeight;
        }
      }
      // Sanity: clamp and keep at least a 0.05 gap between start/end.
      s = Math.max(0, Math.min(0.95, s));
      e = Math.max(s + 0.05, Math.min(1, e));
      setRange({ start: s, end: e });
    }
    recompute();
    window.addEventListener('resize', recompute, { passive: true });
    // Layout settles after fonts / images load.
    const t = setTimeout(recompute, 200);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', recompute);
    };
  }, [startSelector, endSelector, start, end]);

  if (side === 'mirror') {
    return (
      <>
        <SingleVine
          start={range.start}
          end={range.end}
          side="left"
          color={color}
          strokeWidth={strokeWidth}
        />
        <SingleVine
          start={range.start}
          end={range.end}
          side="right"
          color={color}
          strokeWidth={strokeWidth}
        />
      </>
    );
  }
  return (
    <SingleVine
      start={range.start}
      end={range.end}
      side={side}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
}

interface SingleVineProps {
  start: number;
  end: number;
  side: 'left' | 'right';
  color: string;
  strokeWidth: number;
}

function SingleVine({ start, end, side, color, strokeWidth }: SingleVineProps) {
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [start, end], [0, 1]);
  const branchLength = useTransform(
    scrollYProgress,
    [start + (end - start) * 0.1, end],
    [0, 1],
  );
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.02, end - 0.02, end + 0.05],
    [0, 1, 1, 0.85],
  );

  // Helper: convert a 0..1 offset along the vine into an absolute
  // document-scroll cutoff inside [start, end].
  const at = (frac: number) => start + (end - start) * frac;

  // 6 leaves spread along the vine, staggered so they appear sequentially
  // as the vine draws past them. `t` is the position along the vine
  // (0..1), not an absolute scroll cutoff — the helper above maps it.
  const leaves: Array<{ x: number; y: number; rot: number; scale: number; t: number }> = [
    { x: 70, y: 130, rot: -38, scale: 1.0, t: at(0.18) },
    { x: 130, y: 230, rot: 32, scale: 0.85, t: at(0.30) },
    { x: 65, y: 330, rot: -26, scale: 1.15, t: at(0.42) },
    { x: 140, y: 430, rot: 44, scale: 0.9, t: at(0.55) },
    { x: 75, y: 540, rot: -34, scale: 1.05, t: at(0.68) },
    { x: 130, y: 660, rot: 30, scale: 0.95, t: at(0.82) },
  ];

  const berries: Array<{ x: number; y: number; r: number; t: number }> = [
    { x: 110, y: 195, r: 3, t: at(0.24) },
    { x: 95, y: 405, r: 2.5, t: at(0.50) },
    { x: 115, y: 615, r: 3, t: at(0.76) },
  ];

  const positionClass =
    side === 'right' ? 'right-0 md:right-4' : 'left-0 md:left-4';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 ${positionClass} h-screen w-28 md:w-44 lg:w-52 z-10`}
      style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined }}
    >
      <motion.svg
        viewBox="0 0 200 800"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        style={{ opacity }}
      >
        {/* Soft glow behind the vine for depth. */}
        <defs>
          <filter id={`vine-glow-${side}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main vine — meandering S-curve from top to bottom. */}
        <motion.path
          d="
            M 100 -10
            C 100 60, 60 100, 70 170
            S 140 240, 130 320
            S 50 420, 80 520
            S 150 620, 110 720
            S 70 800, 100 850
          "
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ pathLength, filter: `url(#vine-glow-${side})` }}
        />

        {/* Thin secondary branches that draw alongside the main vine. */}
        <motion.path
          d="M 70 170 q 20 -25 50 -10"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 0.5}
          strokeLinecap="round"
          opacity={0.55}
          style={{ pathLength: branchLength }}
        />
        <motion.path
          d="M 130 320 q -25 -15 -55 -5"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 0.5}
          strokeLinecap="round"
          opacity={0.55}
          style={{ pathLength: branchLength }}
        />
        <motion.path
          d="M 80 520 q 25 -20 55 -10"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 0.5}
          strokeLinecap="round"
          opacity={0.55}
          style={{ pathLength: branchLength }}
        />

        {/* Leaves. */}
        {leaves.map((l, i) => (
          <AnimatedLeaf
            key={i}
            x={l.x}
            y={l.y}
            rot={l.rot}
            scale={l.scale}
            t={l.t}
            color={color}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* Berries / accent dots. */}
        {berries.map((b, i) => (
          <AnimatedBerry
            key={i}
            x={b.x}
            y={b.y}
            r={b.r}
            t={b.t}
            color={color}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </motion.svg>
    </div>
  );
}

function AnimatedLeaf({
  x,
  y,
  rot,
  scale,
  t,
  color,
  scrollYProgress,
}: {
  x: number;
  y: number;
  rot: number;
  scale: number;
  t: number;
  color: string;
  scrollYProgress: MotionValue<number>;
}) {
  // 5% of total document scroll for the grow-in. Subsequent scrolling
  // gives a slow rotational sway so leaves don't look frozen once drawn.
  const grow = useTransform(scrollYProgress, [t, t + 0.05], [0, 1]);
  const fade = useTransform(scrollYProgress, [t, t + 0.04], [0, 1]);
  const sway = useTransform(scrollYProgress, [t, Math.min(1, t + 0.5)], [rot - 6, rot + 6]);

  return (
    <motion.g
      style={{ scale: grow, opacity: fade, rotate: sway, originX: 0, originY: 0 }}
      transform={`translate(${x} ${y}) scale(${scale})`}
    >
      <Leaf color={color} />
    </motion.g>
  );
}

function AnimatedBerry({
  x,
  y,
  r,
  t,
  color,
  scrollYProgress,
}: {
  x: number;
  y: number;
  r: number;
  t: number;
  color: string;
  scrollYProgress: MotionValue<number>;
}) {
  const grow = useTransform(scrollYProgress, [t, t + 0.04], [0, 1]);
  const fade = useTransform(scrollYProgress, [t, t + 0.03], [0, 1]);
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={r}
      fill={color}
      style={{ scale: grow, opacity: fade, originX: x, originY: y }}
    />
  );
}

/**
 * --------------------------------------------------------------------------
 * LeafCorners
 * --------------------------------------------------------------------------
 * Top-left + top-right corner foliage built from PNG / WebP cutouts the
 * user has dropped into /public/leaves/. Each corner image fades and
 * gently scales in as the user enters the section. The bottom edge of
 * each image is the anchor point that the SVG vines grow out from, so
 * the visual is "leaves at the top corners → vine tendrils growing
 * down past them."
 *
 * Behaviour when no images are uploaded:
 *   - Both slots stay empty.
 *   - The vines still grow from the same anchor coordinates, just
 *     without visible foliage at the top.
 *
 * Behaviour when only one image is uploaded:
 *   - That image is used for both corners; the right copy is
 *     CSS-mirrored (scaleX(-1)) so the leaves face inward on each side.
 */
interface LeafCornersProps {
  /** ref to the section the leaves sit at the top of (e.g. the GROW BOLDLY
   *  section) — used to drive the fade-in via the section's own scroll
   *  progress, so the foliage appears as the section enters view. */
  sectionRef: RefObject<HTMLElement | null>;
}

const LEFT_CANDIDATES = [
  '/leaves/top-left.png',
  '/leaves/top-left.webp',
  '/leaves/leaves-left.png',
  '/leaves/leaves-left.webp',
];
const RIGHT_CANDIDATES = [
  '/leaves/top-right.png',
  '/leaves/top-right.webp',
  '/leaves/leaves-right.png',
  '/leaves/leaves-right.webp',
];

export function LeafCorners({ sectionRef }: LeafCornersProps) {
  const [leftSrc, setLeftSrc] = useState<string | null>(null);
  const [rightSrc, setRightSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function probe(candidates: string[]): Promise<string | null> {
      for (const url of candidates) {
        try {
          const res = await fetch(url, { method: 'HEAD', cache: 'no-cache' });
          if (!res.ok) continue;
          const ct = (res.headers.get('content-type') ?? '').toLowerCase();
          if (ct.startsWith('image/')) return url;
        } catch {
          // ignore network/parse errors
        }
      }
      return null;
    }

    (async () => {
      const [l, r] = await Promise.all([
        probe(LEFT_CANDIDATES),
        probe(RIGHT_CANDIDATES),
      ]);
      if (cancelled) return;
      // If only one is uploaded, mirror it to the other side.
      const left = l ?? r;
      const right = r ?? l;
      setLeftSrc(left);
      setRightSrc(right);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Drive a soft fade + downward grow from the section's own scroll
  // progress, so the leaves appear as the GROW BOLDLY section is
  // entering the viewport.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });
  const opacity = useTransform(scrollYProgress, [0.0, 0.6], [0, 1]);
  const yLeft = useTransform(scrollYProgress, [0.0, 0.6], [-32, 0]);
  const yRight = useTransform(scrollYProgress, [0.0, 0.6], [-32, 0]);
  const scaleLeft = useTransform(scrollYProgress, [0.0, 0.7], [0.92, 1]);
  const scaleRight = useTransform(scrollYProgress, [0.0, 0.7], [0.92, 1]);

  if (!leftSrc && !rightSrc) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 right-0 z-[1] overflow-hidden"
      style={{ height: '60vh' }}
    >
      {leftSrc && (
        <motion.img
          src={leftSrc}
          alt=""
          className="absolute top-0 left-0 select-none"
          style={{
            opacity,
            y: yLeft,
            scale: scaleLeft,
            width: 'min(46vw, 620px)',
            maxHeight: '55vh',
            objectFit: 'contain',
            objectPosition: 'top left',
            transformOrigin: 'top left',
          }}
          draggable={false}
        />
      )}
      {rightSrc && (
        <motion.img
          src={rightSrc}
          alt=""
          className="absolute top-0 right-0 select-none"
          style={{
            opacity,
            y: yRight,
            scale: scaleRight,
            width: 'min(46vw, 620px)',
            maxHeight: '55vh',
            objectFit: 'contain',
            objectPosition: 'top right',
            transformOrigin: 'top right',
            // If only one image was supplied (leftSrc === rightSrc), flip
            // the right copy so the foliage faces inward on each side.
            transform: leftSrc === rightSrc ? 'scaleX(-1)' : undefined,
          }}
          draggable={false}
        />
      )}
    </div>
  );
}

/**
 * Outlineless leaf glyph. A solid asymmetric drop with a subtle
 * darker tip so it reads as a real leaf instead of a flat blob.
 * Caller is responsible for translate/rotate/scale.
 */
function Leaf({ color }: { color: string }) {
  return (
    <g>
      <path
        d="M 0 0
           C -10 -4, -22 4, -26 16
           C -22 28, -8 36, 0 38
           C 8 36, 22 28, 26 16
           C 22 4, 10 -4, 0 0 Z"
        fill={color}
        fillOpacity={0.92}
      />
      {/* Slightly darker tip for depth — same path scaled & translated,
          painted with multiply via low-alpha black so it tints whatever
          green the parent uses. */}
      <path
        d="M 0 22
           C -8 28, -14 32, -20 30
           C -16 36, -8 38, 0 38
           C 8 38, 16 36, 20 30
           C 14 32, 8 28, 0 22 Z"
        fill="#000"
        fillOpacity={0.18}
      />
    </g>
  );
}
