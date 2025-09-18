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
    courseName: "Reactjs For advanced Developers"
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
    courseName: "Reactjs For advanced Developers"
  },
  account7: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT7 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT7 || "",
    courseName: "Backend Development with Nodejs"
  },
  account8: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT8 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT8 || "",
    courseName: "Python for Data Science and AI"
  },
  account9: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT9 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT9 || "",
    courseName: "Personal Branding on LinkedIn for Tech Professionals"
  },

  account10: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT10 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT10 || "",
    courseName: "Metaverse and Virtual Reality for Businesses"
  },
  account11: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT11 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT11 || "",
    courseName: "Building a Career in AI and Emerging Tech"
  },
  account12: {
    accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT12 || "",
    authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT12 || "",
    courseName: "AI in Talent Acquisition and Recruitment"
  },
  // account13: {
  //   accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT28 || "",
  //   authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT28 || "",
  //   courseName: "TypeScript Mastery: From Basics to Advanced Patterns"
  // },
  // account14: {
  //   accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT29 || "",
  //   authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT29 || "",
  //   courseName: "DevOps with Docker and Kubernetes"
  // },
  // account15: {
  //   accessToken: process.env.LINKEDIN_TOKEN_ACCOUNT30 || "",
  //   authorUrn: process.env.LINKEDIN_AUTHOR_URN_ACCOUNT30 || "",
  //   courseName: "Machine Learning Engineering with Python"
  // }
};

