/** @type {import('next').NextConfig} */
const nextConfig = {
  // The 'api' object has been REMOVED from here, as it belongs inside API route files.

  // Images configuration for next/image to load from S3
  images: {
    // Using remotePatterns is the recommended way to configure external image domains in Next.js 13+
    remotePatterns: [
      {
        protocol: 'https',
        // IMPORTANT: Replace 'YOUR_S3_BUCKET_NAME' with the exact name of your S3 bucket
        // IMPORTANT: Replace 'YOUR_AWS_REGION' with your AWS region (e.g., 'ap-south-1', 'us-east-1')
        hostname: 'YOUR_S3_BUCKET_NAME.s3.YOUR_AWS_REGION.amazonaws.com',
        port: '', // Keep empty
        pathname: '/**', // Allows any path within that S3 bucket
      },
      // You might also need this if your authorImg is coming from a different dynamic source or CDN
      // (Be cautious with 'h_stname: "**"' in production, it allows any hostname)
      {
        protocol: 'https', // or http if applicable
        hostname: '**', // Broad wildcard, narrow down if possible (e.g., 'another-image-cdn.com')
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;