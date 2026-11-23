"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
export default function LoginPage() {
  const router = useRouter(); const query = useSearchParams(); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event) { event.preventDefault(); const form = new FormData(event.currentTarget); setBusy(true); setError(""); try { const result = await authClient.signIn.email({ email: form.get("email"), password: form.get("password") }); if (result.error) throw new Error(result.error.message); router.push(query.get("next") || "/dashboard"); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  async function google() { const result = await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" }); if (result.error) setError(result.error.message); }
  return <main className="content"><div className="auth-card"><p className="eyebrow">WELCOME BACK</p><h1 className="page-title">Log in</h1><p className="muted">Pick up where your next project begins.</p>{error && <p className="alert">{error}</p>}<form className="form" onSubmit={submit}><label>Email<input className="input" type="email" name="email" autoComplete="email" required/></label><label>Password<input className="input" type="password" name="password" autoComplete="current-password" required/></label><button className="btn button button-primary" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button></form><button className="btn button button-secondary google-button" type="button" onClick={google}>Continue with Google</button><p className="muted">New to RigRent? <Link href="/register"><strong>Create an account</strong></Link></p></div></main>;
}
