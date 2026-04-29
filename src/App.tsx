import { useRef, useState } from 'react';
import { Mail, Phone, Share2 } from 'lucide-react';
import { ClientsSection } from './components/clients-section';
import { ClientDetail } from './components/client-detail';
import { LogoLanding } from './components/logo-landing';
import { Reveal } from './components/reveal';
import {
  ConvergingHeadline,
  GrowingVine,
  LeafCorners,
} from './components/scroll-effects';
import { LiquidGlassMenu } from './components/liquid-glass-menu';

export default function App() {
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const heroSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'hero', label: 'Welcome' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'clients', label: 'Our Clients' },
    { id: 'contact', label: 'Contact' },
  ];

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
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2825] antialiased">
      {/* Wordmark — top-left, always visible, no banner. Sits on top
          of whatever the landing wallpaper / 3D logo is rendering, then
          sits on top of regular page content as the user scrolls. */}
      <button
        type="button"
        onClick={() => scrollToSection('landing')}
        className="fixed top-5 left-5 md:top-7 md:left-8 z-50 cursor-pointer font-display text-[1.05rem] sm:text-[1.15rem] md:text-xl text-[#2f3d26] tracking-[-0.01em] italic hover:text-[#557042] transition-colors duration-300"
        aria-label="Green Summer Collective — back to top"
      >
        Green Summer Collective
      </button>

      {/* Liquid-glass menu — fades in once the user scrolls past the
          landing section, opens into a glass dropdown of nav links with
          per-character stagger-flip animation on hover. */}
      <LiquidGlassMenu
        items={navItems}
        onNavigate={scrollToSection}
        fadeInAfterSelector="#landing"
      />

      {/* Decorative vines that grow on both sides of the page, anchored
          to the bottom-inside corners of the LeafCorners foliage above
          the GROW BOLDLY section. Drawing starts as the user scrolls
          PAST GROW BOLDLY (#hero) and is fully drawn by the time they
          reach the contact section at the bottom of the page, so the
          vines accompany the user through the rest of the site. */}
      <GrowingVine startSelector="#hero" endSelector="#contact" />

      {/* Page 1: Landing — interactive 3D logo, full viewport, scroll-down hint */}
      <LogoLanding scrollTargetId="hero" />

      {/* Page 2: Hero — GROW BOLDLY. THRIVE DIGITALLY. with character
          convergence on scroll-in, plus PNG leaves that fade in at the
          top corners of the section (foliage from /public/leaves/). */}
      <div ref={heroSectionRef} className="relative">
        <LeafCorners sectionRef={heroSectionRef} />
        <ConvergingHeadline
          id="hero"
          eyebrow="Welcome to Green Summer Collective"
          lines={[
            { text: 'GROW BOLDLY.', color: 'primary' },
            { text: 'THRIVE DIGITALLY.', color: 'secondary' },
          ]}
          subtitle="Your partners in lasting digital prosperity."
          cta={{
            label: "Let's Grow Together",
            onClick: () => scrollToSection('contact'),
          }}
        />
      </div>

      {/* About Section */}
      <section id="about" className="py-28 md:py-32 px-6 sm:px-10 bg-[#faf8f5]">
        <div className="max-w-3xl mx-auto">
          <Reveal from="up">
            <p className="font-sans text-center text-[11px] sm:text-xs font-medium tracking-[0.22em] uppercase text-[#557042]/80 mb-5">
              About
            </p>
            <h2 className="font-display not-italic text-[2.25rem] sm:text-[2.75rem] md:text-[3.25rem] text-[#2f3d26] mb-12 text-center leading-[1.08] tracking-[-0.03em]">
              Green Summer Collective
            </h2>
          </Reveal>
          <div className="space-y-7 text-[#5c5a55] text-[17px] leading-[1.7] font-normal">
            <Reveal from="up" delay={50}>
              <p>
                At Green Summer Collective, we believe in the power of digital growth that is both fresh and enduring.
                Our name embodies our philosophy: a commitment to renewal, abundant opportunity, and the continuous
                thriving of your business in the digital space. We are more than an agency; we are a creative ecosystem
                dedicated to building long-term success, not just quick results.
              </p>
            </Reveal>
            <Reveal from="up" delay={120}>
              <p>
                Born from a vision by two founders to help brands break through the noise, we have evolved into a
                full-service collective. We are a powerhouse team of specialized strategists, storytellers, editors,
                and marketers, working seamlessly to elevate your brand. When you partner with us, you don't just
                hire one expert; you gain access to an entire creative force.
              </p>
            </Reveal>
            <Reveal from="up" delay={190}>
              <p>
                Our core services are designed to be a holistic solution for scaling your digital presence and building
                authority. We craft compelling Social Media Growth & Management strategies, produce high-quality Content
                Creation from filming to storytelling, design intuitive Websites, manage targeted Paid Advertising
                campaigns (Meta, Google), and develop comprehensive Branding & Digital Strategy.
              </p>
            </Reveal>
            <Reveal from="up" delay={260}>
              <p>
                We operate as an extension of your brand, focusing on authentic storytelling, consistency, and precision
                execution. We don't just capture attention; we convert it into real, lasting impact. Your growth is our
                shared mission.
              </p>
            </Reveal>
            <Reveal from="up" delay={330}>
              <p className="font-display not-italic text-[#3d5230] text-center text-xl md:text-2xl pt-8 leading-snug tracking-[-0.02em]">
                Let's cultivate your digital future together.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-28 md:py-32 px-6 sm:px-10 bg-[#f3efe8]">
        <div className="max-w-6xl mx-auto">
          <Reveal from="up">
            <p className="font-sans text-center text-[11px] sm:text-xs font-medium tracking-[0.22em] uppercase text-[#557042]/80 mb-5">
              What we do
            </p>
            <h2 className="font-display not-italic text-[2.25rem] sm:text-[2.75rem] md:text-[3.5rem] text-[#2f3d26] mb-4 text-center leading-[1.08] tracking-[-0.03em]">
              Our services
            </h2>
            <p className="font-sans text-center text-[#6b6863] max-w-lg mx-auto mb-16 text-[15px] md:text-base leading-relaxed">
              Full-stack creative support built to feel like an in-house team.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {services.map((service, index) => (
              <Reveal
                key={index}
                from="up"
                delay={(index % 3) * 80 + Math.floor(index / 3) * 40}
              >
                <div className="group p-8 md:p-9 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e8e2d8] shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_24px_48px_-28px_rgba(47,61,38,0.12)] hover:border-[#d4cdc1] hover:shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_32px_56px_-24px_rgba(47,61,38,0.16)] transition-all duration-300 h-full">
                  <h3 className="font-display not-italic text-xl md:text-[1.35rem] text-[#2f3d26] mb-3 tracking-[-0.02em] leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-[#6b6863] text-[15px] leading-relaxed">{service.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section id="clients" className="py-28 md:py-32 px-6 sm:px-10 bg-[#faf8f5]">
        <Reveal from="up">
          <ClientsSection onClientClick={(clientId) => setSelectedClient(clientId)} />
        </Reveal>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-28 md:py-32 px-6 sm:px-10 bg-[#f3efe8]">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal from="up">
            <p className="font-sans text-[11px] sm:text-xs font-medium tracking-[0.22em] uppercase text-[#557042]/80 mb-5">
              Contact
            </p>
            <h2 className="font-display not-italic text-[2.25rem] sm:text-[2.75rem] md:text-[3.5rem] text-[#2f3d26] mb-4 leading-[1.08] tracking-[-0.03em]">
              Get in touch
            </h2>
            <p className="font-sans text-[#6b6863] max-w-md mx-auto mb-14 text-[15px] leading-relaxed">
              Tell us what you're building — we'll help it grow.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
            <Reveal from="left" delay={80}>
              <a
                href="mailto:greensummercollective@gmail.com"
                className="flex items-center justify-center gap-3 p-6 md:p-7 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e8e2d8] text-[#3d392f] hover:border-[#d4cdc1] shadow-[0_20px_40px_-32px_rgba(47,61,38,0.25)] transition-all duration-300 font-sans text-[15px]"
              >
                <Mail className="text-[#557042] shrink-0" size={22} />
                <span className="break-all text-left sm:text-center">greensummercollective@gmail.com</span>
              </a>
            </Reveal>

            <Reveal from="right" delay={80}>
              <a
                href="tel:437-215-1855"
                className="flex items-center justify-center gap-3 p-6 md:p-7 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e8e2d8] text-[#3d392f] hover:border-[#d4cdc1] shadow-[0_20px_40px_-32px_rgba(47,61,38,0.25)] transition-all duration-300 font-sans text-[15px]"
              >
                <Phone className="text-[#557042] shrink-0" size={22} />
                <span>437-215-1855</span>
              </a>
            </Reveal>
          </div>

          <Reveal from="up" delay={200}>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm font-medium flex items-center gap-2 px-6 py-3 bg-[#2f3d26] text-white rounded-full hover:bg-[#3d5230] transition-all duration-300 shadow-[0_8px_24px_-8px_rgba(47,61,38,0.4)]"
                title="Instagram"
              >
                <Share2 size={18} />
                <span>Instagram</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm font-medium flex items-center gap-2 px-6 py-3 bg-[#2f3d26] text-white rounded-full hover:bg-[#3d5230] transition-all duration-300 shadow-[0_8px_24px_-8px_rgba(47,61,38,0.4)]"
                title="LinkedIn"
              >
                <Share2 size={18} />
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:greensummercollective@gmail.com"
                className="font-sans text-sm font-medium flex items-center gap-2 px-6 py-3 bg-white text-[#2f3d26] rounded-full border border-[#e0d9ce] hover:border-[#c9c0b2] hover:bg-[#faf8f5] transition-all duration-300"
                title="Email"
              >
                <Mail size={18} />
                <span>Email</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 px-6 bg-[#2a3224] text-white/95 text-center border-t border-white/[0.06]">
        <p className="font-sans text-[13px] tracking-wide text-white/90">© 2026 Green Summer Collective. All rights reserved.</p>
        <p className="mt-3 font-display not-italic text-lg text-white/70 tracking-[-0.02em]">
          Your partners in lasting digital prosperity
        </p>
      </footer>
    </div>
  );
}
