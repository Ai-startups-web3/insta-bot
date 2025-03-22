import fs from 'fs';
import dotenv from 'dotenv';
import { cropVideo } from './Helpers/VideoProcessing.js';
import { startUploadSession } from './Helpers/upload.js';
import config from './config.js';

dotenv.config();

// Ensure output directory exists
const ensureOutputDirExists = (outputDir: string) => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
};

// Handles video upload and retries on failure
const runUploadProcess = async (mediaType: string, botConfig: any, retryCount = 0) => {
  console.log(`🔄 Upload process started for ${mediaType} | Video Number: ${botConfig.videoNumber}`);

  try {
    // Process the video
    await cropVideo(
      botConfig.inputVideo,
      botConfig.outputDir,
      botConfig.beepAudio,
      botConfig.videoNumber,
      botConfig.videoDuration,
      botConfig.episode
    );

    console.log("Video Cropped");
    
    // Upload video
    const coverUrl = "";
    const thumbOffset = "";
    await startUploadSession(
      botConfig.accessToken,
      botConfig.outputDir,
      botConfig.videoNumber,
      mediaType = "VIDEO" ,
      botConfig.caption,
      botConfig.hashtags,
      coverUrl,
      thumbOffset,
      botConfig.location
    );

    console.log("✅ Upload completed successfully");
    botConfig.videoNumber++;
  } catch (error) {
    console.error(`❌ Error uploading ${mediaType}:`, error);
    // if (retryCount < 3) {
    //   console.log(`🔄 Retrying upload (${retryCount + 1}/3)`);
    //   await new Promise(resolve => setTimeout(resolve, 5000));
    //   await runUploadProcess(mediaType, botConfig, retryCount + 1);
    // } else {
    //   console.error(`⚠️ Max retries reached. Skipping this upload.`);
    // }
  }
};

// Starts the bot's scheduled uploads
const startBot = async (botId: number) => {
  const bot = config.bots[botId as keyof typeof config.bots];

  if (!bot) {
    console.error(`⚠️ Bot ${botId} not found in config.`);
    return;
  }

  const botConfig = bot.videoConfig;
  ensureOutputDirExists(botConfig.inputVideo);
  ensureOutputDirExists(botConfig.outputDir);
  console.log(`🚀 Starting ${bot.name} | Video Number: ${botConfig.videoNumber}`);

  await runUploadProcess("VIDEO", botConfig);

  if (botConfig.isPaused) {
    console.log("⏸ Bot is paused. Skipping scheduled upload.");
    return;
  }

  setInterval(async () => {
    if (botConfig.isPaused) {
      console.log("⏸ Bot is still paused. Skipping upload.");
      return;
    }
    console.log("⏳ Running scheduled upload...");
    await runUploadProcess("VIDEO", botConfig);
  }, 4 * 60 * 60 * 1000); // Every 4 hours
};

// Start selected bots based on CLI arguments
const selectedBots = process.argv.slice(2).map(Number);
if (selectedBots.length === 0) {
  console.log("⚡ No specific bots selected. Running all bots...");
}

(selectedBots.length ? selectedBots : Object.keys(config.bots).map(Number)).forEach(startBot);
