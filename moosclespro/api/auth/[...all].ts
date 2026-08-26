import { auth } from "../../src/lib/auth";

export default {
  async fetch(request: Request) {
    return auth.handler(request);
  },
};