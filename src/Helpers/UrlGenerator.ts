import fs from "fs"

export const uploadFileToS3 = async (filePath: string): Promise<string | null> => {
    const formData = new FormData();
    
    const fileBuffer = await fs.promises.readFile(filePath);
    
    const blob = new Blob([fileBuffer]);
    formData.append("file", blob);

    try {
      const response = await fetch("http://localhost:7310/api/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      return data.Location; // The AWS S3 file URL
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };
  