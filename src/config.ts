import path from 'path';
import dotenv from "dotenv";
import AWS from "aws-sdk";

dotenv.config();

export default {
  bots: {
    1: {
      name: "Bot 1",
      videoConfig: {
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        accessToken: process.env.samsara_world_trips,
        caption: "Want free travel? Join link in bio  ",
        hashtags: ["#funny", "#meme", "#comedy", "#lol", "#viral", "#dankmemes", "#laugh", "#funnymemes", "#relatable", "#humor", "#trending", "#hilarious","#fyp", "#rofl", "#epicfail", "#jokes", "#dailyfunny", "#memeoftheday", "#haha", "#entertainment"],
        subreddit: "funny",
      }
    },
  }
};

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_KEY!,
  region: process.env.AWS_REGION!,
});
