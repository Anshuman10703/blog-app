/** @type {import('next').NextConfig} */
const nextConfig = {
  // Crucial for allowing file uploads via formidable in API routes
  api: {
    bodyParser: false, // Disable default body parser, formidable will handle it
  },
  // Configure domains for next/image component to load images from S3
  images: {
    // Using remotePatterns is the recommended way to configure external image domains in Next.js 13+
    remotePatterns: [
      {
        protocol: 'https',
        // IMPORTANT: Use your ACTUAL S3 bucket name and the CORRECT AWS region for your bucket
        // Example: 'my-blog-app-images-2025.s3.us-west-1.amazonaws.com'
        hostname: 'blog-app-images-2025.s3.us-west-1.amazonaws.com', // <--- THIS MUST EXACTLY MATCH YOUR S3 URL'S HOSTNAME
        port: '', // Keep empty
        pathname: '/**', // Allows any path within that S3 bucket
      },
      { // Keep this if you have other dynamic images/icons (like assets.profile_icon if it's external)
        protocol: 'https',
        hostname: '**', // Broad wildcard, narrow down if possible (e.g., 'another-image-cdn.com')
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;