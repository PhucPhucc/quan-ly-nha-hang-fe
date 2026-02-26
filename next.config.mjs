/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["images.unsplash.com", "placehold.co"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
