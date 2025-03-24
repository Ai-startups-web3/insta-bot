import fs from "fs";

export const uploadFileToS3 = async (filePath: string): Promise<string | null> => {
  const formData = new FormData();

  // Read the file as a buffer
  const fileBuffer = await fs.promises.readFile(filePath);
  
  // Determine the file name and MIME type
  const fileName = filePath.split("/").pop() || "upload.mp4";
  const mimeType = "video/mp4"; // Adjust based on actual file type
  
  // Create a Blob with correct MIME type
  const blob = new Blob([fileBuffer], { type: mimeType });
  
  // Append with filename
  formData.append("file", blob, fileName);

  console.log(blob);

  try {
    const response = await fetch("http://localhost:7310/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("data", data);

    return data.Location; // The AWS S3 file URL
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};
