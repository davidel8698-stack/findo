import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PostHog reverse proxy configuration
  // Routes analytics requests through the site domain to avoid ad blocker interference
  // This prevents 30-40% session loss from ad blockers
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },
  // Skip PostHog requests from middleware
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
