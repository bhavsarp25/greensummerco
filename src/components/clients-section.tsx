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

      <div className="grid grid-cols-1 md:grid-flow-col place-content-center gap-8 px-2 sm:px-0">
        {clients.slice(0, 3).map((client, index) => {
          const preset = parallaxPresets[index % parallaxPresets.length];
          return (
            <div key={client.id} className="flex flex-col items-center gap-3 text-center">
              <button
                type="button"
                onClick={() => onClientClick(client.id)}
                className="parallax-tile overflow-hidden"
                style={
                  {
                    ['--f' as string]: preset.f,
                    ['--r' as string]: preset.r,
                  } as CSSProperties
                }
                onPointerMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                  const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
                  e.currentTarget.style.setProperty('--mx', x.toFixed(3));
                  e.currentTarget.style.setProperty('--my', y.toFixed(3));
                }}
                onPointerLeave={(e) => {
                  e.currentTarget.style.setProperty('--mx', '0');
                  e.currentTarget.style.setProperty('--my', '0');
                }}
              >
                <img
                  src={client.logo}
                  alt={`${client.name} logo`}
                  className="parallax-img"
                />
              </button>
              <h3 className="text-xl text-[#688952] group-hover:underline">
                {client.name}
              </h3>
              <p className="text-sm text-gray-500">{client.industry}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
