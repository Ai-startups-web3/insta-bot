import axios from "axios";
import fs from "fs";

const LINKEDIN_API_BASE = "https://api.linkedin.com/v2";

export async function uploadVideoForAccount(
  accountName: string,
  accessToken: string,
  authorUrn: string,
  videoPath: string,
  postText: string
) {
  try {
    // Step 1: Register the video upload
    const registerResponse = await axios.post(
      `${LINKEDIN_API_BASE}/assets?action=registerUpload`,
      {
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-video"],
          owner: authorUrn,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent"
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0"
        }
      }
    );

    const uploadUrl =
      registerResponse.data.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;
    const asset = registerResponse.data.value.asset;

    console.log(`[${accountName}] Upload URL: ${uploadUrl}`);
    console.log(`[${accountName}] Asset URN: ${asset}`);

    // Step 2: Upload the video
    const videoStream = fs.createReadStream(videoPath);
    await axios.put(uploadUrl, videoStream, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/octet-stream"
      }
    });

    console.log(`[${accountName}] Video uploaded successfully.`);

    // Step 3: Create the LinkedIn Post
    const postResponse = await axios.post(
      `${LINKEDIN_API_BASE}/ugcPosts`,
      {
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: postText
            },
            shareMediaCategory: "VIDEO",
            media: [
              {
                status: "READY",
                media: asset,
                title: {
                  text: "Uploaded Video"
                }
              }
            ]
          }
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0"
        }
      }
    );

    console.log(`[${accountName}] Post created successfully:`, postResponse.data);
  } catch (error: any) {
    console.error(`[${accountName}] Error:`, error.response?.data || error.message);
  }
}

export async function postTextForAccount(
  accountName: string,
  accessToken: string,
  authorUrn: string,
  postText: string
) {
  try {
    const postResponse = await axios.post(
      `${LINKEDIN_API_BASE}/ugcPosts`,
      {
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: postText
            },
            shareMediaCategory: "NONE" // No media for text-only post
          }
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0"
        }
      }
    );

    console.log(`[${accountName}] Text post created successfully:`, postResponse.data);
  } catch (error: any) {
    console.error(`[${accountName}] Error:`, error.response?.data || error.message);
  }
}


export async function uploadImageForAccount(
  accountName: string,
  accessToken: string,
  authorUrn: string,
  mediaPath: string,
  postText: string
) {
  try {
    // ✅ Step 1: Register image upload
    const registerResponse = await axios.post(
      `${LINKEDIN_API_BASE}/assets?action=registerUpload`,
      {
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"], // For images
          owner: authorUrn,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent"
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0"
        }
      }
    );

    const uploadUrl =
      registerResponse.data.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;
    const asset = registerResponse.data.value.asset;

    console.log(`[${accountName}] Upload URL: ${uploadUrl}`);
    console.log(`[${accountName}] Asset URN: ${asset}`);

    // ✅ Step 2: Upload the image
    const imageStream = fs.createReadStream(mediaPath);
    await axios.put(uploadUrl, imageStream, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "image/jpeg" // or "image/png"
      }
    });

    console.log(`[${accountName}] Image uploaded successfully.`);

    // ✅ Step 3: Create a LinkedIn Post with Image
    const postResponse = await axios.post(
      `${LINKEDIN_API_BASE}/ugcPosts`,
      {
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: postText
            },
            shareMediaCategory: "IMAGE",
            media: [
              {
                status: "READY",
                media: asset,
                title: {
                  text: "Uploaded Image"
                }
              }
            ]
          }
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0"
        }
      }
    );

    console.log(`[${accountName}] Image post created successfully:`, postResponse.data);
  } catch (error: any) {
    console.error(`[${accountName}] Error:`, error.response?.data || error.message);
  }
}
