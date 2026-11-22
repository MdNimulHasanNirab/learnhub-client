export default async function PaymentCancelledPage({ searchParams }) {
  const { courseId } = await searchParams;
  return (
    <main className="content">
      <div className="auth-card">
        <p className="eyebrow">Checkout cancelled</p>
        <h1 className="page-title">No payment was made</h1>
        <p className="muted">You can return to the course whenever you are ready.</p>
        <a className="button button-primary" href={courseId ? `/courses/${encodeURIComponent(courseId)}` : "/courses"}>Return to courses</a>
      </div>
    </main>
  );
}
