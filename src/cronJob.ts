import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import { uploadVideosForAllAccounts } from "./sdk.js";

const cronExpression = process.env.POST_INTERVAL_CRON || "0 * * * *"; // default: every hour

console.log(`Scheduling LinkedIn video upload: ${cronExpression}`);

  try {
    await uploadVideosForAllAccounts();
    console.log(`[${new Date().toLocaleString()}] LinkedIn upload job completed.`);
  } catch (err) {
    console.error(`[${new Date().toLocaleString()}] Job failed:`, err);
  }
