import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
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
        email,
        password,
      });

      if (result.error) {
        setError(
          result.error.message ?? "Invalid email or password.",
        );
        return;
      }

      navigate(from, { replace: true });
    } catch (requestError) {
      console.error("Failed to sign in:", requestError);
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-6 sm:px-5 sm:py-8">
      <Link
        to="/"
        className="absolute left-4 top-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text)] sm:left-6 sm:top-6"
      >
        <ArrowLeft size={17} />
        Back
      </Link>

      <div className="w-full max-w-md">
        <div className="mb-6 text-center sm:mb-7">
          <Link
            to="/"
            className="text-2xl font-black tracking-tight text-[var(--text)] sm:text-3xl"
          >
            Mooscles<span className="text-[var(--primary)]">Pro</span>
          </Link>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
            Sign in and get straight back to training.
          </p>
        </div>

        <Card className="p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
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
            />

            {error && (
              <div
                role="alert"
                className="rounded-[var(--radius-md)] border border-[var(--danger)]/25 bg-[var(--danger-soft)] px-4 py-3 text-sm font-medium leading-relaxed text-[var(--danger)]"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
            >
              Create one
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}