import type { MetadataRoute } from "next";

/**
 * Sitemap configuration for Findo website
 * Generates sitemap.xml at /sitemap.xml
 *
 * Note: Currently single-page sales website.
 * Add more URLs as pages are added.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://findo.co.il";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // Add more pages here as the site grows
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },
  ];
}
