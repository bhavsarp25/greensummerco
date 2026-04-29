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
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2825] antialiased">
      {/* Header with Back Button */}
      <div className="bg-[#faf8f5]/85 backdrop-blur-md border-b border-[#e8e2d8]/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 font-sans text-[14px] font-medium text-[#557042] hover:text-[#3d5230] transition-colors"
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
            <p className="font-sans text-[11px] font-medium tracking-[0.18em] uppercase text-[#557042]/85 mb-3">
              {client.industry}
            </p>
            <h1 className="font-display not-italic text-[2.75rem] sm:text-4xl md:text-5xl text-[#2f3d26] mb-5 leading-[1.06] tracking-[-0.03em]">
              {client.name}
            </h1>
            <p className="font-sans text-[17px] md:text-lg text-[#6b6863] leading-relaxed">
              {client.description}
            </p>
          </div>
        </div>

        {/* Services Provided */}
        <div className="mb-16">
          <h2 className="font-display not-italic text-2xl md:text-3xl text-[#2f3d26] mb-8 tracking-[-0.02em]">
            Services provided
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {client.services.map((service, index) => (
              <div
                key={index}
                className="p-4 md:p-5 bg-white/70 backdrop-blur-sm rounded-xl border border-[#e8e2d8] text-center font-sans text-[14px] md:text-[15px] text-[#4a4743]"
              >
                <p className="font-sans text-[#4a4743]">{service}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-[#e8e2d8] shadow-[0_24px_64px_-40px_rgba(47,61,38,0.18)]">
          <h2 className="font-display not-italic text-2xl md:text-3xl text-[#2f3d26] mb-8 tracking-[-0.02em]">
            Results & impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {client.results.map((result, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="text-[#557042] flex-shrink-0 mt-1" size={22} />
                <p className="font-sans text-[#5c5a55] text-[16px] md:text-[17px] leading-relaxed">
                  {result}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center px-4">
          <h3 className="font-display not-italic text-xl md:text-2xl text-[#2f3d26] mb-6 tracking-[-0.02em]">
            Ready to grow your business like {client.name}?
          </h3>
          <button
            onClick={onBack}
            className="font-sans text-[15px] font-medium px-8 py-3.5 bg-[#2f3d26] text-white rounded-full hover:bg-[#3d5230] transition-all duration-300 shadow-[0_8px_24px_-8px_rgba(47,61,38,0.35)]"
          >
            Explore More Clients
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-12 px-6 bg-[#2a3224] text-white/95 text-center border-t border-white/[0.06]">
        <p className="font-sans text-[13px] tracking-wide text-white/90">© 2026 Green Summer Collective. All rights reserved.</p>
        <p className="mt-3 font-display not-italic text-lg text-white/70 tracking-[-0.02em]">
          Your partners in lasting digital prosperity
        </p>
      </footer>
    </div>
  );
}
