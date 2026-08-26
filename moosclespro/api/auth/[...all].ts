import { auth } from "../../src/lib/auth.js";

export default {
  async fetch(request: Request) {
    return auth.handler(request);
  },
};