// fetchRedditVideo.ts
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import dotenv from "dotenv";
import Snoowrap from "snoowrap";

dotenv.config();

const execAsync = promisify(exec);

// ✅ Safe filename generator
function sanitizeFileName(name: string): string {
  return name.replace(/[^a-z0-9]/gi, "_").toLowerCase().slice(0, 50);
}

// ✅ Initialize Reddit API client
const reddit = new Snoowrap({
  userAgent: "reddit-bot/1.0",
  clientId: process.env.REDDIT_CLIENT_ID!,
  clientSecret: process.env.REDDIT_CLIENT_SECRET!,
  username: process.env.REDDIT_USERNAME!,
  password: process.env.REDDIT_PASSWORD!,
});

interface VideoInfo {
  videoUrl: string;
  audioUrl: string;
  title: string;
}

// ✅ Get video + audio DASH URLs
function getVideoInfoFromPost(post: any): VideoInfo | null {
  if (post.is_video && post.media?.reddit_video) {
    const videoUrl = post.media.reddit_video.fallback_url;
    const audioUrl = videoUrl.replace(/DASH_\d+/, "DASH_audio"); // Reddit audio stream URL
    return { videoUrl, audioUrl, title: post.title };
  }
  if (post.crosspost_parent_list?.length) {
    const cross = post.crosspost_parent_list[0];
    if (cross.is_video && cross.media?.reddit_video) {
      const videoUrl = cross.media.reddit_video.fallback_url;
      const audioUrl = videoUrl.replace(/DASH_\d+/, "DASH_audio");
      return { videoUrl, audioUrl, title: cross.title };
    }
  }
  return null;
}

export async function fetchRedditVideo(
  subreddit: string,
  outputDir: string
): Promise<{ filePath: string; fileName: string; title: string } | null> {
  try {
    console.log(`🎯 Selected subreddit: r/${subreddit}`);

    const posts = await reddit.getSubreddit(subreddit).getTop({ time: "day", limit: 50 });

    const videoPosts = posts
      .map((p: any) => getVideoInfoFromPost(p))
      .filter(Boolean) as VideoInfo[];

    if (videoPosts.length === 0) {
      console.log(`⚠ No Reddit-hosted video found in r/${subreddit}`);
      return null;
    }

    // Pick a random video
    const { videoUrl, audioUrl, title } = videoPosts[Math.floor(Math.random() * videoPosts.length)];
    const safeName = sanitizeFileName(title);
    const finalFile = path.join(outputDir, `reddit_${safeName}.mp4`);

    console.log(`⬇ Downloading video + audio: ${title}`);

    // ✅ Merge video + audio with ffmpeg
    await execAsync(
      `ffmpeg -y -i "${videoUrl}" -i "${audioUrl}" -c:v copy -c:a aac -strict experimental "${finalFile}"`
    );

    console.log(`✅ Final video saved at ${finalFile}`);
    return { filePath: finalFile, fileName: path.basename(finalFile), title };
  } catch (err: any) {
    console.error("❌ Reddit video fetch error:", err.message);
    return null;
  }
}
