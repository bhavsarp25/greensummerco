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
  /** Alignment along the viewport. Defaults to 'left'. */
  side?: 'left' | 'right';
  /** Stroke colour. */
  color?: string;
}

export function GrowingVine({
  start = 0,
  end = 0.5,
  side = 'left',
  color = '#557042',
}: GrowingVineProps) {
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [start, end], [0, 1]);
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.02, end - 0.02, end + 0.05],
    [0, 1, 1, 0.5],
  );

  // Three leaf accents that fade in at staggered points along the
  // animation, so the vine reads as growing leaves as it draws.
  const leaf1Scale = useTransform(scrollYProgress, [0.12, 0.22], [0, 1]);
  const leaf2Scale = useTransform(scrollYProgress, [0.22, 0.32], [0, 1]);
  const leaf3Scale = useTransform(scrollYProgress, [0.34, 0.44], [0, 1]);
  const leafOpacity1 = useTransform(scrollYProgress, [0.12, 0.2], [0, 1]);
  const leafOpacity2 = useTransform(scrollYProgress, [0.22, 0.3], [0, 1]);
  const leafOpacity3 = useTransform(scrollYProgress, [0.34, 0.42], [0, 1]);

  const positionClass =
    side === 'right' ? 'right-0 md:right-6' : 'left-0 md:left-6';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 ${positionClass} h-screen w-32 md:w-48 z-10`}
      style={{
        transform: side === 'right' ? 'scaleX(-1)' : undefined,
      }}
    >
      <motion.svg
        viewBox="0 0 200 800"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        style={{ opacity }}
      >
        {/* The vine path. A meandering S-curve down the side with
            organic curl variations. */}
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
          strokeWidth="3"
          strokeLinecap="round"
          style={{ pathLength }}
        />

        {/* Leaf accents — each is a soft elongated drop placed along
            the vine, scaled and faded in at its segment of the
            animation. */}
        <motion.g style={{ opacity: leafOpacity1, scale: leaf1Scale }} transform="translate(70 170) rotate(-30)">
          <Leaf color={color} />
        </motion.g>
        <motion.g style={{ opacity: leafOpacity2, scale: leaf2Scale }} transform="translate(135 320) rotate(40)">
          <Leaf color={color} />
        </motion.g>
        <motion.g style={{ opacity: leafOpacity3, scale: leaf3Scale }} transform="translate(80 520) rotate(-20)">
          <Leaf color={color} />
        </motion.g>
      </motion.svg>
    </div>
  );
}

function Leaf({ color }: { color: string }) {
  return (
    <g>
      <path
        d="M 0 0 C -10 -8, -22 -6, -28 6 C -22 18, -10 22, 0 26 C 10 22, 22 18, 28 6 C 22 -6, 10 -8, 0 0 Z"
        fill={color}
        opacity={0.18}
      />
      <path
        d="M 0 0 C -10 -8, -22 -6, -28 6 C -22 18, -10 22, 0 26 C 10 22, 22 18, 28 6 C 22 -6, 10 -8, 0 0 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
      />
      <path
        d="M 0 0 L 0 26"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  );
}
