import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

type RuntimeEnv = {
  MONGODB_URI?: string;
  BETTER_AUTH_SECRET?: string;
};

const env = (
  globalThis as typeof globalThis & {
    process?: {
      env: RuntimeEnv;
    };
  }
).process?.env ?? {};

const mongodbUri = env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error("MONGODB_URI is not configured.");
}

if (!env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not configured.");
}

const mongoClient = new MongoClient(mongodbUri);

const database = mongoClient.db("moosclespro");

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

  secret: env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(database, {
    client: mongoClient,
  }),

  emailAndPassword: {
    enabled: true,
  },
});