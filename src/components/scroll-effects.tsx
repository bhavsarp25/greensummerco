import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';

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
   * 0..1 cutoff: the vine starts drawing when document scroll progress
   * passes `start` and is fully drawn at `end`.
   */
  start?: number;
  end?: number;
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
  side = 'mirror',
  color = '#557042',
  strokeWidth = 3,
}: GrowingVineProps) {
  if (side === 'mirror') {
    return (
      <>
        <SingleVine
          start={start}
          end={end}
          side="left"
          color={color}
          strokeWidth={strokeWidth}
        />
        <SingleVine
          start={start}
          end={end}
          side="right"
          color={color}
          strokeWidth={strokeWidth}
        />
      </>
    );
  }
  return (
    <SingleVine
      start={start}
      end={end}
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
  const branchLength = useTransform(scrollYProgress, [start + 0.04, end], [0, 1]);
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.02, end - 0.02, end + 0.05],
    [0, 1, 1, 0.55],
  );

  // 6 leaves spread along the vine. Each leaf is a tuple of
  // (x, y, rotation, scale). The growing-in animation is staggered so
  // they appear sequentially as the vine draws past them.
  const leaves: Array<{ x: number; y: number; rot: number; scale: number; t: number }> = [
    { x: 70, y: 130, rot: -38, scale: 1.0, t: 0.10 },
    { x: 130, y: 230, rot: 32, scale: 0.85, t: 0.16 },
    { x: 65, y: 330, rot: -26, scale: 1.15, t: 0.22 },
    { x: 140, y: 430, rot: 44, scale: 0.9, t: 0.28 },
    { x: 75, y: 540, rot: -34, scale: 1.05, t: 0.34 },
    { x: 130, y: 660, rot: 30, scale: 0.95, t: 0.40 },
  ];

  // Small berries / dot accents to add density without too much chrome.
  const berries: Array<{ x: number; y: number; r: number; t: number }> = [
    { x: 110, y: 195, r: 3, t: 0.13 },
    { x: 95, y: 405, r: 2.5, t: 0.27 },
    { x: 115, y: 615, r: 3, t: 0.39 },
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
          strokeWidth={strokeWidth * 0.55}
          strokeLinecap="round"
          opacity={0.7}
          style={{ pathLength: branchLength }}
        />
        <motion.path
          d="M 130 320 q -25 -15 -55 -5"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 0.55}
          strokeLinecap="round"
          opacity={0.7}
          style={{ pathLength: branchLength }}
        />
        <motion.path
          d="M 80 520 q 25 -20 55 -10"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 0.55}
          strokeLinecap="round"
          opacity={0.7}
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
  const grow = useTransform(scrollYProgress, [t, t + 0.08], [0, 1]);
  const fade = useTransform(scrollYProgress, [t, t + 0.06], [0, 1]);
  const sway = useTransform(scrollYProgress, [t, t + 0.5], [rot - 6, rot + 6]);

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
  const grow = useTransform(scrollYProgress, [t, t + 0.06], [0, 1]);
  const fade = useTransform(scrollYProgress, [t, t + 0.05], [0, 1]);
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

function Leaf({ color }: { color: string }) {
  return (
    <g>
      {/* Soft fill for body. */}
      <path
        d="M 0 0 C -12 -10, -28 -6, -34 8 C -28 22, -12 28, 0 32 C 12 28, 28 22, 34 8 C 28 -6, 12 -10, 0 0 Z"
        fill={color}
        opacity={0.22}
      />
      {/* Outline. */}
      <path
        d="M 0 0 C -12 -10, -28 -6, -34 8 C -28 22, -12 28, 0 32 C 12 28, 28 22, 34 8 C 28 -6, 12 -10, 0 0 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      {/* Central rib. */}
      <path
        d="M 0 0 L 0 32"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Side veins. */}
      <path
        d="M 0 8 L -14 4 M 0 8 L 14 4 M 0 18 L -18 16 M 0 18 L 18 16 M 0 26 L -12 28 M 0 26 L 12 28"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity={0.7}
      />
    </g>
  );
}
