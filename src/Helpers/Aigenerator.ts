import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI with API key
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function getVideoAndTextForAccount(
  accountName: string,
  courseName: string,
) {
  try {
    // Save files in current working directory
    const accountDir = path.join(process.cwd(), accountName);
    await fs.mkdir(accountDir, { recursive: true });

    // Detect last day file
    const files = await fs.readdir(accountDir);
    const dayFiles = files
      .map((f) => {
        const match = f.match(/learnDay(\d+)\.txt/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter(Boolean) as number[];

    const lastDay = dayFiles.length ? Math.max(...dayFiles) : 0;
    const nextDay = lastDay + 1;

    const oldFilePath =
      lastDay > 0 ? path.join(accountDir, `learnDay${lastDay}.txt`) : null;
    const newFilePath = path.join(accountDir, `learnDay${nextDay}.txt`);
    const imageFilePath = path.join(accountDir, `learnDay${nextDay}.png`);

    let oldContent = "";
    if (oldFilePath) {
      oldContent = await fs.readFile(oldFilePath, "utf-8");
    } else {
      oldContent = `This is the first lesson for the course: ${courseName}.`;
    }

    // Generate the LinkedIn post text + image description in strict format
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are creating LinkedIn posts for a daily learning journey.

Course Name: ${courseName}
Yesterday's lesson: ${oldContent}

Generate output STRICTLY in the following JSON format (NO extra text):
{
  "postText": "Final LinkedIn post text here (100-150 words).",
  "imageDescription": "A clear, descriptive prompt for an AI image generator that reflects the post content."
}

Rules for postText:
- Start with "Day ${nextDay} of ${courseName} Journey"
- Personal tone: "I learned..."
- Explain one key concept simply
- Include a short example
- End with a thought or question
- Add hashtags like #LearningToCode and one with the course name

Rules for imageDescription:
- Make the style clean, realtic, as its clicked by phone or took screenshot on laptop
`,
    });

    let postText = "";
    let imageDescription = "";

    if (response.text) {
      try {
        let cleanedText = response.text
  .replace(/```json/gi, "")
  .replace(/```/g, "")
  .trim();

const parsed = JSON.parse(cleanedText);

        postText = parsed.postText;
        imageDescription = parsed.imageDescription;
      } catch (err) {
        console.error("Failed to parse AI response:", err);
        postText = `Day ${nextDay} of ${courseName} Journey\n\nCouldn't parse AI response.`;
        imageDescription = `A clean VS Code screenshot on a MacBook related to ${courseName}.`;
      }
    } else {
      postText = `Day ${nextDay} of ${courseName} Journey\n\nFallback text.`;
      imageDescription = `A clean VS Code screenshot on a MacBook related to ${courseName}.`;
    }

    // Save the generated text
    await fs.writeFile(newFilePath, postText, "utf-8");

    // Generate and save the image using AI's imageDescription
    const imageResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: imageDescription,
    });

    if (
      imageResponse.candidates &&
      imageResponse.candidates[0] &&
      imageResponse.candidates[0].content &&
      imageResponse.candidates[0].content.parts
    ) {
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          await fs.writeFile(imageFilePath, buffer);
          console.log(`Image saved as ${imageFilePath}`);
        }
      }
    } else {
      console.warn("AI image generation failed. No candidates found.");
    }

    // Delete older lessons, keep only last 3 days
    const updatedFiles = await fs.readdir(accountDir);
    const lessonFiles = updatedFiles
      .filter((f) => f.match(/learnDay(\d+)\.(txt|png)/))
      .sort((a, b) => {
        const dayA = parseInt(a.match(/learnDay(\d+)\.(txt|png)/)![1], 10);
        const dayB = parseInt(b.match(/learnDay(\d+)\.(txt|png)/)![1], 10);
        return dayB - dayA;
      });

    const filesToDelete = lessonFiles.slice(6);
    for (const file of filesToDelete) {
      await fs.unlink(path.join(accountDir, file));
      console.log(`Deleted old lesson file: ${file}`);
    }

    return { postText, day: nextDay, mediaPath: imageFilePath };
  } catch (err) {
    console.error("Error generating post text or image:", err);
    return { postText: "", day: null, mediaPath: null };
  }
}
