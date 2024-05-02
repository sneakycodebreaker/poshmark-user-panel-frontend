/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'di2ponv0v5otw.cloudfront.net',
          },
          {
            protocol: 'https',
            hostname: 'dtpmhvbsmffsz.cloudfront.net',
          },
          {
            protocol: 'https',
            hostname: 'd2zlsagv0ouax1.cloudfront.net',
          },
        ],
      },
};

export default nextConfig;
