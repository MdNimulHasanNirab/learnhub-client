"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api-client";

export default function LearningClient({ courseId }) {
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest(`/api/courses/${courseId}`, { auth: false }),
      apiRequest(`/api/courses/${courseId}/lessons`),
      apiRequest(`/api/progress/${courseId}`),
    ]).then(([courseResult, lessonResult, progressResult]) => {
      if (!active) return;
      setCourse(courseResult.data);
      setLessons(lessonResult.data);
      setCompleted(progressResult.data.map((item) => item.lessonId));
      setSelected(lessonResult.data[0] || null);
    }).catch((requestError) => {
      if (!active) return;
      if (requestError.message.toLowerCase().includes("unauthorized")) window.location.href = "/login";
      else setError(requestError.message);
    });
    return () => { active = false; };
  }, [courseId]);

  async function markComplete(lesson) {
    try {
      await apiRequest("/api/progress", {
        method: "POST",
        body: JSON.stringify({ courseId, lessonId: lesson._id }),
      });
      setCompleted((previous) => previous.includes(lesson._id) ? previous : [...previous, lesson._id]);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (error && !course) return <main className="content"><p className="alert">{error}</p></main>;
  if (!course) return <main className="content"><p>Loading your course…</p></main>;

  const percent = lessons.length ? Math.round((completed.length / lessons.length) * 100) : 0;
  return (
    <main className="content">
      <a className="muted" href="/dashboard">← Dashboard</a>
      <p className="eyebrow" style={{ marginTop: 24 }}>Your learning space</p>
      <h1 className="page-title">{course.title}</h1>
      <p className="muted">Progress: {percent}% ({completed.length} of {lessons.length} lessons)</p>
      <div style={{ height: 8, background: "var(--line)", borderRadius: 8, overflow: "hidden", margin: "20px 0 32px" }}>
        <div style={{ height: "100%", width: `${percent}%`, background: "var(--green)" }} />
      </div>
      {error && <p className="alert">{error}</p>}
      {lessons.length ? (
        <div className="learning-layout">
          <section>
            <h2>{selected?.title || "Choose a lesson"}</h2>
            {selected?.videoUrl && <p><a className="button button-secondary" href={selected.videoUrl} target="_blank" rel="noreferrer">Open lesson video</a></p>}
            <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{selected?.content || "No lesson notes have been added yet."}</p>
            {selected && (
              <button className="button button-primary" type="button" onClick={() => markComplete(selected)} disabled={completed.includes(selected._id)}>
                {completed.includes(selected._id) ? "Lesson completed" : "Mark lesson complete"}
              </button>
            )}
          </section>
          <aside className="lesson-list">
            <h2>Course lessons</h2>
            {lessons.map((lesson, index) => (
              <button className={`lesson-choice ${selected?._id === lesson._id ? "selected" : ""}`} type="button" key={lesson._id} onClick={() => setSelected(lesson)}>
                <span>{index + 1}. {lesson.title}</span>
                <span>{completed.includes(lesson._id) ? "✓" : ""}</span>
              </button>
            ))}
          </aside>
        </div>
      ) : <p className="muted">Your mentor has not added lessons yet.</p>}
    </main>
  );
}
