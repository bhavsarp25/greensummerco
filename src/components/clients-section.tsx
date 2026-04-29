import type { CSSProperties } from 'react';
import { clients } from './client-data';

interface ClientsSectionProps {
  onClientClick: (clientId: number) => void;
}

export function ClientsSection({ onClientClick }: ClientsSectionProps) {
  const parallaxPresets = [
    { f: 0.1, r: '10px' },
    { f: 0.12, r: '5px' },
    { f: 0.08, r: '20px' },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="font-brand-force text-3xl md:text-5xl text-[#688952] mb-6 text-center font-normal">
        Our Clients
      </h2>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
        We're proud to partner with innovative brands and help them achieve digital excellence.
        Click on any client to learn more about their success story.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-content-center gap-8 px-2 sm:px-0">
        {clients.map((client, index) => {
          const preset = parallaxPresets[index % parallaxPresets.length];
          return (
            <button
              key={client.id}
              onClick={() => onClientClick(client.id)}
              className="parallax-card group flex flex-col items-center gap-3 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="overflow-hidden">
                <img
                  src={client.logo}
                  alt={`${client.name} logo`}
                  className="parallax-img h-[230px] w-[230px] object-cover"
                  style={
                    {
                      ['--f' as string]: preset.f,
                      ['--r' as string]: preset.r,
                    } as CSSProperties
                  }
                />
              </div>
              <h3 className="text-xl text-[#688952] group-hover:underline">
                {client.name}
              </h3>
              <p className="text-sm text-gray-500">{client.industry}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
