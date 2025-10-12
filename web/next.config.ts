// next.config.ts (or web/next.config.ts if the app is in /web)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Use ONE of these styles:

    // Option 1: remotePatterns (most flexible)
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      // add more hosts if you use them:
      // { protocol: "https", hostname: "cdn.your-domain.com" },
      // { protocol: "https", hostname: "images.unsplash.com" },
    ],

    // Option 2: domains (simple allow list)
    // domains: ["firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
