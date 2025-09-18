import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import { uploadVideosForAllAccounts } from "./sdk.js";

// Schedule at 10:00 AM every day IST
const cronExpression = "0 10 * * *";

// --- CORE FUNCTION (Runs INSTANTLY) ---
async function startUploadJob() {
  console.log(
    `[${new Date().toLocaleString()}] Starting LinkedIn upload job...`
  );
  try {
    await uploadVideosForAllAccounts();
    console.log(
      `[${new Date().toLocaleString()}] LinkedIn upload job completed.`
    );
  } catch (err) {
    console.error(
      `[${new Date().toLocaleString()}] Job failed:`,
      err
    );
  }
}

// --- DELAYED FUNCTION (Used for the Scheduled Cron) ---
async function executeUploadJobWithRandomDelay() {
  // Generates a random delay between 0 and 59 minutes, inclusive.
  const randomDelayMinutes = Math.floor(Math.random() * 60);
  const delayMs = randomDelayMinutes * 60 * 1000;

  console.log(
    `[${new Date().toLocaleString()}] Scheduled job triggered. Will run after ${randomDelayMinutes} minutes.`
  );

  setTimeout(startUploadJob, delayMs);
}

// 1. Run the job TRULY IMMEDIATELY when the script starts
console.log(`[${new Date().toLocaleString()}] Running IMMEDIATE LinkedIn upload job now!`);
await startUploadJob(); // <-- This is the change! It calls the core function directly.

// ---
// 2. Schedule for 10:00 AM IST daily (with the random 10-11 AM window)
console.log(`Scheduling LinkedIn video upload between 10-11 AM daily...`);

cron.schedule(cronExpression, executeUploadJobWithRandomDelay, {
  timezone: "Asia/Kolkata" // Important for IST
});

console.log(`[${new Date().toLocaleString()}] Scheduled for 10:00 AM IST daily (with random delay).`);