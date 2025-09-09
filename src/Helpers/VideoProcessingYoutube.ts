import fs from "fs";
import { google } from "googleapis";

export async function uploadImageForAccountOnYoutube(
  accessToken: string,
  title: string,
  description: string,
  mediaPath: string,
  tags: string[] = [],
  privacyStatus: "private" | "public" | "unlisted" = "private"
): Promise<void> {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    console.log("Uploading video to YouTube...");

    const res = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
        },
        status: {
          privacyStatus,
        },
      },
      media: {
        body: fs.createReadStream(mediaPath),
      },
    });

    console.log("✅ Video uploaded successfully!");
    console.log(`▶️ Video ID: ${res.data.id}`);
    console.log(`URL: https://www.youtube.com/watch?v=${res.data.id}`);
  } catch (error: any) {
    console.error("❌ Error uploading video:", error.response?.data || error.message);
  }
}
