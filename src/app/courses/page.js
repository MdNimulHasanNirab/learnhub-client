import { API_URL } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default async function CoursesPage({ searchParams }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.category) query.set("category", params.category);
  if (params?.level) query.set("level", params.level);

  let courses = [];
  try {
    const response = await fetch(`${API_URL}/api/courses?${query}`, { cache: "no-store" });
    const result = await response.json();
    if (result.success) courses = result.data;
  } catch {
    courses = [];
  }

  return (
    <main className="content">
      <p className="eyebrow">Course catalog</p>
      <h1 className="page-title">Find your next skill</h1>
      <p className="muted">Browse practical courses created and managed by mentors.</p>
      <form className="filters" method="get">
        <input className="input" name="search" placeholder="Search courses" defaultValue={params?.search || ""} />
        <select className="select" name="category" defaultValue={params?.category || ""} aria-label="Category">
          <option value="">All categories</option>
          <option value="Development">Development</option>
          <option value="Design">Design</option>
          <option value="Business">Business</option>
        </select>
        <select className="select" name="level" defaultValue={params?.level || ""} aria-label="Level">
          <option value="">All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <button className="button button-primary" type="submit">Filter</button>
      </form>
      {courses.length ? (
        <section className="course-grid">
          {courses.map((course) => (
            <article className="course-card" key={course._id}>
              {course.thumbnail ? <Image src={course.thumbnail} alt="" width={500} height={300} unoptimized /> : <div style={{ height: 190, background: "#edf1e9" }} />}
              <div className="course-card-body">
                <p className="muted">{course.category} · {course.level}</p>
                <h2>{course.title}</h2>
                <p className="muted">{course.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
                  <span className="price">{course.price === 0 ? "Free" : `$${course.price}`}</span>
                  <Link className="button button-secondary" href={`/courses/${course._id}`}>View course</Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="auth-card"><h2>No courses found</h2><p className="muted">Try changing your search or filters.</p></div>
      )}
    </main>
  );
}
