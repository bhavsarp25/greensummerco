import { ArrowLeft, CheckCircle } from 'lucide-react';
import { clients } from './client-data';

interface ClientDetailProps {
  clientId: number;
  onBack: () => void;
}

export function ClientDetail({ clientId, onBack }: ClientDetailProps) {
  const client = clients.find(c => c.id === clientId);

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Client not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#D8CDB1]/10">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-[#D8CDB1]/30 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#688952] hover:text-[#688952]/80 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Clients</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
          <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 shadow-lg">
            <img
              src={client.logo}
              alt={`${client.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#688952] mb-2">{client.industry}</p>
            <h1 className="text-4xl md:text-6xl text-gray-800 mb-4">
              {client.name}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {client.description}
            </p>
          </div>
        </div>

        {/* Services Provided */}
        <div className="mb-16">
          <h2 className="text-3xl text-[#688952] mb-6">Services Provided</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {client.services.map((service, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg border border-[#D8CDB1] text-center"
              >
                <p className="text-gray-700">{service}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-[#D8CDB1]">
          <h2 className="text-3xl text-[#688952] mb-8">Results & Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {client.results.map((result, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="text-[#688952] flex-shrink-0 mt-1" size={24} />
                <p className="text-gray-700 text-lg">{result}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl text-gray-800 mb-4">
            Ready to grow your business like {client.name}?
          </h3>
          <button
            onClick={onBack}
            className="px-8 py-3 bg-[#688952] text-white rounded-full hover:bg-[#688952]/90 transition-colors"
          >
            Explore More Clients
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 px-6 bg-[#688952] text-white text-center">
        <p>© 2026 Green Summer Collective. All rights reserved.</p>
        <p className="mt-2 text-sm opacity-80">Your Partners in Lasting Digital Prosperity</p>
      </footer>
    </div>
  );
}
