import ParallaxImages from '@/components/ui/3d-parallax-effect-on-hover';

const DemoOne = () => {
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=600&fit=crop',
      alt: 'Mountain valley landscape',
      f: 0.1,
      r: '10px',
    },
    {
      src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=600&fit=crop',
      alt: 'Eagle in flight',
      f: 0.12,
      r: '5px',
    },
    {
      src: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=600&h=600&fit=crop',
      alt: 'Cup of tea on table',
      f: 0.08,
      r: '20px',
    },
  ];

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <ParallaxImages images={images} />
    </div>
  );
};

export { DemoOne };
