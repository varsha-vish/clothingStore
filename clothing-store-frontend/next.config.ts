import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'www.trueclassictees.com',
      'picsum.photos',
      'img-1.kwcdn.com',
      'img.ltwebstatic.com',
      'm.media-amazon.com',
      'assets.theplace.com',
      'cdn.shopify.com',
      'img.ltwebstatic.com',
      'image.uniqlo.com',
      'encrypted-tbn1.gstatic.com',
      'oldnavy.gapcanada.ca',

    ],
  },
   eslint: {
        ignoreDuringBuilds: true,
      },
};

export default nextConfig;
