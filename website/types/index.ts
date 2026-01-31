// Shared types for Findo sales website

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    whatsapp: string;
    email: string;
    phone: string;
  };
}

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  business: string;
  image: string;
  quote: string;
  metric?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}

// Animation variants for Motion
export interface AnimationVariant {
  hidden: Record<string, number | string>;
  visible: Record<string, number | string>;
}
