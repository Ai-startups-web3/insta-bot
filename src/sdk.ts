import fs from 'fs';
import dotenv from 'dotenv';
import { cropVideo } from './Helpers/VideoProcessing.js';
import { startUploadSession } from './Helpers/upload.js';
import config from './config.js';

dotenv.config();

const VIDEO_NUMBER_FILE = './videoNumber.json';

// Load video number from file
const loadVideoNumber = (): number => {
  try {
    if (fs.existsSync(VIDEO_NUMBER_FILE)) {
      const data = fs.readFileSync(VIDEO_NUMBER_FILE, 'utf-8');
      return JSON.parse(data).videoNumber || 1;
    }
  } catch (error) {
    console.error("⚠ Error loading video number:", error);
  }
  return 1; // Default value
};

// Save video number to file
const saveVideoNumber = (videoNumber: number) => {
  try {
    fs.writeFileSync(VIDEO_NUMBER_FILE, JSON.stringify({ videoNumber }, null, 2), 'utf-8');
  } catch (error) {
    console.error("⚠ Error saving video number:", error);
  }
};

// Ensure output directory exists
const ensureOutputDirExists = (outputDir: string) => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
};

// Handles video upload and retries on failure
const runUploadProcess = async (mediaType: string, botConfig: any, retryCount = 0) => {
  botConfig.videoNumber = loadVideoNumber(); // Load before upload
  console.log(`🔄 Upload process started for ${mediaType} | Video Number: ${botConfig.videoNumber}`);

  try {
    // Process the video
    await cropVideo(
      botConfig.inputVideo,
      botConfig.outputDir,
      botConfig.beepAudio,
      botConfig.videoNumber,
      botConfig.videoDuration,
      botConfig.episode,
      botConfig.textOnVideo
    );

    console.log("🎬 Video Cropped");
    const currentDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    // Upload video
    const coverUrl = "";
    const thumbOffset = "";
    await startUploadSession(
      botConfig.accessToken,
      botConfig.outputDir,
      botConfig.videoNumber,
      mediaType="VIDEO",
      `${botConfig.caption}\n\n Video Posted on ${currentDate}\n${botConfig.hashtags}`, 
      botConfig.hashtags,
      coverUrl,
      thumbOffset,
      botConfig.location
    );

    console.log("✅ Upload completed successfully");

    // Increment video number and save
    botConfig.videoNumber++;
    saveVideoNumber(botConfig.videoNumber);
  } catch (error) {
    console.error(`❌ Error uploading ${mediaType}:`, error);
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
  console.log(`🚀 Starting ${bot.name} | Video Number: ${loadVideoNumber()}`);

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
  }, 2 * 60 * 60 * 1000); // Every 2 hours
};

// Start selected bots based on CLI arguments
const selectedBots = process.argv.slice(2).map(Number);
if (selectedBots.length === 0) {
  console.log("⚡ No specific bots selected. Running all bots...");
}

(selectedBots.length ? selectedBots : Object.keys(config.bots).map(Number)).forEach(startBot);
