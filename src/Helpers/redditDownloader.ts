import fs from "fs";
import path from "path";
import { fetch } from "undici";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// ✅ Safe filename generator
function sanitizeFileName(name: string): string {
  return name.replace(/[^a-z0-9]/gi, "_").toLowerCase().slice(0, 50);
}

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
  subreddit: string,
  outputDir: string
): Promise<{ filePath: string; fileName: string; title: string } | null> {
  try {
    console.log(`🎯 Selected subreddit: r/${subreddit}`);

    const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=20&t=day`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "reddit-bot/1.0",
        "Accept": "application/json",
      },
    });

    if (!res.ok)
      throw new Error(`Failed to fetch subreddit: ${res.status} ${res.statusText}`);

    const data: any = await res.json();
    const videoPosts = data.data.children
      .map((p: any) => getVideoInfo(p.data))
      .filter(Boolean) as { dashUrl: string; title: string }[];

    if (videoPosts.length === 0) {
      console.log(`⚠ No Reddit-hosted video found in r/${subreddit}`);
      return null;
    }

    // ✅ Pick a random video
    const { dashUrl, title } =
      videoPosts[Math.floor(Math.random() * videoPosts.length)];

    const safeName = sanitizeFileName(title);
    const finalFile = path.join(outputDir, `reddit_${safeName}.mp4`);

    console.log(`⬇ Downloading random video with audio: ${title}`);

    // ✅ Use ffmpeg to download + merge
    await execAsync(
      `ffmpeg -y -i "${dashUrl}" -c copy "${finalFile}"`
    );

    console.log(`✅ Final video with audio saved at ${finalFile}`);
    return { filePath: finalFile, fileName: path.basename(finalFile), title };
  } catch (err: any) {
    console.error("❌ Reddit video fetch error:", err.message);
    return null;
  }
}
