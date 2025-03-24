import path from 'path';
import dotenv from "dotenv";

dotenv.config();

export default {
  bots: {
    1: {
      name: "Bot 1",
      videoConfig: {
        inputVideo: path.resolve(process.cwd(), "dist/assets/input/videoToPost.mp4"),
        outputDir: path.resolve(process.cwd(), "dist/assets/output"),
        beepAudio: path.resolve(process.cwd(), "dist/assets/beep.mp3"),
        videoNumber: 3,
        videoDuration: 30,
        episode: 1,
        accessToken: process.env.cn_btc,
        caption: "Video 1 Caption",
        hashtags: ["#hashtag1", "#hashtag2"],
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
