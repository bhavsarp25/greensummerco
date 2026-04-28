import { useState } from 'react';
import { Menu, X, Mail, Phone, Share2 } from 'lucide-react';
import { InteractiveLogo } from './components/interactive-logo';
import { ClientsSection } from './components/clients-section';
import { ClientDetail } from './components/client-detail';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  // If a client is selected, show the client detail page
  if (selectedClient !== null) {
    return <ClientDetail clientId={selectedClient} onBack={() => setSelectedClient(null)} />;
  }

  const services = [
    { title: 'Content Creation', description: 'High-quality content from filming to storytelling that captures your brand essence.' },
    { title: 'Website Creation', description: 'Intuitive, beautiful websites designed to convert visitors into customers.' },
    { title: 'Social Media Management', description: 'Strategic growth and management to build your digital community.' },
    { title: 'Branding & Advertisements', description: 'Comprehensive branding and targeted paid advertising campaigns.' },
    { title: 'Digital Design', description: 'Cutting-edge digital design that sets you apart from the competition.' },
    { title: 'Graphic Design', description: 'Visual storytelling through compelling graphic design.' },
    { title: 'Professional Photography', description: 'Stunning photography that brings your brand to life.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#D8CDB1]/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-[#688952] cursor-pointer" onClick={() => scrollToSection('hero')}>
              GREEN SUMMER COLLECTIVE
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-[#688952] transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-[#688952] transition-colors">
                Services
              </button>
              <button onClick={() => scrollToSection('clients')} className="text-gray-700 hover:text-[#688952] transition-colors">
                Our Clients
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-[#688952] transition-colors">
                Contact
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#688952]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
              <button onClick={() => scrollToSection('about')} className="text-left text-gray-700 hover:text-[#688952] transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('services')} className="text-left text-gray-700 hover:text-[#688952] transition-colors">
                Services
              </button>
              <button onClick={() => scrollToSection('clients')} className="text-left text-gray-700 hover:text-[#688952] transition-colors">
                Our Clients
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-left text-gray-700 hover:text-[#688952] transition-colors">
                Contact
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with 3D Logo */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#D8CDB1]/10 pt-20">
        <div className="w-full h-[500px] mb-8">
          <InteractiveLogo />
        </div>
        <h1 className="text-4xl md:text-6xl text-center px-6 mb-4">
          <span className="text-[#688952]">GROW BOLDLY.</span>
          <br />
          <span className="text-gray-800">THRIVE DIGITALLY.</span>
        </h1>
        <p className="text-gray-600 text-center max-w-2xl px-6 mt-4">
          Your partners in lasting digital prosperity
        </p>
        <button
          onClick={() => scrollToSection('contact')}
          className="mt-8 px-8 py-3 bg-[#688952] text-white rounded-full hover:bg-[#688952]/90 transition-colors"
        >
          Let's Grow Together
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl text-[#688952] mb-8 text-center">
            GREEN SUMMER COLLECTIVE
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              At Green Summer Collective, we believe in the power of digital growth that is both fresh and enduring.
              Our name embodies our philosophy: a commitment to renewal, abundant opportunity, and the continuous
              thriving of your business in the digital space. We are more than an agency; we are a creative ecosystem
              dedicated to building long-term success, not just quick results.
            </p>
            <p>
              Born from a vision by two founders to help brands break through the noise, we have evolved into a
              full-service collective. We are a powerhouse team of specialized strategists, storytellers, editors,
              and marketers, working seamlessly to elevate your brand. When you partner with us, you don't just
              hire one expert; you gain access to an entire creative force.
            </p>
            <p>
              Our core services are designed to be a holistic solution for scaling your digital presence and building
              authority. We craft compelling Social Media Growth & Management strategies, produce high-quality Content
              Creation from filming to storytelling, design intuitive Websites, manage targeted Paid Advertising
              campaigns (Meta, Google), and develop comprehensive Branding & Digital Strategy.
            </p>
            <p>
              We operate as an extension of your brand, focusing on authentic storytelling, consistency, and precision
              execution. We don't just capture attention; we convert it into real, lasting impact. Your growth is our
              shared mission.
            </p>
            <p className="text-[#688952] text-center pt-6">
              Let's cultivate your digital future together.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-gradient-to-b from-white to-[#D8CDB1]/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl text-[#688952] mb-12 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg border border-[#D8CDB1] hover:border-[#688952] transition-colors hover:shadow-lg"
              >
                <h3 className="text-xl text-[#688952] mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section id="clients" className="py-20 px-6 bg-white">
        <ClientsSection onClientClick={(clientId) => setSelectedClient(clientId)} />
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl text-[#688952] mb-12">
            Get In Touch
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <a
              href="mailto:greensummercollective@gmail.com"
              className="flex items-center justify-center gap-3 p-6 bg-[#D8CDB1]/20 rounded-lg hover:bg-[#D8CDB1]/30 transition-colors"
            >
              <Mail className="text-[#688952]" size={24} />
              <span className="text-gray-700">greensummercollective@gmail.com</span>
            </a>

            <a
              href="tel:437-215-1855"
              className="flex items-center justify-center gap-3 p-6 bg-[#D8CDB1]/20 rounded-lg hover:bg-[#D8CDB1]/30 transition-colors"
            >
              <Phone className="text-[#688952]" size={24} />
              <span className="text-gray-700">437-215-1855</span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 flex-wrap">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#688952] text-white rounded-full hover:bg-[#688952]/90 transition-colors"
              title="Instagram"
            >
              <Share2 size={20} />
              <span>Instagram</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#688952] text-white rounded-full hover:bg-[#688952]/90 transition-colors"
              title="LinkedIn"
            >
              <Share2 size={20} />
              <span>LinkedIn</span>
            </a>
            <a
              href="mailto:greensummercollective@gmail.com"
              className="flex items-center gap-2 px-6 py-3 bg-[#688952] text-white rounded-full hover:bg-[#688952]/90 transition-colors"
              title="Email"
            >
              <Mail size={20} />
              <span>Email</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[#688952] text-white text-center">
        <p>© 2026 Green Summer Collective. All rights reserved.</p>
        <p className="mt-2 text-sm opacity-80">Your Partners in Lasting Digital Prosperity</p>
      </footer>
    </div>
  );
}
