import { auth } from "../src/lib/auth.js";

export default {
  fetch() {
    return new Response(
      auth ? "AUTH IMPORT WORKS" : "AUTH IMPORT FAILED",
    );
  },
};