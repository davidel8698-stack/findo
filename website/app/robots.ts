import type { MetadataRoute } from "next";

/**
 * Robots.txt configuration for Findo website
 * Generates robots.txt at /robots.txt
 *
 * Configuration:
 * - Allow all crawlers to index all pages
 * - Reference sitemap for discovery
 * - Block Next.js internal routes
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://findo.co.il";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/_next/",      // Next.js internal routes
          "/api/",        // API routes (if any)
          "/*.json$",     // JSON files
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
