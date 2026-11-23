"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SiteFrame({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  useEffect(() => { authClient.getSession().then((result) => setUser(result?.data?.user || null)); }, []);
  async function logout() { await authClient.signOut(); setUser(null); router.push("/"); }
  return <div className="site-shell">
    <header className="navbar"><Link className="brand" href="/"><span className="brand-mark">R</span><span>RIG<span className="brand-accent">RENT</span></span></Link>
      <nav className="nav-links" aria-label="Main navigation"><Link href="/">Home</Link><Link href="/all-equipment">Equipment</Link>
        {user ? <><Link className="btn button button-secondary" href="/dashboard">Dashboard</Link><button className="btn button button-primary" onClick={logout}>Log out</button></> : <><Link href="/login">Log in</Link><Link className="btn button button-primary" href="/register">Get started</Link></>}
      </nav>
    </header>
    {children}
    <footer className="footer"><div><Link className="brand" href="/"><span className="brand-mark">R</span>RIGRENT</Link><p>Good gear. Fair rates. Built for the work ahead.</p></div><div><b>Explore</b><Link href="/all-equipment">Browse equipment</Link><Link href="/register">List your equipment</Link></div><small>© 2026 RigRent · Equipment access, made simple.</small></footer>
  </div>;
}
