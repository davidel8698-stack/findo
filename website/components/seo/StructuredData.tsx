import Script from "next/script";
import {
  organizationSchema,
  localBusinessSchema,
  faqPageSchema,
  productSchema,
} from "@/lib/schema";

/**
 * StructuredData component
 * Renders JSON-LD structured data scripts for SEO
 *
 * Includes:
 * - Organization: Company info for Knowledge Panel
 * - LocalBusiness: Local search visibility
 * - FAQPage: FAQ rich results
 * - Product: Product listing with pricing
 *
 * Usage: Add to page.tsx to inject structured data into <head>
 */
export function StructuredData() {
  return (
    <>
      <Script
        id="schema-organization"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="schema-local-business"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <Script
        id="schema-faq-page"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageSchema),
        }}
      />
      <Script
        id="schema-product"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
    </>
  );
}
