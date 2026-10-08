import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { authClient } from "../lib/auth-client";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
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

    const result = await authClient.signUp.email({
      name,
      email,
      password,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to create account.");
      return;
    }

    navigate(from, { replace: true });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[var(--background)] px-5 py-10">
      <Link
        to="/"
        className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-semibold text-[var(--text-muted)] shadow-sm transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)] md:left-8 md:top-8"
      >
        <ArrowLeft size={17} />
        <span>Back</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="text-3xl font-black tracking-tight text-[var(--text)]"
          >
            Mooscles<span className="text-[var(--primary)]">Pro</span>
          </Link>

          <h1 className="mt-8 text-3xl font-black text-[var(--text)]">
            Create your account
          </h1>

          <p className="mt-2 text-[var(--text-muted)]">
            Start tracking your training and progress.
          </p>
        </div>

        <Card className="p-6 sm:p-7 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                id="name"
                label="Name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
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
            </div>

            <div>
              <Input
                id="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Card>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}