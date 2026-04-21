import type { NextConfig } from "next";

const backendUrl = new URL(
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4400",
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@mangarr/shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploads.mangadex.org",
        pathname: "/covers/**",
      },
      {
        protocol: "https",
        hostname: "s4.anilist.co",
        pathname: "/file/anilistcdn/media/**",
      },
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        pathname: "/images/manga/1/**",
      },
      {
        protocol: "http",
        hostname: backendUrl.hostname,
        port: backendUrl.port,
        pathname: "/image-proxy**",
      },
    ],
  },
};

export default nextConfig;
