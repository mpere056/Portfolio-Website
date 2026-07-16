/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/*': ['./src/content/**/*'],
  },
};

export default nextConfig;
