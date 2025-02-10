/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone build
  output: 'standalone',
  
  // Optimize build
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Handle MongoDB connection errors gracefully
  onError: async (err) => {
    console.error('Next.js build error:', err);
  },
  
  // Environment variables that should be available at build time
  env: {
    MONGODB_URI: process.env.MONGODB_URI
  }
};

export default nextConfig;
