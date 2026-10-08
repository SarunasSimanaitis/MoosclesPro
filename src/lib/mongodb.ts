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
  throw new Error(
    "MONGODB_URI is not configured. Add your MongoDB Atlas connection string to the Vercel project environment variables.",
  );
}

type GlobalMongo = typeof globalThis & {
  __moosclesMongoClient?: MongoClient;
  __moosclesMongoConnection?: Promise<void>;
  __moosclesMongoIndexes?: Promise<void>;
};

const globalMongo = globalThis as GlobalMongo;

export const mongoClient =
  globalMongo.__moosclesMongoClient ??
  new MongoClient(mongodbUri, {
    connectTimeoutMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 20_000,
  });

if (env.NODE_ENV !== "production") {
  globalMongo.__moosclesMongoClient = mongoClient;
}

export const database = mongoClient.db("moosclespro");

export function connectMongo(): Promise<void> {
  if (!globalMongo.__moosclesMongoConnection) {
    globalMongo.__moosclesMongoConnection = mongoClient
      .connect()
      .then(() => undefined)
      .catch((error: unknown) => {
        globalMongo.__moosclesMongoConnection = undefined;
        throw error;
      });
  }

  return globalMongo.__moosclesMongoConnection;
}

export function ensureWorkoutIndexes(): Promise<void> {
  if (globalMongo.__moosclesMongoIndexes) {
    return globalMongo.__moosclesMongoIndexes;
  }

  globalMongo.__moosclesMongoIndexes = connectMongo()
    .then(() =>
      Promise.all([
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
          .createIndex({ userId: 1, id: 1 }),
      ]),
    )
    .then(() => undefined)
    .catch((error: unknown) => {
      globalMongo.__moosclesMongoIndexes = undefined;
      throw error;
    });

  return globalMongo.__moosclesMongoIndexes;
}
