import { auth } from "../src/lib/auth.js";

export const runtime = "nodejs";

export default async function handler(request: Request) {
    return auth.handler(request);
}