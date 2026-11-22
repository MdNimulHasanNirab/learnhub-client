"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (result.error) setError(result.error.message || "Unable to log in");
    else router.push("/dashboard");
  }

  return (
    <main className="content">
      <div className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1 className="page-title">Log in</h1>
        {error && <p className="alert">{error}</p>}
        <form className="form" onSubmit={submit}>
          <label>Email<input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Password<input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          <button className="button button-primary" type="submit" disabled={loading}>{loading ? "Logging in…" : "Log in"}</button>
        </form>
        <p className="muted">New to LearnHub? <Link href="/register"><strong>Create an account</strong></Link></p>
      </div>
    </main>
  );
}
