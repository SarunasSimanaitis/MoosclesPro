import { auth } from "../src/lib/auth.js";

export const runtime = "nodejs";

export default function handler() {
    return new Response(
      auth ? "AUTH IMPORT WORKS" : "AUTH IMPORT FAILED",
    );
}