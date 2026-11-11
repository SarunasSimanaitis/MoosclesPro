/*
 * Optional public demo account. When both values are set at build time
 * (Vercel environment variables), visitors get a "Try the demo" button and
 * can look around without registering. Leave them unset to hide it.
 */
export const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL as string | undefined;
export const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD as string | undefined;
export const DEMO_ENABLED = Boolean(DEMO_EMAIL && DEMO_PASSWORD);
