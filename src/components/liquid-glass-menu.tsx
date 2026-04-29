import { AnimatePresence, MotionConfig, motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../lib/utils';

/**
 * --------------------------------------------------------------------------
 * <LiquidGlassMenu>
 * --------------------------------------------------------------------------
 * A minimal site nav that:
 *  - Replaces the top white banner. The wordmark sits at top-left as a
 *    standalone link; this menu is its only sibling top-right.
 *  - Renders as a "liquid glass" pill (an SVG feTurbulence / feDisplacementMap
 *    backdrop filter for the glass distortion + inset rim shadows for the
 *    bevel) — same look as the LiquidButton in the user-supplied sample.
 *  - Opens into a glass-styled dropdown of section links. Each link uses the
 *    sample's TextStaggerHover technique: hover an item and its characters
 *    flip up while a copy of each character flips into place from below.
 *  - Fades in as the user scrolls past the landing page (so it doesn't
 *    compete with the 3D logo at the very top).
 */

interface NavItem {
  id: string;
  label: string;
}

interface LiquidGlassMenuProps {
  items: NavItem[];
  onNavigate: (id: string) => void;
  /**
   * Selector for the section that, once scrolled past, makes the menu
   * fade in. Defaults to '#landing'.
   */
  fadeInAfterSelector?: string;
}

export function LiquidGlassMenu({
  items,
  onNavigate,
  fadeInAfterSelector = '#landing',
}: LiquidGlassMenuProps) {
  const [open, setOpen] = useState(false);

  // Drive the menu's appearance off document scroll progress, mapped so
  // the menu is invisible while the user is on the landing page (3D
  // logo) and fully visible once they've scrolled one viewport height
  // (or past the named selector if it's available).
  const { scrollY } = useScroll();
  const [appearAt, setAppearAt] = useState<number>(typeof window !== 'undefined' ? window.innerHeight * 0.7 : 800);

  useEffect(() => {
    function recompute() {
      const el = document.querySelector(fadeInAfterSelector) as HTMLElement | null;
      const fallback = window.innerHeight * 0.7;
      if (el) {
        // Start fading in when ~60% of the landing has scrolled past.
        setAppearAt(Math.max(0, el.offsetHeight * 0.6));
      } else {
        setAppearAt(fallback);
      }
    }
    recompute();
    window.addEventListener('resize', recompute, { passive: true });
    return () => window.removeEventListener('resize', recompute);
  }, [fadeInAfterSelector]);

  const opacity = useTransform(scrollY, [appearAt * 0.6, appearAt], [0, 1]);
  const y = useTransform(scrollY, [appearAt * 0.6, appearAt], [-12, 0]);
  const pointerActive = useTransform(scrollY, (v) =>
    v >= appearAt * 0.85 ? 'auto' : 'none',
  );

  // Close the dropdown on Escape and on click outside.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest?.('[data-liquid-menu-root]')) setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClickOutside);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);

  // Close after navigation.
  const handleSelect = useCallback(
    (id: string) => {
      setOpen(false);
      onNavigate(id);
    },
    [onNavigate],
  );

  return (
    <motion.div
      data-liquid-menu-root
      className="fixed top-5 right-5 md:top-7 md:right-8 z-50"
      style={{ opacity, y, pointerEvents: pointerActive }}
    >
      <GlassFilter />

      <LiquidGlassPill
        ariaLabel={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
        active={open}
      >
        <span className="flex items-center gap-2 text-[#3d5230]">
          <span className="hidden sm:inline tracking-[0.18em] text-xs uppercase font-medium">
            Menu
          </span>
          <span className="relative w-5 h-5">
            <AnimatePresence initial={false} mode="wait">
              {open ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="m"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </span>
      </LiquidGlassPill>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="absolute right-0 mt-3 origin-top-right w-64"
          >
            <LiquidGlassPanel>
              <HoverStaggerProvider>
                <ul className="flex flex-col py-3">
                  {items.map((item, i) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(item.id)}
                        className="group block w-full text-left px-6 py-2.5 text-[#3d5230] hover:bg-white/30 transition-colors"
                      >
                        <TextStaggerHover
                          text={item.label}
                          index={i}
                          className="text-base font-medium tracking-wide"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </HoverStaggerProvider>
            </LiquidGlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Liquid-glass shells — pill (button) and panel (dropdown)                  */
/* -------------------------------------------------------------------------- */

interface LiquidGlassPillProps {
  ariaLabel: string;
  onClick: () => void;
  active: boolean;
  children: ReactNode;
}

function LiquidGlassPill({
  ariaLabel,
  onClick,
  active,
  children,
}: LiquidGlassPillProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-expanded={active}
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center cursor-pointer',
        'h-12 px-5 rounded-full transition-transform duration-300 will-change-transform',
        'hover:scale-[1.04] active:scale-[0.98]',
      )}
    >
      <GlassShell rounded="rounded-full" />
      <span className="relative z-10 pointer-events-none">{children}</span>
    </button>
  );
}

function LiquidGlassPanel({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <GlassShell rounded="rounded-2xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * The actual glass effect: a backdrop-filter <div> that uses the SVG
 * displacement filter ('container-glass'), plus a sibling shadow layer
 * with inset rim shadows for the bevel highlights. Both layers are
 * absolute / inset-0 and `pointer-events: none`, so the parent button or
 * panel still works exactly like a normal element.
 */
function GlassShell({ rounded }: { rounded: string }) {
  return (
    <>
      {/* Inset-shadow bevel — same shadow stack as the sample's
          LiquidButton, tinted slightly green so the rim picks up the
          brand colour on light backgrounds. */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none',
          rounded,
          'shadow-[0_0_6px_rgba(85,112,66,0.08),0_2px_6px_rgba(85,112,66,0.10),inset_3px_3px_0.5px_-3px_rgba(255,255,255,0.9),inset_-3px_-3px_0.5px_-3px_rgba(85,112,66,0.55),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.7),inset_-1px_-1px_1px_-0.5px_rgba(85,112,66,0.4),inset_0_0_6px_6px_rgba(255,255,255,0.18),inset_0_0_2px_2px_rgba(85,112,66,0.06),0_0_18px_rgba(255,255,255,0.18)]',
        )}
      />
      {/* The displacement-distorted backdrop. Kept on its own layer with
          isolation so the filter applies once and doesn't bleed into the
          shadow stack. */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none isolate overflow-hidden',
          rounded,
        )}
        style={{
          backdropFilter: 'url("#container-glass") blur(2px) saturate(1.15)',
          WebkitBackdropFilter: 'blur(2px) saturate(1.15)',
          backgroundColor: 'rgba(255, 255, 255, 0.18)',
        }}
      />
    </>
  );
}

/**
 * The SVG filter the backdrop uses for the liquid distortion. Mounted
 * once near the menu (rather than at app root) so the menu file is
 * self-contained.
 */
function GlassFilter() {
  return (
    <svg className="absolute -left-[9999px] -top-[9999px] w-0 h-0" aria-hidden="true">
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.02"
            numOctaves="2"
            seed="3"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="50"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="2" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  TextStaggerHover — adapted from the user-supplied sample                  */
/*                                                                            */
/*  Each character is rendered twice: the visible glyph stays in place at     */
/*  20% opacity, then on hover slides UP and out. A second copy is pre-       */
/*  positioned 110% below it; on hover it slides UP into the slot. Each       */
/*  character's transition is delayed by index, producing the staggered      */
/*  cascade. The provider context tracks which item is currently hovered so   */
/*  only one row animates at a time.                                          */
/* -------------------------------------------------------------------------- */

interface HoverContextValue {
  active: number;
  setActive: (i: number) => void;
}
const HoverCtx = createContext<HoverContextValue | undefined>(undefined);

function HoverStaggerProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(-1);
  return (
    <HoverCtx.Provider value={{ active, setActive }}>
      <div onMouseLeave={() => setActive(-1)}>{children}</div>
    </HoverCtx.Provider>
  );
}

function useHoverCtx() {
  const c = useContext(HoverCtx);
  if (!c) throw new Error('TextStaggerHover must be used inside HoverStaggerProvider');
  return c;
}

interface TextStaggerHoverProps extends HTMLAttributes<HTMLSpanElement> {
  text: string;
  index: number;
}

const TextStaggerHover = forwardRef<HTMLSpanElement, TextStaggerHoverProps>(
  function TextStaggerHover({ text, index, className, ...props }, ref) {
    const { active, setActive } = useHoverCtx();
    const isActive = active === index;
    const chars = text.split('');
    return (
      <span
        ref={ref}
        className={cn('relative inline-block overflow-hidden align-bottom', className)}
        onMouseEnter={() => setActive(index)}
        {...props}
      >
        {chars.map((ch, i) => (
          <span key={`${ch}-${i}`} className="relative inline-block overflow-hidden">
            <MotionConfig
              transition={{
                delay: i * 0.025,
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <motion.span
                className="inline-block opacity-30"
                initial={{ y: '0%' }}
                animate={isActive ? { y: '-110%' } : { y: '0%' }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
              <motion.span
                className="absolute left-0 top-0 inline-block opacity-100"
                initial={{ y: '110%' }}
                animate={isActive ? { y: '0%' } : { y: '110%' }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            </MotionConfig>
          </span>
        ))}
      </span>
    );
  },
);
