import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">Learn. Practice. Grow.</p>
          <h1>Build skills that move your future forward.</h1>
          <p className="hero-copy">Explore practical courses, learn with mentors, and keep every step of your progress in one place.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/courses">Explore courses</Link>
            <Link className="button button-secondary" href="/register">Start learning</Link>
          </div>
        </div>
        <div className="hero-card" aria-label="Learning platform summary">
          <span>Learning platform</span>
          <strong>Expert-led courses</strong>
          <p>Structured lessons and measurable progress for every learner.</p>
        </div>
      </section>
      <section className="feature-grid">
        <article><span>01</span><h2>Practical courses</h2><p>Learn focused skills through organized, mentor-created lessons.</p></article>
        <article><span>02</span><h2>Clear progress</h2><p>Track completed lessons and see exactly what remains.</p></article>
        <article><span>03</span><h2>Secure learning</h2><p>Role-based access keeps student, mentor and admin tools separated.</p></article>
      </section>
    </main>
  );
}
