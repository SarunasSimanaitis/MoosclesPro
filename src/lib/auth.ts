import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { env } from "node:process";

const mongodbUri = env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error("MONGODB_URI is not configured.");
}

const mongoClient = new MongoClient(mongodbUri);

const database = mongoClient.db("moosclespro");

export const auth = betterAuth({
  appName: "MoosclesPro",

  baseURL: {
    allowedHosts: [
      "localhost:5173",
      "localhost:3000",
      "*.vercel.app",
    ],
  },

  database: mongodbAdapter(database, {
    client: mongoClient,
  }),

  emailAndPassword: {
    enabled: true,
  },
});