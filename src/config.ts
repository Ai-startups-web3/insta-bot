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
        videoNumber: 11,
        videoDuration: 30,
        episode: 1,
        accessToken: process.env.cn_btc,
        caption: "They only used 0.01% of their power 💀. Want to Earn crypto while wathcing movies. Join link in bio #dbz #dragonball #goku #vegeta #anime #animememes #shorts ",
        hashtags: ["#cartoon #funny #sinchan #memes #childhood"],
        location: "Location1",
        isPaused: false,
      }
    },
    2: {
      name: "Bot 1",
      videoConfig: {
        inputVideo: path.resolve(process.cwd(), "dist/assets/input/videoToPost1.mp4"),
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        beepAudio: path.resolve(process.cwd(), "dist/assets/beep.mp3"),
        videoNumber: 11,
        videoDuration: 30,
        episode: 1,
        accessToken: process.env.samay_btc,
        caption: "They only used 0.01% of their power 💀. Want to Earn crypto while wathcing movies. Join link in bio #dbz #dragonball #goku #vegeta #anime #animememes #shorts ",
        hashtags: ["#cartoon #funny #sinchan #memes #childhood"],
        location: "Location1",
        isPaused: false,
      }
    },
    3: {
      name: "Bot 3",
      videoConfig: {
        inputVideo: path.resolve(process.cwd(), "dist/assets/input/videoToPost2.mp4"),
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        beepAudio: path.resolve(process.cwd(), "dist/assets/beep.mp3"),
        videoNumber: 11,
        videoDuration: 30,
        episode: 1,
        accessToken: process.env.movies_eth,
        caption: "They only used 0.01% of their power 💀. Want to Earn crypto while wathcing movies. Join link in bio #dbz #dragonball #goku #vegeta #anime #animememes #shorts ",
        hashtags: ["#cartoon #funny #sinchan #memes #childhood"],
        location: "Location1",
        isPaused: false,
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
