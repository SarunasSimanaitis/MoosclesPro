import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthFrame from "../components/auth/AuthFrame";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { authClient } from "../lib/auth-client";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError(result.error.message ?? "Check your email and password, then try again.");
        return;
      }

      await authClient.getSession();
      navigate(from, { replace: true });
    } catch (requestError) {
      console.error("Failed to sign in:", requestError);
      setError("We couldn’t reach the sign-in service. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFrame
      eyebrow="Welcome back"
      title="Good to have you here."
      description="Sign in to pick up where your training left off."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
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
