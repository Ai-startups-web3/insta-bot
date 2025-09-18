// fetchRedditVideo.ts
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import dotenv from "dotenv";
import Snoowrap from "snoowrap";

dotenv.config();
const execAsync = promisify(exec);

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-z0-9]/gi, "_").toLowerCase().slice(0, 50);
}

const reddit = new Snoowrap({
  userAgent: "reddit-bot/1.0",
  clientId: process.env.REDDIT_CLIENT_ID!,
  clientSecret: process.env.REDDIT_CLIENT_SECRET!,
  username: process.env.REDDIT_USERNAME!,
  password: process.env.REDDIT_PASSWORD!,
});

interface VideoInfo {
  postUrl: string; // full Reddit post URL
  title: string;
}

function getVideoInfoFromPost(post: any): VideoInfo | null {
  if (post.is_video) {
    return { postUrl: `https://www.reddit.com${post.permalink}`, title: post.title };
  }
  if (post.crosspost_parent_list?.length) {
    const cross = post.crosspost_parent_list[0];
    if (cross.is_video) {
      return { postUrl: `https://www.reddit.com${cross.permalink}`, title: cross.title };
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

    if (!videoPosts.length) {
      console.log(`⚠ No Reddit-hosted video found in r/${subreddit}`);
      return null;
    }

    const { postUrl, title } = videoPosts[Math.floor(Math.random() * videoPosts.length)];
    const safeName = sanitizeFileName(title);
    const finalFile = path.join(outputDir, `reddit_${safeName}.mp4`);
    const finalAudioFile = path.join(outputDir, `reddit_${safeName}.mp3`);

    console.log(`⬇ Downloading video + audio from Reddit post: ${postUrl}`);
    console.log("ℹ️ yt-dlp debug: listing available formats...");

    // List formats for debugging
    try {
      const { stdout } = await execAsync(`yt-dlp --list-formats "${postUrl}"`);
      console.log("✅ Available formats:\n", stdout);
    } catch (listErr: any) {
      console.warn("⚠ Failed to list formats:", listErr.message);
    }

    // Attempt to download best video + best audio, merge to mp4
    try {
      console.log("ℹ️ Downloading best video + audio...");
      await execAsync(
        `yt-dlp -f bestvideo+bestaudio --merge-output-format mp4 -o "${finalFile}" "${postUrl}"`
      );
      console.log(`✅ Video with audio saved at ${finalFile}`);
    } catch (err: any) {
      console.warn("⚠ Failed to download bestvideo+bestaudio, trying fallback video-only...");
      await execAsync(
        `yt-dlp -f best --merge-output-format mp4 -o "${finalFile}" "${postUrl}"`
      );
      console.log(`✅ Fallback download complete: ${finalFile}`);
    }

    // Optional: extract audio separately as mp3
    try {
      console.log("ℹ️ Extracting audio as mp3...");
      await execAsync(
        `yt-dlp -f bestaudio -x --audio-format mp3 -o "${finalAudioFile}" "${postUrl}"`
      );
      console.log(`✅ Audio saved separately at ${finalAudioFile}`);
    } catch (audioErr: any) {
      console.warn("⚠ Failed to extract audio:", audioErr.message);
    }

    return { filePath: finalFile, fileName: path.basename(finalFile), title };
  } catch (err: any) {
    console.error("❌ Reddit video fetch error:", err.message);
    return null;
  }
}
