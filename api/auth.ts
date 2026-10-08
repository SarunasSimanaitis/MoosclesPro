import { auth } from "../src/lib/auth.js";
import { connectMongo } from "../src/lib/mongodb.js";

export const runtime = "nodejs";

export default {
  async fetch(request: Request) {
    try {
      await connectMongo();
      return await auth.handler(request);
    } catch (error) {
      console.error("Authentication API error:", error);
      return Response.json(
        { message: "Authentication is temporarily unavailable. Please try again." },
        { status: 503 },
      );
    }
  },
};
