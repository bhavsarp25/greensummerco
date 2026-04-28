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
    name: 'Bloom & Co.',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=400&fit=crop',
    description: 'A boutique wellness brand focused on natural, sustainable products for modern living. Bloom & Co. came to us looking to establish their digital presence and build a community around mindful living.',
    industry: 'Wellness & Lifestyle',
    services: ['Brand Strategy', 'Social Media Management', 'Content Creation', 'Website Design'],
    results: [
      '250% increase in Instagram engagement',
      'Successful launch of e-commerce platform',
      'Built community of 50K+ followers in 6 months',
      'Consistent brand voice across all platforms'
    ]
  },
  {
    id: 2,
    name: 'Urban Nest Design',
    logo: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=400&fit=crop',
    description: 'An interior design studio specializing in contemporary urban spaces. We partnered with Urban Nest to showcase their portfolio and attract high-end residential clients through strategic digital marketing.',
    industry: 'Interior Design',
    services: ['Professional Photography', 'Website Creation', 'Digital Advertising', 'Content Creation'],
    results: [
      'Custom portfolio website with 3D virtual tours',
      '180% increase in qualified leads',
      'Featured in major design publications',
      'Expanded client base across 3 cities'
    ]
  },
  {
    id: 3,
    name: 'Peak Performance Labs',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    description: 'A sports science and training facility working with elite athletes. Peak Performance needed a bold digital strategy to match their innovative approach to athletic development and recovery.',
    industry: 'Sports & Fitness',
    services: ['Social Media Management', 'Video Production', 'Branding', 'Paid Advertising'],
    results: [
      'Athlete testimonial video series with 2M+ views',
      'Partnership with 5 professional sports teams',
      '300% growth in membership inquiries',
      'Established as thought leaders in sports science'
    ]
  },
  {
    id: 4,
    name: 'Artisan & Oak',
    logo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop',
    description: 'A handcrafted furniture maker combining traditional techniques with modern design. We helped Artisan & Oak tell their story and reach design-conscious consumers who value craftsmanship.',
    industry: 'Furniture & Crafts',
    services: ['Brand Development', 'E-commerce Website', 'Content Strategy', 'Photography'],
    results: [
      'Award-winning website design',
      '450% increase in online sales',
      'Secured retail partnerships with 15 boutiques',
      'Featured in design magazines and blogs'
    ]
  },
  {
    id: 5,
    name: 'Green Plate Café',
    logo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    description: 'A farm-to-table restaurant chain committed to sustainable, locally-sourced cuisine. Green Plate needed help building their brand story and connecting with conscious consumers across multiple locations.',
    industry: 'Food & Hospitality',
    services: ['Social Media Management', 'Food Photography', 'Local SEO', 'Digital Marketing'],
    results: [
      'Viral social media campaigns featuring local farmers',
      '90% increase in weekend reservations',
      'Successful expansion to 3 new locations',
      'Built loyal community of 75K+ followers'
    ]
  },
  {
    id: 6,
    name: 'TechFlow Solutions',
    logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop',
    description: 'A B2B software company providing workflow automation tools for enterprises. TechFlow partnered with us to modernize their brand and create content that simplifies complex technology for decision-makers.',
    industry: 'Technology',
    services: ['Website Redesign', 'LinkedIn Strategy', 'B2B Content Marketing', 'Lead Generation'],
    results: [
      'Modern, conversion-focused website',
      '220% increase in qualified B2B leads',
      'Thought leadership content strategy',
      'Improved demo request rate by 175%'
    ]
  }
];
