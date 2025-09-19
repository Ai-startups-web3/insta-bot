import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import Snoowrap from "snoowrap";

const execAsync = promisify(exec);

// ✅ Safe filename generator
function sanitizeFileName(name: string): string {
  return name.replace(/[^a-z0-9]/gi, "_").toLowerCase().slice(0, 50);
}

// ✅ Initialize Snoowrap
const reddit = new Snoowrap({
  userAgent: "reddit-bot/1.0",
  clientId: process.env.REDDIT_CLIENT_ID!,
  clientSecret: process.env.REDDIT_CLIENT_SECRET!,
  username: process.env.REDDIT_USERNAME!,
  password: process.env.REDDIT_PASSWORD!,
});

function getVideoInfo(post: any): { dashUrl: string; title: string } | null {
  if (post.is_video && post.media?.reddit_video?.dash_url) {
    return { dashUrl: post.media.reddit_video.dash_url, title: post.title };
  }
  if (post.crosspost_parent_list?.length) {
    const cross = post.crosspost_parent_list[0];
    if (cross.is_video && cross.media?.reddit_video?.dash_url) {
      return { dashUrl: cross.media.reddit_video.dash_url, title: cross.title };
    }
  }
  return null;
}

export async function fetchRedditVideo(
  source: string, // can be r/... or t/...
  outputDir: string
): Promise<{ filePath: string; fileName: string; title: string } | null> {
  try {
    let videoPosts: { dashUrl: string; title: string }[] = [];

    if (source.startsWith("r/")) {
      // ✅ Subreddit path
      const subName = source.replace("r/", "");
      console.log(`🎯 Fetching from subreddit: r/${subName}`);

      const posts = await reddit.getSubreddit(subName).getTop({
        time: "day",
        limit: 200,
      });

      videoPosts = posts
        .map((p: any) => getVideoInfo(p))
        .filter(Boolean) as { dashUrl: string; title: string }[];
    } else if (source.startsWith("t/")) {
      // ✅ Topic path (search instead of JSON API)
      const topic = source.replace("t/", "").replace(/\/$/, "");
      console.log(`🎯 Searching posts for topic: ${topic}`);

      const posts = await reddit.search({
        query: topic,
        sort: "top",
        time: "day",
        limit: 100,
      });

      videoPosts = posts
        .map((p: any) => getVideoInfo(p))
        .filter(Boolean) as { dashUrl: string; title: string }[];
    } else {
      throw new Error("Source must start with r/ or t/");
    }

    if (videoPosts.length === 0) {
      console.log(`⚠ No Reddit-hosted video found in ${source}`);
      return null;
    }

    // 🎲 Pick random video
    const { dashUrl, title } =
      videoPosts[Math.floor(Math.random() * videoPosts.length)];
    const safeName = sanitizeFileName(title);
    const finalFile = path.join(outputDir, `reddit_${safeName}.mp4`);

    console.log(`⬇ Downloading random video with audio: ${title}`);
    await execAsync(`ffmpeg -y -i "${dashUrl}" -c copy "${finalFile}"`);

    console.log(`✅ Final video with audio saved at ${finalFile}`);
    return {
      filePath: finalFile,
      fileName: path.basename(finalFile),
      title,
    };
  } catch (err: any) {
    console.error("❌ Reddit video fetch error:", source, err.message);
    return null;
  }
}
