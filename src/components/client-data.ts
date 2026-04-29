export interface Client {
  id: number;
  name: string;
  logo: string;
  description: string;
  industry: string;
  services: string[];
  results: string[];
}

export const clients: Client[] = [
  {
    id: 1,
    name: 'Gracie Jiu-Jitsu Bolton',
    logo: '/clients/gracie-jiu-jitsu.png',
    description:
      'A martial arts academy focused on Brazilian Jiu-Jitsu fundamentals, competition training, and confidence-building programs for all ages in Bolton.',
    industry: 'Martial Arts & Fitness',
    services: ['Local SEO', 'Landing Page Optimization', 'Social Media Content', 'Paid Lead Campaigns'],
    results: [
      'Consistent monthly trial-class bookings from digital channels',
      'Improved map-pack visibility for local BJJ and martial arts searches',
      'Higher conversion rate from Instagram profile to inquiry form',
      'Clear beginner-to-advanced content funnel across social platforms',
    ],
  },
  {
    id: 2,
    name: 'Shinobi Tech',
    logo: '/clients/shinobi-tech.png',
    description:
      'A performance-driven tech brand blending bold identity design with product-led storytelling, focused on scaling visibility in competitive digital markets.',
    industry: 'Technology',
    services: ['Brand Identity', 'Website Redesign', 'Video Creative', 'Performance Marketing'],
    results: [
      'Stronger branded recall across social and landing pages',
      'Increased qualified demo requests from ad traffic',
      'Higher engagement rates on short-form campaign creatives',
      'Improved funnel consistency from awareness to conversion',
    ],
  },
];
