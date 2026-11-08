import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authClient } from "../lib/auth-client";
import { clearPrivateClientState } from "../lib/privateClientState";

/** Signs the user out, verifies the session is gone and clears private client data. */
export function useSignOut() {
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  async function signOut() {
    if (signingOut) return;

    setError("");
    setSigningOut(true);

    try {
      const result = await authClient.signOut();
      if (result.error) {
        throw new Error(result.error.message ?? "Sign out failed.");
      }

      const sessionResult = await authClient.getSession();
      if (sessionResult.data?.user) {
        throw new Error("The current session is still active.");
      }

      clearPrivateClientState();
      navigate("/");
    } catch (signOutError) {
      console.error("Failed to sign out:", signOutError);
      setError("We couldn't sign you out. Check your connection and try again.");
    } finally {
      setSigningOut(false);
    }
  }

  return { signOut, signingOut, error };
}
