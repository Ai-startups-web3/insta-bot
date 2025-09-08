import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import { uploadVideosForAllAccounts } from "./sdk.js";

// Schedule at 9:00 AM every day
const cronExpression = "0 9 * * *";

console.log(`Scheduling LinkedIn video upload between 9-10 AM daily...`);

cron.schedule(cronExpression, async () => {
  // Generate random delay between 0 and 59 minutes
  const randomDelayMinutes = Math.floor(Math.random() * 60);
  const delayMs = randomDelayMinutes * 60 * 1000;

  console.log(
    `[${new Date().toLocaleString()}] Job triggered. Will run after ${randomDelayMinutes} minutes.`
  );

  setTimeout(async () => {
    console.log(
      `[${new Date().toLocaleString()}] Starting LinkedIn upload job after delay...`
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
  }, delayMs);
});
