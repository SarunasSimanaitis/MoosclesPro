import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthFrame from "../components/auth/AuthFrame";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { authClient } from "../lib/auth-client";
import { DEMO_EMAIL, DEMO_ENABLED, DEMO_PASSWORD } from "../lib/demo";
import { clearPrivateClientState } from "../lib/privateClientState";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";
  const notice =
    (location.state as { notice?: string } | null)?.notice;

  async function signIn(credentials: { email: string; password: string }) {
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email(credentials);

      if (result.error) {
        setError(result.error.message ?? "Check your email and password, then try again.");
        return;
      }

      const session = await authClient.getSession();
      if (!session.data?.user) {
        setError("Your credentials were accepted, but we couldn't establish a session. Please try again.");
        return;
      }

      clearPrivateClientState();
      navigate(from, { replace: true });
    } catch (requestError) {
      console.error("Failed to sign in:", requestError);
      setError("We couldn’t reach the sign-in service. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void signIn({ email: email.trim(), password });
  }

  function handleDemo() {
    if (!DEMO_EMAIL || !DEMO_PASSWORD) return;
    void signIn({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
  }

  /* Arriving from a "Try the demo" link (/login?demo=1) signs in straight away. */
  const wantsDemo = DEMO_ENABLED && new URLSearchParams(location.search).get("demo") === "1";
  const demoStarted = useRef(false);

  useEffect(() => {
    if (!wantsDemo || demoStarted.current) return;
    demoStarted.current = true;
    handleDemo();
    // Runs once on arrival; handleDemo only reads build-time constants.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsDemo]);

  return (
    <AuthFrame
      eyebrow="Welcome back"
      title="Good to have you here."
      description="Sign in to pick up where your training left off."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {notice && (
          <div className="rounded-[var(--radius-md)] border border-[var(--primary)]/25 bg-[var(--primary-soft)] px-4 py-3 text-sm font-medium leading-relaxed text-[var(--primary)]">
            {notice}
          </div>
        )}

        <Input
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          leadingIcon={<Mail size={17} />}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Your password"
          leadingIcon={<LockKeyhole size={17} />}
        />

        {error && (
          <div role="alert" className="rounded-[var(--radius-md)] border border-[var(--danger)]/25 bg-[var(--danger-soft)] px-4 py-3 text-sm font-medium leading-relaxed text-[var(--danger)]">
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full">
          {loading ? "Signing in…" : "Sign in"}
          {!loading && <ArrowRight size={17} />}
        </Button>

        {DEMO_ENABLED && (
          <div className="border-t border-[var(--border)] pt-5">
            <Button type="button" variant="secondary" disabled={loading} onClick={handleDemo} className="w-full">
              Try the demo account
            </Button>
            <p className="mt-2 text-center text-xs text-[var(--text-muted)]">
              No sign-up needed. The demo account is shared, so its data may change.
            </p>
          </div>
        )}
      </form>

      <p className="mt-7 text-center text-sm text-[var(--text-muted)]">
        New to MoosclesPro?{" "}
        <Link to="/register" className="font-bold text-[var(--primary)] hover:text-[var(--primary-hover)]">
          Create an account
        </Link>
      </p>
    </AuthFrame>
  );
}
