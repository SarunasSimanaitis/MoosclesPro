import { MongoClient } from "mongodb";

type RuntimeEnv = {
  MONGODB_URI?: string;
  NODE_ENV?: string;
};

const env = (
  globalThis as typeof globalThis & {
    process?: { env: RuntimeEnv };
  }
).process?.env ?? {};

const mongodbUri = env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error("MONGODB_URI is not configured.");
}

type GlobalMongo = typeof globalThis & {
  __moosclesMongoClient?: MongoClient;
  __moosclesMongoIndexes?: Promise<void>;
};

const globalMongo = globalThis as GlobalMongo;

export const mongoClient =
  globalMongo.__moosclesMongoClient ??
  new MongoClient(mongodbUri);

if (env.NODE_ENV !== "production") {
  globalMongo.__moosclesMongoClient = mongoClient;
}

export const database = mongoClient.db("moosclespro");

export function ensureWorkoutIndexes(): Promise<void> {
  if (globalMongo.__moosclesMongoIndexes) {
    return globalMongo.__moosclesMongoIndexes;
  }

  globalMongo.__moosclesMongoIndexes = Promise.all([
    database
      .collection("workoutSessions")
      .createIndex({ userId: 1, completedAt: -1 }),
    database
      .collection("workoutSessions")
      .createIndex({ userId: 1, routineId: 1, completedAt: -1 }),
    database
      .collection("routines")
      .createIndex({ userId: 1, updatedAt: -1 }),
    database
      .collection("routines")
      .createIndex({ userId: 1, id: 1 }, { unique: true }),
  ]).then(() => undefined);

  return globalMongo.__moosclesMongoIndexes;
}
