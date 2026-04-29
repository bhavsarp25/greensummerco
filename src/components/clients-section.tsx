import { clients } from './client-data';
import ParallaxImages from './ui/3d-parallax-effect-on-hover';

interface ClientsSectionProps {
  onClientClick: (clientId: number) => void;
}

export function ClientsSection({ onClientClick }: ClientsSectionProps) {
  const featuredClients = clients.slice(0, 3).map((c, i) => ({
    id: c.id,
    src: c.logo,
    alt: `${c.name} logo`,
    f: [0.1, 0.12, 0.08][i] ?? 0.1,
    r: ['10px', '5px', '20px'][i] ?? '10px',
    title: c.name,
    subtitle: c.industry,
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="font-brand-force text-3xl md:text-5xl text-[#688952] mb-6 text-center font-normal">
        Our Clients
      </h2>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
        We're proud to partner with innovative brands and help them achieve digital excellence.
        Click on any client to learn more about their success story.
      </p>

      <ParallaxImages
        images={featuredClients}
        onImageClick={(id) => onClientClick(Number(id))}
        className="p-0 bg-transparent min-h-0"
        tileClassName="w-[230px] h-[230px] md:w-[280px] md:h-[280px]"
      />
    </div>
  );
}
