import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Statik kapaklar (public/covers) ve admin'den yüklenenler (/media/[id])
    localPatterns: [
      { pathname: "/covers/**", search: "" },
      { pathname: "/media/**", search: "" },
    ],
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    globalNotFound: true,
    serverActions: {
      // Admin kapak yüklemesi (sunucuda küçültülür)
      bodySizeLimit: "12mb",
    },
    proxyClientMaxBodySize: "12mb",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
