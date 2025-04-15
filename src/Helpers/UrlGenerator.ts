import fs from "fs";
import AWS from "aws-sdk";
import { s3 } from "../config.js";


export const uploadFileToS3 = async (filePath: string): Promise<string | null> => {
  try {
    // Read the file as a buffer
    const fileBuffer = await fs.promises.readFile(filePath);
    
    // Determine the file name and MIME type
    const fileName = filePath.split("/").pop() || "upload.mp4";
    const mimeType = "video/mp4"; // Adjust based on actual file type

    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `uploads/${Date.now()}_${fileName}`,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: "public-read", // Ensure public access if needed
    };

    const data = await s3.upload(params).promise();
    console.log("Upload successful:", data.Location);
    return data.Location; // The AWS S3 file URL
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};