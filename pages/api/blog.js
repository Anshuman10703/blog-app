// pages/api/blog.js
import { ddbDocClient, s3Client } from '@/lib/aws-dynamodb'; // Import both clients
import { ScanCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { PutObjectCommand } from "@aws-sdk/client-s3"; // Import S3 PutObjectCommand
import formidable from 'formidable';
import fs from 'fs';

// Crucial: Disable default body parser for formidable to work
export const config = {
  api: {
    bodyParser: false,
  },
};

// IMPORTANT: Replace with your actual DynamoDB and S3 bucket names
const BLOG_TABLE_NAME = "Blogs"; // Ensure this matches your DynamoDB table name exactly
const S3_BUCKET_NAME = "blog-app-images-2025"; // YOUR S3 bucket name (e.g., my-blog-app-images-2025)
const AWS_REGION = process.env.MY_AWS_REGION;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // --- CORRECTION HERE ---
      // Change from 'new formidable.IncomingForm()' to 'formidable()'
      const form = formidable(); // <--- CORRECTED LINE

      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });

      // Extract text fields (formidable v3+ fields are arrays of strings)
      const title = fields.title?.[0];
      const description = fields.description?.[0];
      const category = fields.category?.[0];
      const author = fields.author?.[0];
      const authorImg = fields.authorImg?.[0];

      let imageUrl = "";

      // Handle image file upload to S3
      const blogImageFile = files.image?.[0];
      if (blogImageFile && blogImageFile.filepath) {
        const fileContent = fs.readFileSync(blogImageFile.filepath);
        const s3Key = `blog-images/${Date.now()}-${blogImageFile.originalFilename}`; // Unique key in S3

        const s3UploadParams = {
          Bucket: S3_BUCKET_NAME,
          Key: s3Key,
          Body: fileContent,
          ContentType: blogImageFile.mimetype,
          ACL: 'public-read' // Make the image publicly readable
        };

        await s3Client.send(new PutObjectCommand(s3UploadParams));
        imageUrl = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${s3Key}`;
        console.log("Image uploaded to S3:", imageUrl);
      } else {
        // Fallback or error if image is required but not provided
        console.warn("No image file provided for blog post.");
        // You might want to return an error here if an image is mandatory
        // return res.status(400).json({ success: false, msg: "Blog image is required." });
      }

      // Generate a unique ID for the blog post
      const id = Date.now().toString();
      const date = new Date().toISOString();

      // Save blog post details (including S3 image URL) to DynamoDB
      await ddbDocClient.send(new PutCommand({
        TableName: BLOG_TABLE_NAME,
        Item: {
          id: id, // Partition Key
          title,
          description,
          category,
          author,
          image: imageUrl, // Store the S3 public URL
          authorImg,
          date,
        },
      }));
      return res.status(201).json({ success: true, msg: "Blog added successfully" });
    } catch (error) {
      console.error("Error adding blog or uploading image to S3:", error);
      return res.status(500).json({ success: false, msg: "Error adding blog or uploading image." });
    }
  } else if (req.method === 'GET') {
    try {
      const { Items } = await ddbDocClient.send(new ScanCommand({ TableName: BLOG_TABLE_NAME }));
      return res.status(200).json({ blogs: Items });
    } catch (error) {
      console.error("Error fetching blogs from DynamoDB:", error);
      return res.status(500).json({ success: false, msg: "Error fetching blogs." });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query; // Assuming ID comes from query parameter for DELETE

      await ddbDocClient.send(new DeleteCommand({
        TableName: BLOG_TABLE_NAME,
        Key: {
          id: id, // Specify the primary key to delete
        },
      }));
      return res.status(200).json({ success: true, msg: "Blog deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog from DynamoDB:", error);
      return res.status(500).json({ success: false, msg: "Error deleting blog." });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}