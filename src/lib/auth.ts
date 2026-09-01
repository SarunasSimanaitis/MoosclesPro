import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import {
  database,
  mongoClient,
} from "./mongodb.js";

type RuntimeEnv = {
  BETTER_AUTH_SECRET?: string;
};

const env = (
  globalThis as typeof globalThis & {
    process?: {
      env: RuntimeEnv;
    };
  }
).process?.env ?? {};

const betterAuthSecret =
  env.BETTER_AUTH_SECRET;

if (!betterAuthSecret) {
  throw new Error(
    "BETTER_AUTH_SECRET is not configured.",
  );
}

export const auth = betterAuth({
  appName: "MoosclesPro",

  baseURL: {
    allowedHosts: [
      "localhost:5173",
      "localhost:3000",
      "mooscles-pro.vercel.app",
      "*.vercel.app",
    ],
    protocol: "auto",
  },

  secret: betterAuthSecret,

  database: mongodbAdapter(database, {
    client: mongoClient,
  }),

  emailAndPassword: {
    enabled: true,
  },
});