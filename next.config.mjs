/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.32', '172.20.10.5'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.32',
      },
      {
        protocol: 'http',
        hostname: '172.20.10.5',
      },
    ],
  },
};

export default nextConfig;
