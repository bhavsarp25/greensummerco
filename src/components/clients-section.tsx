import { clients } from './client-data';

interface ClientsSectionProps {
  onClientClick: (clientId: number) => void;
}

export function ClientsSection({ onClientClick }: ClientsSectionProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="font-brand-force text-3xl md:text-5xl text-[#688952] mb-6 text-center font-normal">
        Our Clients
      </h2>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
        We're proud to partner with innovative brands and help them achieve digital excellence.
        Click on any client to learn more about their success story.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {clients.map((client) => (
          <button
            key={client.id}
            onClick={() => onClientClick(client.id)}
            className="group flex flex-col items-center p-6 bg-white rounded-lg border-2 border-[#D8CDB1] hover:border-[#688952] transition-all hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-100">
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-xl text-[#688952] text-center group-hover:underline">
              {client.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{client.industry}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
