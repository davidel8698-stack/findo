import type { LocalBusiness, WithContext } from "schema-dts";

/**
 * LocalBusiness JSON-LD Schema
 * Provides local business information for Google Search/Maps
 *
 * @see https://schema.org/LocalBusiness
 */
export const localBusinessSchema: WithContext<LocalBusiness> = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Findo",
  description: "מערכת אוטומטית לצמיחה עסקית - ניהול ביקורות, איסוף לידים ואופטימיזציה של Google Business Profile",
  url: "https://findo.co.il",
  image: "https://findo.co.il/og-image.png",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IL",
  },
  geo: {
    "@type": "GeoCoordinates",
    // Tel Aviv coordinates as general Israel location
    latitude: 32.0853,
    longitude: 34.7818,
  },
  areaServed: {
    "@type": "Country",
    name: "Israel",
  },
  serviceArea: {
    "@type": "Country",
    name: "Israel",
  },
  currenciesAccepted: "ILS",
  paymentAccepted: "Credit Card",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
    ],
    opens: "09:00",
    closes: "18:00",
  },
};
