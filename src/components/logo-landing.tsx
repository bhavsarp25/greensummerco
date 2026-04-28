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
  /**
   * Optional path to an animated HTML wallpaper. If the file exists it
   * takes priority over the static background image and is mounted as
   * a full-bleed sandboxed iframe behind the logo.
   */
  wallpaperUrl?: string;
}

/**
 * Full-viewport landing section. The 3D logo dominates the screen; a
 * subtle scroll-down chevron at the bottom invites the user to continue.
 * As the user scrolls, the entire landing fades and lifts slightly,
 * which produces the sense that the next section "rises" from below.
 *
 * Background priority:
 *   1. Animated HTML wallpaper at /wallpaper/index.html (iframe).
 *   2. Static image at /images/background.{webp,jpg,jpeg,png}.
 *   3. Cream gradient fallback.
 */
export function LogoLanding({
  scrollTargetId,
  backgroundCandidates = [
    '/images/background.webp',
    '/images/background.jpg',
    '/images/background.jpeg',
    '/images/background.png',
  ],
  wallpaperUrl = '/wallpaper/index.html',
}: LogoLandingProps) {
  const [scrollPct, setScrollPct] = useState(0);
  const [bg, setBg] = useState<string | null>(null);
  const [wallpaper, setWallpaper] = useState<string | null>(null);

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

  // Probe for an animated HTML wallpaper. We must distinguish a real
  // /wallpaper/index.html from Vite's SPA fallback (which also returns
  // 200 + text/html for unknown paths). Use a GET and look for the
  // <div id="root"> marker emitted by our app shell — anything else
  // is treated as a real custom wallpaper.
  useEffect(() => {
    let cancelled = false;
    async function probe() {
      try {
        const res = await fetch(wallpaperUrl, { cache: 'no-cache' });
        if (!res.ok) return;
        const ct = (res.headers.get('content-type') ?? '').toLowerCase();
        if (!ct.includes('html')) return;
        const text = await res.text();
        const isAppShell =
          text.includes('id="root"') && text.includes('/src/main.tsx');
        if (!isAppShell && !cancelled) setWallpaper(wallpaperUrl);
      } catch {
        // network/parse error -> no wallpaper
      }
    }
    probe();
    return () => {
      cancelled = true;
    };
  }, [wallpaperUrl]);

  // Probe for a static background image as a fallback.
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
        background:
          !wallpaper && bg
            ? `url(${bg}) center/cover no-repeat`
            : !wallpaper
              ? 'linear-gradient(180deg, #ffffff 0%, rgba(216, 205, 177, 0.25) 100%)'
              : '#ffffff',
      }}
    >
      {/* Animated HTML wallpaper layer. The iframe is locked to
          pointer-events: none so the cursor-tracking 3D logo and the
          scroll-down chevron still receive mouse events normally. */}
      {wallpaper && (
        <iframe
          src={wallpaper}
          title="Animated background wallpaper"
          aria-hidden="true"
          tabIndex={-1}
          loading="eager"
          sandbox="allow-scripts allow-same-origin"
          className="absolute inset-0 w-full h-full border-0"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Soft cream wash so the logo always has enough contrast even on
          a busy background. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(216,205,177,0.30) 100%)',
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
