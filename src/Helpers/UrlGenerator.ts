import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import fs from "fs"
// Initialize Firebase Storage
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Ensure this is correct
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
/**
 * Uploads a file to Firebase Storage and returns the public URL.
 * @param {string} filePath - The local path to the file.
 * @param {string} folderName - The folder name in Firebase Storage.
 * @param {string} mediaName - The name of the file in Firebase Storage.
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
export const uploadFileToFirebase = async (filePath: string, folderName: string, mediaName: string): Promise<string> => {
    try {
        // Read the file from the local file system
        const fileBuffer = await fs.promises.readFile(filePath);

        // Create a reference to the file in Firebase Storage
        const storageRef = ref(storage, `${folderName}/${mediaName}`);

        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, fileBuffer);

        // Get the public URL of the uploaded file
        const url = await getDownloadURL(snapshot.ref);
        console.log("File uploaded successfully. URL:", url);

        return url; // Return the public URL
    } catch (error) {
        console.error("Error uploading file to Firebase:", error);
        throw new Error("Failed to upload file to Firebase");
    }
};

/**
 * Retrieves a file from Firebase Storage (if needed).
 * @param {string} fileUrl - The public URL of the file.
 * @returns {Promise<void>}
 */
export const retrieveFileFromFirebase = async (fileUrl: string): Promise<void> => {
    // Implement retrieval logic here if needed
    console.log("Retrieving file from Firebase:", fileUrl);
};

