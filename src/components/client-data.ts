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
    logo: '/clients/gracie-jiu-jitsu-bolton.png',
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
    logo: '/clients/shinobi-tech.jpeg',
    description:
      'A combat-sports performance brand focused on premium sports finger tape for BJJ, grappling, and training. Their positioning emphasizes comfort, durability, athlete-tested reliability, and bamboo-derived materials.',
    industry: 'Sports Performance Equipment',
    services: ['Product Positioning', 'E-commerce Optimization', 'Athlete-Creator Content', 'Performance Marketing'],
    results: [
      'Clearer product messaging around athlete-tested performance and comfort',
      'Higher conversion intent from product-page traffic',
      'Stronger trust signals via founder/BJJ credibility storytelling',
      'Improved content alignment across social, product, and checkout funnel',
    ],
  },
];
