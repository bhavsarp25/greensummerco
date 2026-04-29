import type { CSSProperties } from 'react';

export interface ParallaxImageItem {
  src: string;
  alt: string;
  f: number;
  r: string;
  id?: number | string;
}

interface ParallaxImagesProps {
  images: ParallaxImageItem[];
  className?: string;
  imageClassName?: string;
  tileClassName?: string;
  onImageClick?: (idx: number) => void;
}

export default function ParallaxImages({
  images,
  className = '',
  imageClassName = '',
  tileClassName = '',
  onImageClick,
}: ParallaxImagesProps) {
  return (
    <div className={`grid grid-flow-col place-content-center gap-8 p-0 ${className}`.trim()}>
      {images.map((img, idx) => (
        <button
          key={img.id ?? idx}
          type="button"
          className={`overflow-hidden parallax-tile focus:outline-none ${tileClassName}`.trim()}
          style={
            {
              ['--f' as string]: img.f,
              ['--r' as string]: img.r,
            } as CSSProperties
          }
          onClick={() => onImageClick?.(idx)}
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 18;
            e.currentTarget.style.setProperty('--mx', `${x.toFixed(2)}px`);
            e.currentTarget.style.setProperty('--my', `${y.toFixed(2)}px`);
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.setProperty('--mx', '0px');
            e.currentTarget.style.setProperty('--my', '0px');
          }}
          aria-label={img.alt}
        >
          <img
            src={img.src}
            alt={img.alt}
            className={`parallax-img ${imageClassName}`.trim()}
            style={
              {
                ['--f' as string]: img.f,
                ['--r' as string]: img.r,
              } as CSSProperties
            }
          />
        </button>
      ))}
    </div>
  );
}
