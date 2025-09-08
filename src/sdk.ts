import { linkedInAccounts } from "./config.js";
import { getVideoAndTextForAccount } from "./Helpers/Aigenerator.js";
import { postTextForAccount, uploadImageForAccount } from "./Helpers/VideoProcessing.js";

async function getAuthorUrn(accessToken: string): Promise<string> {
  try {
    const response = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { sub: string };
    return `urn:li:person:${data.sub}`;
  } catch (err) {
    console.error("Error fetching LinkedIn URN:", err);
    return "";
  }
}

export async function uploadVideosForAllAccounts() {
  for (const [accountName, account] of Object.entries(linkedInAccounts)) {
    console.log(`\n---- Processing ${accountName} ----`);

    // Fetch the latest author URN dynamically
    let authorUrn = account.authorUrn;
    if (!authorUrn) {
      authorUrn = await getAuthorUrn(account.accessToken);
      if (!authorUrn) {
        console.warn(`Skipping ${accountName}: could not fetch author URN.`);
        continue;
      }
      account.authorUrn = authorUrn; // update config for future runs
    }

    // Pass both accountName and courseName to generate content
    const { postText,mediaPath } = await getVideoAndTextForAccount(accountName, account.courseName);

    await uploadImageForAccount(accountName, account.accessToken, authorUrn,mediaPath || "", postText);
  }
}
