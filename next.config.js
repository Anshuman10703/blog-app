/** @type {import('next').NextConfig} */
const nextConfig = {
  // Crucial for allowing file uploads via formidable in API routes
  api: {
    bodyParser: false, // Disable default body parser, formidable will handle it
  },
  // Configure domains for next/image component to load images from S3
  images: {
    // Using remotePatterns is more robust than just 'domains'
    remotePatterns: [
      {
        protocol: 'https',
        // IMPORTANT: Replace 'YOUR_S3_BUCKET_NAME' and 'YOUR_AWS_REGION'
        // This hostname must exactly match your S3 bucket's URL structure
        hostname: 'blog-app-images-2025.s3.us-west-1.amazonaws.com',
        port: '',
        pathname: '/**', // Allows any path within that bucket
      },
      {
        // If you have author images hosted elsewhere (like a public domain)
        // or if 'author_img.png' is served from your local public folder
        // You might need to adjust or remove this if author images are local or from a fixed domain.
        protocol: 'https', // or http
        hostname: '**', // Be careful with wildcard, restrict to known domains in production
      },
    ],
  },
};

module.exports = nextConfig;