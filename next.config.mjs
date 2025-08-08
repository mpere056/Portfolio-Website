/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure we are not using legacy export pipeline
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
