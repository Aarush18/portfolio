/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Opt into the React 19 compiler for better perf & DX
    reactCompiler: true,
  },
  images: {
    // Add remote hosts here if you display external images later
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
  eslint:{
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
