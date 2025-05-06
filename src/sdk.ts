import fs from 'fs';
import dotenv from 'dotenv';
import { cropVideo } from './Helpers/VideoProcessing.js';
import { fetchInstagramUserDetails, startUploadSession } from './Helpers/upload.js';
import config from './config.js';
import axios from 'axios';
import path from 'path';

dotenv.config();

interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  permalink?: string;
  caption?: string;
  username?: string;
}

const VIDEO_NUMBER_FILE = './videoNumber.json';

// Utility Functions
const loadVideoNumber = (): number => {
  try {
    if (fs.existsSync(VIDEO_NUMBER_FILE)) {
      const data = fs.readFileSync(VIDEO_NUMBER_FILE, 'utf-8');
      return JSON.parse(data).videoNumber || 1;
    }
  } catch (error) {
    console.error("⚠ Error loading video number:", error);
  }
  return 1;
};

const saveVideoNumber = (videoNumber: number) => {
  try {
    fs.writeFileSync(VIDEO_NUMBER_FILE, JSON.stringify({ videoNumber }, null, 2), 'utf-8');
  } catch (error) {
    console.error("⚠ Error saving video number:", error);
  }
};

const ensureOutputDirExists = (outputDir: string) => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
};



const getTopVideosForHashtag = async (accessToken: string, userId: string, hashtagId: string): Promise<InstagramMedia[]> => {
  try {
    const response = await axios.get(`https://graph.facebook.com/${hashtagId}/top_media`, {
      params: {
        user_id: userId,
        fields: 'id,media_type,media_url,permalink,caption,username',
        access_token: process.env.FbAccessToken
      }
    });
    console.log("response",response.data);
    
    return response.data.data.filter((item: InstagramMedia) => item.media_type === 'VIDEO');
  } catch (error:any) {
    console.error(`Error fetching top videos for hashtag ${hashtagId}:`, error.response.data);
    throw new Error(`Failed to get top videos for hashtag ${hashtagId}`);
  }
};

const downloadVideo = async (url: string, outputPath: string): Promise<void> => {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      timeout: 30000
    });

    const writer = fs.createWriteStream(outputPath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading video:', error);
    throw new Error('Failed to download video');
  }
};

const getHashtagId = async (accessToken: string, hashtag: string,instagramId:string): Promise<string> => {
  try {

    if (!instagramId) {
      throw new Error('No Instagram Business Account connected');
    }
    // 2. Search for hashtag
    const response = await axios.get(`https://graph.facebook.com/v18.0/ig_hashtag_search`, {
      params: {
        user_id: instagramId,
        q: hashtag,
        access_token: accessToken

      }
    });

    if (!response.data.data?.length) {
      throw new Error(`No hashtag found for ${hashtag}`);
    }

    return response.data.data[0].id;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error?.code === 190) {
      // Token is invalid, try refreshing
      console.log(error.response.data);
      
    }
    throw error;
  }
};

// Main Upload Process
const runUploadProcess = async (botConfig: any,botName:any, retryCount = 0) => {
  botConfig.videoNumber = loadVideoNumber();
  console.log(`🔄 Upload process started | Video Number: ${botConfig.videoNumber}`);

  try {
    // Select a random hashtag to search
    const hashtagToSearch = botConfig.hashtagsToSearch[
      Math.floor(Math.random() * botConfig.hashtagsToSearch.length)
    ];
    
    console.log(`🔍 Searching for videos with hashtag: #${hashtagToSearch}`);
    
    const userDetails=await fetchInstagramUserDetails(botConfig.accessToken);
    
    const hashtagId = await getHashtagId(
      botConfig.accessToken,
      hashtagToSearch,
      userDetails.igId
    );
    console.log("hashtagId",hashtagId);
    

    // Get top videos
    const topVideos = await getTopVideosForHashtag(
      botConfig.accessToken,
      botConfig.instagramUserId,
      hashtagId
    );
    
    if (topVideos.length === 0) {
      throw new Error(`No videos found for hashtag #${hashtagToSearch}`);
    }
    
    // Select a random video
    const selectedVideo = topVideos[Math.floor(Math.random() * topVideos.length)];
    console.log(`🎥 Selected video from @${selectedVideo.username}: ${selectedVideo.caption?.substring(0, 50)}...`);
    
    // Define download path
    const videoPath = path.join(
      botConfig.outputDir,
      `downloaded_video_${botConfig.videoNumber}.mp4`
    );
    
    // Download the video
    await downloadVideo(selectedVideo.media_url!, videoPath);
    console.log("✅ Video downloaded successfully");

    // Prepare caption
    const currentDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const originalCaption = selectedVideo.caption || botConfig.caption;
    const credit = selectedVideo.username ? `\n📷 Credit: @${selectedVideo.username}` : '';
    const hashtagsString = botConfig.hashtags.map((tag: string) => `#${tag}`).join(' ');
    
    const caption = `${originalCaption}\n\nReposted on ${currentDate}${credit}\n${hashtagsString}`;

    // Upload video
    await startUploadSession(
      botConfig.accessToken,
      botConfig.outputDir,
      `downloaded_video_${botConfig.videoNumber}`,
      "VIDEO",
      caption,
      botConfig.hashtags,
      "",
      "",
      botConfig.location
    );

    console.log("🚀 Upload completed successfully");

    // Update video number
    botConfig.videoNumber++;
    saveVideoNumber(botConfig.videoNumber);
    
    // Clean up
    fs.unlinkSync(videoPath);
  } catch (error:any) {
    console.error(`❌ Error in upload process: ${JSON.stringify(error.response?.data) || error.message}`);
    if (retryCount < 3) {
      console.log(`🔄 Retrying... Attempt ${retryCount + 1} of 3`);
      await new Promise(resolve => setTimeout(resolve, 5000 * (retryCount + 1)));
      await runUploadProcess(botConfig,botName, retryCount + 1);
    } else {
      console.error('❌ Max retries reached. Skipping this upload.');
    }
  }
};

// Bot Management
const startBot = async (botId: number) => {
  const bot = config.bots[botId as keyof typeof config.bots];

  if (!bot) {
    console.error(`⚠️ Bot ${botId} not found in config.`);
    return;
  }

  const botConfig = bot.videoConfig;
  const botName = bot.name;
  ensureOutputDirExists(botConfig.outputDir);
  console.log(`🚀 Starting ${bot.name} | Video Number: ${loadVideoNumber()}`);

  if (botConfig.isPaused) {
    console.log("⏸ Bot is paused. Skipping initial upload.");
  } else {
    await runUploadProcess(botConfig,botName);
  }

  // Schedule regular uploads
  setInterval(async () => {
    if (botConfig.isPaused) {
      console.log("⏸ Bot is paused. Skipping scheduled upload.");
      return;
    }
    console.log("⏳ Running scheduled upload...");
    await runUploadProcess(botConfig,botName);
  }, 2 * 60 * 60 * 1000); // Every 2 hours
};

// Initialize bots
const initializeBots = () => {
  const selectedBots = process.argv.slice(2).map(Number);
  const botsToStart = selectedBots.length 
    ? selectedBots 
    : Object.keys(config.bots).map(Number);

  botsToStart.forEach(startBot);
};

initializeBots();