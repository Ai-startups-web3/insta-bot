import path from 'path';
import dotenv from "dotenv";
import AWS from "aws-sdk";
import fs from 'fs';
import axios from 'axios';

dotenv.config();

// Updated config with proper hashtag arrays and Instagram user IDs
export default {
  bots: {
    1: {
      name: "Bot 1",
      videoConfig: {
        inputVideo: path.resolve(process.cwd(), "dist/assets/input/videoToPost.mp4"),
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        beepAudio: path.resolve(process.cwd(), "dist/assets/beep.mp3"),
        videoNumber: 1,
        videoDuration: 30,
        episode: 1,
        accessToken: process.env.samsara_world_trips,
        caption: "Earn free travel. Join link in bio",
        hashtags: ["travel", "adventure", "nature", "photography"], // Now an array of hashtags without #
        location: "Location1",
        isPaused: false,
        hashtagsToSearch: ["travel", "wanderlust", "adventure"] // Separate field for hashtags to search
      }
    },
    // 2: {
    //   name: "Bot 2",
    //   videoConfig: {
    //     inputVideo: path.resolve(process.cwd(), "dist/assets/input/videoToPost.mp4"),
    //     outputDir: path.resolve(process.cwd(), "dist/assets/output"),
    //     beepAudio: path.resolve(process.cwd(), "dist/assets/beep.mp3"),
    //     videoNumber: 1,
    //     videoDuration: 30,
    //     episode: 1,
    //     accessToken: process.env.samsara_world_trips1,
    //     caption: "Earn free travel. Join link in bio",
    //     hashtags: ["travel", "photography", "nature"],
    //     location: "Location1",
    //     isPaused: false,
    //     hashtagsToSearch: ["travelphotography", "naturelovers"]
    //   }
    // },
    // 3: {
    //   name: "Bot 3",
    //   videoConfig: {
    //     inputVideo: path.resolve(process.cwd(), "dist/assets/input/videoToPost.mp4"),
    //     outputDir: path.resolve(process.cwd(), "dist/assets/output"),
    //     beepAudio: path.resolve(process.cwd(), "dist/assets/beep.mp3"),
    //     videoNumber: 1,
    //     videoDuration: 30,
    //     episode: 1,
    //     accessToken: process.env.samsara_world_trips2,
    //     caption: "Earn free travel. Join link in bio",
    //     hashtags: ["travel", "vacation", "explore"],
    //     location: "Location1",
    //     isPaused: false,
    //     hashtagsToSearch: ["travelgram", "wanderer"]
    //   }
    // }
  }
};

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_KEY!,
  region: process.env.AWS_REGION!,
});