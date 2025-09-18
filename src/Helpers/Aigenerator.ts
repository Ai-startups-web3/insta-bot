import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI with API key
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function getVideoAndTextForAccount(
  accountName: string,
  courseName: string
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

    // Generate the LinkedIn post text + image description
// Generate the LinkedIn post text + image description
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: `
You are helping me create authentic LinkedIn posts for a daily learning journey.  

Course Name: ${courseName}  
Yesterday's lesson: ${oldContent}  

Generate output STRICTLY in this JSON format (NO extra text):
{
  "postText": "Final LinkedIn post text here (80–150 words).",
  "imageDescription": "A Canva-style clean design or computer science diagram prompt that matches the post content."
}

Rules for postText:
- Start with "Day ${nextDay} of ${courseName} Journey"
- Write in a personal, reflective tone
- Summarize ONE key takeaway simply
- Use proper formatting with:
   * Paragraph breaks (\n\n)
   * Ordered lists (1., 2., 3.)
   * Unordered lists (- , •)
- Vary phrasing instead of always "I learned..."
- End with a thought, small insight, or question for others
- Add 3–5 relevant hashtags (mix niche & broad), e.g. #ReactJS #WebDevelopment #LearningJourney #Marketing #AI

Rules for imageDescription:
- Style: Canva-like, minimal, clean, professional
- Background: mostly white or light
- Content: diagrams, flowcharts, pseudo-code blocks, notebook-like figures, charts
- Must NOT look like stock photography or casual photos
- Keep it simple, clear, and educational
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
        imageDescription = `A clean Canva-style diagram with a white background explaining a ${courseName} concept.`;
      }
    } else {
      postText = `Day ${nextDay} of ${courseName} Journey\n\nFallback text.`;
      imageDescription = `A clean Canva-style diagram with a white background explaining a ${courseName} concept.`;
    }

    // Save the generated text
    await fs.writeFile(newFilePath, postText, "utf-8");

    // Generate and save the image using AI's imageDescription
    // Generate and save the image using AI's imageDescription
    const imageResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: `
Generate a professional, Canva-style design for LinkedIn posts.

Description: ${imageDescription}

Rules:
- Minimalist, flat, clean style
- White or light background
- Sharp text, diagrams, or charts (not handwritten, not blurry)
- Should look like a computer science or blockchain notebook figure
- No 3D renders, no fantasy elements, no coffee cups or desk setups
- Optimized for LinkedIn feed (landscape or square aspect ratio)

Examples:
1. A clean flowchart of blockchain transaction steps on a white canvas
2. A simple bar chart showing growth of users (styled like Canva infographic)
3. A notebook-style sketch of a blockchain network with labeled nodes
4. A whiteboard-style diagram of a smart contract process
5. A CS figure like a Merkle Tree or Hash Map visual with labeled boxes
6. A comparison chart (e.g., Web2 vs Web3) with bold text and icons
`,
    });

    let imageGenerated = false;

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
          imageGenerated = true;
        }
      }
    }

    // Fallback if image fails
    if (!imageGenerated) {
      console.warn("AI image generation failed. Using fallback prompt.");
      const fallbackPrompts = [
        `A Canva-style diagram with a white background explaining ${courseName} basics.`,
        `A clean flowchart on a whiteboard-like background showing ${courseName} concepts.`,
        `Minimal chart with boxes and arrows explaining one ${courseName} topic.`,
        `Notebook-style figure on a white background with neat diagrams.`,
      ];
      const fallbackPrompt =
        fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];

      await fs.writeFile(
        imageFilePath,
        Buffer.from(fallbackPrompt, "utf-8") // placeholder text fallback
      );
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
