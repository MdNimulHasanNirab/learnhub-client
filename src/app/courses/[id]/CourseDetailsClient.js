"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";
import { apiRequest } from "@/lib/api-client";

export default function CourseDetailsClient({ id }) {
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/courses/${id}`)
      .then((response) => response.json())
      .then((result) => setCourse(result.success ? result.data : null))
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function enroll() {
    setMessage("");
    const session = await authClient.getSession();
    if (!session?.data?.session) {
      router.push("/login");
      return;
    }
    try {
      if (Number(course.price) > 0) {
        const result = await apiRequest("/api/checkout", { method: "POST", body: JSON.stringify({ courseId: id }) });
        window.location.assign(result.data.url);
      } else {
        await apiRequest("/api/enrollments", { method: "POST", body: JSON.stringify({ courseId: id }) });
        setMessage("You are enrolled successfully.");
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (loading) return <main className="content"><p>Loading course…</p></main>;
  if (!course) return <main className="content"><h1>Course not found</h1></main>;

  return (
    <main className="content">
      <p className="eyebrow">{course.category} · {course.level}</p>
      <h1 className="page-title">{course.title}</h1>
      <p className="muted">{course.description}</p>
      <p className="muted">Taught by {course.mentorName}</p>
      {message && <p className="alert">{message}</p>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "28px 0" }}>
        <strong className="price">{course.price === 0 ? "Free" : `$${course.price}`}</strong>
        <button className="button button-primary" type="button" onClick={enroll}>
          {course.price === 0 ? "Enroll for free" : "Enroll and pay"}
        </button>
      </div>
      <section>
        <h2>Course lessons</h2>
        <p className="muted">Course lessons are available to enrolled students.</p>
        <Link className="button button-secondary" href={`/learn/${id}`}>Open learning page</Link>
      </section>
    </main>
  );
}
