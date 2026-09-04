import { MongoClient } from "mongodb";

type RuntimeEnv = {
  MONGODB_URI?: string;
  NODE_ENV?: string;
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
  throw new Error(
    "MONGODB_URI is not configured.",
  );
}

type GlobalMongo = typeof globalThis & {
  __moosclesMongoClient?: MongoClient;
};

const globalMongo =
  globalThis as GlobalMongo;

export const mongoClient =
  globalMongo.__moosclesMongoClient ??
  new MongoClient(mongodbUri);

if (env.NODE_ENV !== "production") {
  globalMongo.__moosclesMongoClient =
    mongoClient;
}

export const database =
  mongoClient.db("moosclespro");