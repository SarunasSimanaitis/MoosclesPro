import { MongoClient, type MongoClientOptions } from "mongodb";

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
  __moosclesMindsetIndexes?: Promise<void>;
};

const globalMongo = globalThis as GlobalMongo;

/*
 * MongoDB documents these as optional constructor settings. This narrow assertion
 * keeps the documented partial options compatible with TypeScript 6's stricter
 * MongoClientOptions declarations without changing the runtime configuration.
 */
const mongoOptions = {
  connectTimeoutMS: 10_000,
  serverSelectionTimeoutMS: 10_000,
  socketTimeoutMS: 20_000,
} as unknown as MongoClientOptions;

export const mongoClient =
  globalMongo.__moosclesMongoClient ??
  new MongoClient(mongodbUri, mongoOptions);

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

export function ensureMindsetIndexes(): Promise<void> {
  if (globalMongo.__moosclesMindsetIndexes) {
    return globalMongo.__moosclesMindsetIndexes;
  }

  globalMongo.__moosclesMindsetIndexes = connectMongo()
    .then(() =>
      Promise.all([
        database.collection("mindsetPosts").createIndex({ id: 1 }, { unique: true }),
        database.collection("mindsetPosts").createIndex({ kind: 1, createdAt: -1 }),
        database.collection("mindsetComments").createIndex({ postId: 1, createdAt: -1 }),
      ]),
    )
    .then(() => undefined)
    .catch((error: unknown) => {
      globalMongo.__moosclesMindsetIndexes = undefined;
      throw error;
    });

  return globalMongo.__moosclesMindsetIndexes;
}
