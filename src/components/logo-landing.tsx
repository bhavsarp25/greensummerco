import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { InteractiveLogo } from './interactive-logo';

interface LogoLandingProps {
  /** Anchor id of the section the user lands on after scrolling down. */
  scrollTargetId: string;
  /**
   * Optional candidate URLs for a custom background image. The first one
   * that resolves to a real binary asset is used. Falls back to the
   * cream gradient when none are available.
   */
  backgroundCandidates?: string[];
}

/**
 * Full-viewport landing section. The 3D logo dominates the screen; a
 * subtle scroll-down chevron at the bottom invites the user to continue.
 * As the user scrolls, the entire landing fades and lifts slightly,
 * which produces the sense that the next section "rises" from below.
 */
export function LogoLanding({
  scrollTargetId,
  backgroundCandidates = [
    '/images/background.webp',
    '/images/background.jpg',
    '/images/background.jpeg',
    '/images/background.png',
  ],
}: LogoLandingProps) {
  const [scrollPct, setScrollPct] = useState(0);
  const [bg, setBg] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight || 1;
      const y = window.scrollY;
      // 0 at the top of the page, 1 once the user has scrolled one
      // viewport-height. Used for parallax + fade on the landing.
      setScrollPct(Math.min(1, Math.max(0, y / vh)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function probe() {
      for (const url of backgroundCandidates) {
        try {
          const res = await fetch(url, { method: 'HEAD', cache: 'no-cache' });
          if (!res.ok) continue;
          const ct = (res.headers.get('content-type') ?? '').toLowerCase();
          if (ct.startsWith('image/')) {
            if (!cancelled) setBg(url);
            return;
          }
        } catch {
          // ignored
        }
      }
      if (!cancelled) setBg(null);
    }
    probe();
    return () => {
      cancelled = true;
    };
  }, [backgroundCandidates.join('|')]);

  const handleScrollDown = () => {
    const target = document.getElementById(scrollTargetId);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="landing"
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{
        background: bg
          ? `url(${bg}) center/cover no-repeat`
          : 'linear-gradient(180deg, #ffffff 0%, rgba(216, 205, 177, 0.25) 100%)',
      }}
    >
      {/* Soft cream wash so the logo always has enough contrast even on
          a busy background image. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(216,205,177,0.35) 100%)',
        }}
      />

      <div
        className="relative w-full h-screen flex items-center justify-center"
        style={{
          opacity: 1 - scrollPct * 1.15,
          transform: `translate3d(0, ${-scrollPct * 60}px, 0)`,
          transition: 'opacity 80ms linear, transform 80ms linear',
          willChange: 'opacity, transform',
        }}
      >
        <div className="w-full h-[80vh] max-h-[900px] px-4">
          <InteractiveLogo />
        </div>
      </div>

      <button
        type="button"
        onClick={handleScrollDown}
        aria-label="Scroll to next section"
        className="absolute left-1/2 -translate-x-1/2 bottom-8 md:bottom-10 flex flex-col items-center gap-2 text-[#557042]/80 hover:text-[#557042] transition-colors"
        style={{
          opacity: 1 - scrollPct * 1.4,
          pointerEvents: scrollPct > 0.4 ? 'none' : 'auto',
        }}
      >
        <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown size={28} className="animate-bounce-slow" />
      </button>
    </section>
  );
}
