import fs from "fs";
import dotenv from "dotenv";
import { cropVideo } from "./Helpers/VideoProcessing.js";
import { startUploadSession } from "./Helpers/upload.js";
import config from "./config.js";
import { fetchRedditVideo } from "./Helpers/redditDownloader.js";

dotenv.config();

const VIDEO_NUMBER_FILE = "./videoNumber.json";

// Load video number from file
const loadVideoNumber = (): number => {
  try {
    if (fs.existsSync(VIDEO_NUMBER_FILE)) {
      const data = fs.readFileSync(VIDEO_NUMBER_FILE, "utf-8");
      return JSON.parse(data).videoNumber || 1;
    }
  } catch (error) {
    console.error("⚠ Error loading video number:", error);
  }
  return 1; // Default value
};

// Ensure output directory exists
const ensureOutputDirExists = (outputDir: string) => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
};

const runUploadProcess = async (mediaType: string, botConfig: any) => {
  console.log(`🔄 Upload process started for ${mediaType}`);

  try {
    // ✅ Fetch Reddit video with title
    const redditVideo = await fetchRedditVideo(
      botConfig.subreddit,
      botConfig.outputDir
    );

    if (!redditVideo) {
      console.log("⚠ No video to upload this round.");
      return;
    }

    console.log(`🎬 Reddit video downloaded: ${redditVideo.fileName}`);

    // ✅ Randomly select hashtags
    let hashtags = "";
    if (Array.isArray(botConfig.hashtags) && botConfig.hashtags.length > 0) {
      const shuffled = [...botConfig.hashtags].sort(() => 0.5 - Math.random());

      // ✅ Ensure at least 6 hashtags, max all available
      const count = Math.min(
        Math.floor(Math.random() * 5) + 6, // 6–10 hashtags
        shuffled.length
      );

      hashtags = shuffled.slice(0, count).join(" ");
    }

    // ✅ Use config caption + Reddit title + random hashtags
    const caption = `${redditVideo.title}\n\n${botConfig.caption} ${hashtags}`;

    await startUploadSession(
      botConfig.accessToken,
      botConfig.outputDir,
      redditVideo.fileName,
      (mediaType = "VIDEO"),
      caption
    );

    console.log("✅ Upload completed successfully");
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
  ensureOutputDirExists(botConfig.outputDir);
  console.log(`🚀 Starting ${bot.name} | Video Number: ${loadVideoNumber()}`);

  await runUploadProcess("VIDEO", botConfig);

  setInterval(async () => {
    console.log("⏳ Running scheduled upload...");
    await runUploadProcess("VIDEO", botConfig);
  }, 4 * 60 * 60 * 1000); // Every 2 hours
};

// Start selected bots based on CLI arguments
const selectedBots = process.argv.slice(2).map(Number);
if (selectedBots.length === 0) {
  console.log("⚡ No specific bots selected. Running all bots...");
}

(selectedBots.length
  ? selectedBots
  : Object.keys(config.bots).map(Number)
).forEach(startBot);
