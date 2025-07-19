// pages/api/email.js
import { ddbDocClient } from '@/lib/aws-dynamodb';
import { PutCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const EMAILS_TABLE_NAME = "Emails"; // Double-check this matches your AWS table name exactly

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // ... (Your existing POST code for subscribing, which is now working)
    try {
      const { email } = req.body;
      const date = new Date().toISOString();

      await ddbDocClient.send(new PutCommand({
        TableName: EMAILS_TABLE_NAME,
        Item: {
          email, // Partition Key
          date,
        },
      }));
      return res.status(201).json({ success: true, msg: "Subscribed successfully" });
    } catch (error) {
      console.error("Error subscribing email to DynamoDB:", error);
      return res.status(500).json({ success: false, msg: "Error subscribing." });
    }
  } else if (req.method === 'GET') { // <--- This is the method for listing subscriptions
    try {
      // Use ScanCommand to get all items from the subscriptions table
      // For large tables, consider implementing pagination or specific queries if needed.
      const { Items } = await ddbDocClient.send(new ScanCommand({ TableName: EMAILS_TABLE_NAME }));
      // Return the subscriptions as an array
      return res.status(200).json({ success: true, subscriptions: Items });
    } catch (error) {
      console.error("Error fetching subscriptions from DynamoDB:", error);
      return res.status(500).json({ success: false, msg: "Error fetching subscriptions." });
    }
  } else if (req.method === 'DELETE') {
    // ... (Your existing DELETE code)
    try {
        const { email } = req.body; // Assuming you send email in body to delete
        if (!email) {
            return res.status(400).json({ success: false, msg: "Email is required for deletion." });
        }
        await ddbDocClient.send(new DeleteCommand({
            TableName: EMAILS_TABLE_NAME,
            Key: {
                email: email,
            },
        }));
        return res.status(200).json({ success: true, msg: "Subscription deleted successfully" });
    } catch (error) {
        console.error("Error deleting subscription from DynamoDB:", error);
        return res.status(500).json({ success: false, msg: "Error deleting subscription." });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}