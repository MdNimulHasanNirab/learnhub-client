"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const result = await authClient.signUp.email({ name, email, password });
    setLoading(false);
    if (result.error) setError(result.error.message || "Unable to create account");
    else router.push("/dashboard");
  }

  return (
    <main className="content">
      <div className="auth-card">
        <p className="eyebrow">Create account</p>
        <h1 className="page-title">Join LearnHub</h1>
        {error && <p className="alert">{error}</p>}
        <form className="form" onSubmit={submit}>
          <label>Name<input className="input" value={name} onChange={(event) => setName(event.target.value)} required /></label>
          <label>Email<input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Password<input className="input" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}
