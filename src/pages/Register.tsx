import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthFrame from "../components/auth/AuthFrame";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
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

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError(result.error.message ?? "Unable to create your account. Please try again.");
        return;
      }

      await authClient.getSession();
      navigate(from, { replace: true });
    } catch (requestError) {
      console.error("Failed to create account:", requestError);
      setError("We couldn’t reach the registration service. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFrame
      eyebrow="Your next chapter"
      title="Make your work count."
      description="Create your account and give every workout a place to build on."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          label="Your name"
          type="text"
          autoComplete="name"
          required
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="How should we address you?"
          leadingIcon={<UserRound size={17} />}
        />
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
          label="Create a password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          hint="Use at least 8 characters."
          leadingIcon={<LockKeyhole size={17} />}
        />

        {error && (
          <div role="alert" className="rounded-[var(--radius-md)] border border-[var(--danger)]/25 bg-[var(--danger-soft)] px-4 py-3 text-sm font-medium leading-relaxed text-[var(--danger)]">
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full">
          {loading ? "Creating account…" : "Create account"}
          {!loading && <ArrowRight size={17} />}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-[var(--primary)] hover:text-[var(--primary-hover)]">
          Sign in
        </Link>
      </p>
    </AuthFrame>
  );
}
