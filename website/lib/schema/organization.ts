import type { Organization, WithContext } from "schema-dts";

/**
 * Organization JSON-LD Schema
 * Provides search engines with company information
 *
 * @see https://schema.org/Organization
 */
export const organizationSchema: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Findo",
  url: "https://findo.co.il",
  logo: "https://findo.co.il/logo.png",
  description: "מערכת אוטומטית לצמיחה עסקית - ניהול ביקורות, איסוף לידים ואופטימיזציה של Google Business Profile",
  foundingDate: "2024",
  founder: {
    "@type": "Person",
    name: "דוד אלמועלם",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "IL",
    addressLocality: "ישראל",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Hebrew", "English"],
  },
  sameAs: [
    // Add social media profiles as they're created
    // "https://www.facebook.com/findoil",
    // "https://www.linkedin.com/company/findo",
  ],
};
