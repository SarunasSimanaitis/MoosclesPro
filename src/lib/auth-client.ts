import { createAuthClient } from "better-auth/react";

export const authClient =
  createAuthClient({
    baseURL: window.location.origin,

    sessionOptions: {
      refetchOnWindowFocus: true,
      refetchWhenOffline: false,
      refetchInterval: 0,
    },
  });