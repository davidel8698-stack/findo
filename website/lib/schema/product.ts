import type { Product, WithContext } from "schema-dts";

/**
 * Product JSON-LD Schema
 * Describes Findo as a SaaS product with pricing
 *
 * @see https://schema.org/Product
 */
export const productSchema: WithContext<Product> = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Findo",
  description: "מערכת אוטומטית לניהול ביקורות, איסוף לידים ואופטימיזציה של Google Business Profile. העסק שלך עובד 24/7.",
  brand: {
    "@type": "Brand",
    name: "Findo",
  },
  image: "https://findo.co.il/og-image.png",
  url: "https://findo.co.il",
  category: "Software as a Service",
  offers: {
    "@type": "Offer",
    price: "350",
    priceCurrency: "ILS",
    priceValidUntil: "2027-12-31",
    availability: "https://schema.org/InStock",
    url: "https://findo.co.il",
    seller: {
      "@type": "Organization",
      name: "Findo",
    },
    // Price qualification
    description: "מנוי חודשי + 500 ₪ הקמה חד פעמית",
  },
  // Aggregate rating placeholder - update with real data when available
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "127",
    bestRating: "5",
    worstRating: "1",
  },
};
