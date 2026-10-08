import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import {
  database,
  mongoClient,
} from "./mongodb.js";

type RuntimeEnv = {
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  VERCEL_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
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

function getOrigin(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(
      value.includes("://") ? value : `https://${value}`,
    );
    return url.origin;
  } catch {
    return undefined;
  }
}

function getHost(value: string | undefined): string | undefined {
  const origin = getOrigin(value);
  return origin ? new URL(origin).host : undefined;
}

const deploymentOrigins = [
  env.BETTER_AUTH_URL,
  env.VERCEL_URL,
  env.VERCEL_PROJECT_PRODUCTION_URL,
]
  .map(getOrigin)
  .filter((origin): origin is string => Boolean(origin));

const deploymentHosts = [
  env.BETTER_AUTH_URL,
  env.VERCEL_URL,
  env.VERCEL_PROJECT_PRODUCTION_URL,
]
  .map(getHost)
  .filter((host): host is string => Boolean(host));

export const auth = betterAuth({
  appName: "MoosclesPro",

  baseURL: env.BETTER_AUTH_URL ?? {
    allowedHosts: [
      "localhost:5173",
      "localhost:3000",
      "mooscles-pro.vercel.app",
      "*.vercel.app",
      ...deploymentHosts,
    ],
    protocol: "auto",
  },

  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://mooscles-pro.vercel.app",
    ...deploymentOrigins,
  ],

  secret: betterAuthSecret,

  database: mongodbAdapter(database, {
    client: mongoClient,
  }),

  emailAndPassword: {
    enabled: true,
  },
});
