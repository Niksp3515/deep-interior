import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

let r2Client;

try {
  r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY,
      secretAccessKey: process.env.R2_SECRET_KEY,
    },
  });
  console.log("Cloudflare R2 S3 Client Initialized");
} catch (error) {
  console.error("Failed to initialize Cloudflare R2 Client:", error);
}

export { r2Client };
