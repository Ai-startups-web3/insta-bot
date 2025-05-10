import path from 'path';
import dotenv from "dotenv";
import AWS from "aws-sdk";

dotenv.config();

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
        caption: "Want free travel? Join link in bio #travel #travelphotography #photography #nature #love #travelgram #photooftheday #adventure #instagram #wanderlust #explore #travelblogger #vacation #instatravel #beautiful #naturephotography #photo #trip #summer #traveling #travelling #beach #holiday ",
        hashtags: ["#childhood"],
        location: "Location1",
        isPaused: false,
        textOnVideo: "World Best Travel Places",
      }
    },
    2: {
      name: "Bot 2",
      videoConfig: {
        inputVideo: path.resolve(process.cwd(), "dist/assets/input/videoToPost.mp4"),
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        beepAudio: path.resolve(process.cwd(), "dist/assets/beep.mp3"),
        videoNumber: 1,
        videoDuration: 30,
        episode: 1,
        accessToken: process.env.samsara_world_trips1,
        caption: "Want free travel? Join link in bio #travel #travelphotography #photography #nature #love #travelgram #photooftheday #adventure #instagram #wanderlust #explore #travelblogger #vacation #instatravel #beautiful #naturephotography #photo #trip #summer #traveling #travelling #beach #holiday ",
        hashtags: ["#childhood"],
        location: "Location1",
        isPaused: false,
        textOnVideo: "World Best Travel Places",
      }
    },
    3: {
      name: "Bot 3",
      videoConfig: {
        inputVideo: path.resolve(process.cwd(), "dist/assets/input/videoToPost.mp4"),
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        beepAudio: path.resolve(process.cwd(), "dist/assets/beep.mp3"),
        videoNumber: 1,
        videoDuration: 30,
        episode: 1,
        accessToken: process.env.samsara_world_trips2,
        caption: "Earn free travel. Join link in bio #travel #travelphotography #photography #nature #love #travelgram #photooftheday #adventure #instagram #wanderlust #explore #travelblogger #vacation #instatravel #beautiful #naturephotography #photo #trip #summer #traveling #travelling #beach #holiday ",
        hashtags: ["#childhood"],
        location: "Location1",
        isPaused: false,
        textOnVideo: "World Best Travel Places In 4k",
      }
    },
    // 2: {
    //   name: "Bot 2",
    //   videoConfig: {
    //     inputVideo: path.resolve(process.cwd(), "assets/input/victoria1.mp4"),
    //     outputDir: path.resolve(process.cwd(), "assets/output"),
    //     beepAudio: path.resolve(process.cwd(), "assets/beep.mp3"),
    //     videoNumber: 2,
    //     videoDuration: 30,
    //     episode: 1,
    //     accessToken: process.env.samay_btc,
    //     caption: "Video 1 Caption",
    //     hashtags: ["#hashtag1", "#hashtag2"],
    //     location: "Location1",
    //     isPaused: false,
    //   }
    // }
  }
};


export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_KEY!,
  region: process.env.AWS_REGION!,
});
