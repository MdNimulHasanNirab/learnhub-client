import Link from "next/link";
export default function NotFound() { return <main className="content"><div className="auth-card"><p className="eyebrow">404 · NOT FOUND</p><h1 className="page-title">That listing moved.</h1><p className="muted">Try browsing the latest approved equipment.</p><Link className="btn button button-primary" href="/all-equipment">Browse equipment</Link></div></main>; }
