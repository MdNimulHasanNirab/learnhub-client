import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "LearnHub",
  description: "Online learning management platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <nav className="navbar" aria-label="Main navigation">
            <Link className="brand" href="/"><span className="brand-mark">L</span>LearnHub</Link>
            <div className="nav-links">
              <Link href="/courses">Courses</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link className="button button-secondary" href="/login">Log in</Link>
              <Link className="button button-primary" href="/register">Join now</Link>
            </div>
          </nav>
          {children}
          <footer className="footer">© 2026 LearnHub. Learn without limits.</footer>
        </div>
      </body>
    </html>
  );
}
