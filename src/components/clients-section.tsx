import { clients } from './client-data';

interface ClientsSectionProps {
  onClientClick: (clientId: number) => void;
}

export function ClientsSection({ onClientClick }: ClientsSectionProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <p className="font-sans text-center text-[11px] sm:text-xs font-medium tracking-[0.22em] uppercase text-[#557042]/80 mb-5">
        Portfolio
      </p>
      <h2 className="font-display not-italic text-[2.25rem] sm:text-[2.75rem] md:text-[3.5rem] text-[#2f3d26] mb-5 text-center leading-[1.08] tracking-[-0.03em]">
        Our clients
      </h2>
      <p className="font-sans text-[#6b6863] text-center max-w-xl mx-auto mb-14 text-[15px] md:text-base leading-relaxed">
        We're proud to partner with innovative brands and help them achieve digital excellence.
        Click on any client to learn more about their success story.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 md:gap-6">
        {clients.map((client) => (
          <button
            key={client.id}
            onClick={() => onClientClick(client.id)}
            className="group flex flex-col items-center p-7 md:p-8 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e8e2d8] hover:border-[#c9c0b2] transition-all duration-300 hover:shadow-[0_28px_56px_-32px_rgba(47,61,38,0.2)]"
          >
            <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-100">
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="font-display not-italic text-lg md:text-xl text-[#2f3d26] text-center group-hover:underline tracking-[-0.02em]">
              {client.name}
            </h3>
            <p className="font-sans text-[13px] text-[#6b6863] mt-1.5">{client.industry}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
