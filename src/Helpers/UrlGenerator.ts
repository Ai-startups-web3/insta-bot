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


export const getRandomVideoFromS3 = async (): Promise<string | null> => {
  try {
    // List all objects in the randomTravelVideos folder
    const listParams: AWS.S3.ListObjectsV2Request = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Prefix: 'randomTravelVideos/',
    };

    const data = await s3.listObjectsV2(listParams).promise();
    
    if (!data.Contents || data.Contents.length === 0) {
      console.error("No videos found in the specified folder");
      return null;
    }

    // Filter out any non-video files (optional)
    const videoFiles = data.Contents.filter(file => {
      const extension = file.Key?.split('.').pop()?.toLowerCase();
      return extension && ['mp4', 'mov', 'avi', 'mkv'].includes(extension);
    });

    if (videoFiles.length === 0) {
      console.error("No valid video files found");
      return null;
    }

    // Select a random video
    const randomIndex = Math.floor(Math.random() * videoFiles.length);
    const randomVideo = videoFiles[randomIndex];

    // Construct the public URL
    const videoUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${randomVideo.Key}`;
    
    console.log("Selected random video:", videoUrl);
    return videoUrl;
  } catch (error) {
    console.error("Error getting random video:", error);
    return null;
  }
};




export const deleteVideoFromS3 = async (videoUrl: string): Promise<boolean> => {
  try {
    // Extract the S3 key from the URL
    const urlParts = videoUrl.split('.amazonaws.com/');
    if (urlParts.length < 2) {
      console.error("Invalid S3 URL format");
      return false;
    }

    const key = urlParts[1];
    
    // Verify the file is in the randomTravelVideos folder
    if (!key.startsWith('randomTravelVideos/')) {
      console.error("File is not in the randomTravelVideos folder");
      return false;
    }

    const deleteParams: AWS.S3.DeleteObjectRequest = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    };

    await s3.deleteObject(deleteParams).promise();
    console.log("Successfully deleted video:", key);
    return true;
  } catch (error) {
    console.error("Error deleting video:", error);
    return false;
  }
};