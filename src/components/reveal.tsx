import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /**
   * Direction the content slides in from. 'up' is the default
   * (content begins translated down, fades up into place).
   */
  from?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Translation distance in pixels at the start of the reveal. */
  distance?: number;
  /** ms delay before the animation starts after entering the viewport. */
  delay?: number;
  /** ms duration of the animation. */
  duration?: number;
  /**
   * IntersectionObserver rootMargin. Shrinking the bottom of the viewport
   * (e.g. '0px 0px -10% 0px') makes elements wait until they're a bit
   * further into view before animating, which feels more deliberate.
   */
  rootMargin?: string;
  /** When true, replay the animation if the element leaves and re-enters. */
  replay?: boolean;
  className?: string;
}

/**
 * Lightweight, dependency-free scroll-reveal wrapper. Uses a single
 * IntersectionObserver to flip an `is-visible` state on the wrapper
 * element when it enters the viewport; the animation itself is driven
 * by CSS transitions on transform + opacity, which run on the
 * compositor and don't block the main thread.
 *
 * Designed to be sprinkled liberally across page sections without any
 * library overhead — it's ~50 lines and supports replay, delay, and
 * direction out of the box.
 */
export function Reveal({
  children,
  from = 'up',
  distance = 32,
  delay = 0,
  duration = 700,
  rootMargin = '0px 0px -10% 0px',
  replay = false,
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (!replay) observer.unobserve(entry.target);
          } else if (replay) {
            setVisible(false);
          }
        }
      },
      { rootMargin, threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, replay]);

  const initialTransform =
    from === 'up'
      ? `translate3d(0, ${distance}px, 0)`
      : from === 'down'
        ? `translate3d(0, ${-distance}px, 0)`
        : from === 'left'
          ? `translate3d(${-distance}px, 0, 0)`
          : from === 'right'
            ? `translate3d(${distance}px, 0, 0)`
            : 'translate3d(0, 0, 0)';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0, 0, 0)' : initialTransform,
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
