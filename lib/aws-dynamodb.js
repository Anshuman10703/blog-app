// lib/aws-dynamodb.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

// We still need the region, which is read from environment variables (MY_AWS_REGION)
const AWS_REGION = process.env.MY_AWS_REGION;

// Initialize the DynamoDB Client without explicit credentials
// The AWS SDK will automatically use the IAM Role associated with your Amplify App
const client = new DynamoDBClient({
  region: AWS_REGION,
  // NO 'credentials' object needed here anymore!
});

// Create the DynamoDB Document Client for easier item operations (Put, Get, Scan, Delete)
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Initialize the S3 Client without explicit credentials
// It will also automatically use the IAM Role associated with your Amplify App
const s3Client = new S3Client({
  region: AWS_REGION,
  // NO 'credentials' object needed here anymore!
});

// Export both clients for use in your API routes
export { ddbDocClient, s3Client };