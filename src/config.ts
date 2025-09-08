import path from 'path';
import dotenv from "dotenv";
import AWS from "aws-sdk";
dotenv.config();

interface LinkedInAccount {
  accessToken: string;
  authorUrn: string;
  courseName: string;
}

export const linkedInAccounts: Record<string, LinkedInAccount> = {
  account1: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT1 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT1 || "",
    courseName: "AI in Healthcare: The Future of Medicine"
  },
  account2: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT2 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT2 || "",
    courseName: "Quantum Computing for Beginners"
  },
  account3: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT3 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT3 || "",
    courseName: "Robotics and Automation in Industries"
  },
  account4: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT4 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT4 || "",
    courseName: "Blockchain in Agriculture and Food Security"
  },
  account5: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT5 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT5 || "",
    courseName: "AR/VR in Education: Transforming Learning"
  },
  account6: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT6 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT6 || "",
    courseName: "The Rise of Medical Robots in Surgery"
  },
  account7: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT7 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT7 || "",
    courseName: "AI in Financial Trading and Stock Market"
  },
  account8: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT8 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT8 || "",
    courseName: "Precision Agriculture with IoT and Drones"
  },
  account9: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT9 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT9 || "",
    courseName: "Smart Cities and Urban Automation"
  },
  account10: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT10 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT10 || "",
    courseName: "AI-Powered Drug Discovery and Research"
  },
  account11: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT11 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT11 || "",
    courseName: "Autonomous Vehicles and Future Transport"
  },
  account12: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT12 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT12 || "",
    courseName: "Quantum AI: Next-Generation Computing"
  },
  account13: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT13 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT13 || "",
    courseName: "AI in Agriculture: Smart Farming Solutions"
  },
  account14: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT14 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT14 || "",
    courseName: "VR for Healthcare Training and Simulations"
  },
  account15: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT15 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT15 || "",
    courseName: "AI in Retail: Personalized Shopping"
  },
  account16: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT16 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT16 || "",
    courseName: "Blockchain for Supply Chain Transparency"
  },
  account17: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT17 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT17 || "",
    courseName: "Robotic Process Automation in Business"
  },
  account18: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT18 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT18 || "",
    courseName: "AI in Mental Health: Digital Therapy"
  },
  account19: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT19 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT19 || "",
    courseName: "Drone Technology in Disaster Management"
  },
  account20: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT20 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT20 || "",
    courseName: "Metaverse and Virtual Reality for Businesses"
  },
  account21: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT21 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT21 || "",
    courseName: "Personal Branding on LinkedIn for Professionals"
  },
  account22: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT22 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT22 || "",
    courseName: "Building a Career in AI and Emerging Tech"
  },
  account23: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT23 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT23 || "",
    courseName: "AI-Powered Career Growth Strategies"
  },
  account24: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT24 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT24 || "",
    courseName: "The Future of Work: Human + AI Collaboration"
  },
  account25: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT25 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT25 || "",
    courseName: "Green Tech and Sustainable Innovation"
  },
  account26: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT26 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT26 || "",
    courseName: "3D Printing in Healthcare and Manufacturing"
  },
  account27: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT27 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT27 || "",
    courseName: "Space Tech and Satellite Innovations"
  },
  account28: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT28 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT28 || "",
    courseName: "AI in Talent Acquisition and Recruitment"
  },
  account29: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT29 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT29 || "",
    courseName: "Future of Trading: AI and Algo Strategies"
  },
  account30: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT30 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT30 || "",
    courseName: "Augmented Reality in Marketing and Retail"
  }
};

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_KEY!,
  region: process.env.AWS_REGION!,
});
