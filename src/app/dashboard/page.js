"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api-client";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [mentorEnrollments, setMentorEnrollments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const session = await authClient.getSession();
      if (!session?.data?.session) {
        window.location.href = "/login";
        return;
      }
      const profile = await apiRequest("/api/me");
      setUser({ ...session.data.user, ...profile.data });
      if (profile.data.role === "student") {
        const result = await apiRequest("/api/enrollments/me");
        setEnrollments(result.data);
      } else if (profile.data.role === "mentor") {
        const [courseResult, enrollmentResult] = await Promise.all([
          apiRequest("/api/mentor/courses"),
          apiRequest("/api/mentor/enrollments"),
        ]);
        const mentorCourses = await Promise.all(courseResult.data.map(async (course) => {
          const result = await apiRequest(`/api/courses/${course._id}/lessons`);
          return { ...course, lessons: result.data };
        }));
        setCourses(mentorCourses);
        setMentorEnrollments(enrollmentResult.data);
      } else if (profile.data.role === "admin") {
        const [userResult, courseResult] = await Promise.all([
          apiRequest("/api/users"),
          apiRequest("/api/admin/courses"),
        ]);
        setUsers(userResult.data);
        const adminCourses = await Promise.all(courseResult.data.map(async (course) => {
          const result = await apiRequest(`/api/courses/${course._id}/lessons`);
          return { ...course, lessons: result.data };
        }));
        setCourses(adminCourses);
      }
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDashboard(); }, []);

  async function createCourse(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      await apiRequest("/api/courses", {
        method: "POST",
        body: JSON.stringify({
          title: form.get("title"),
          description: form.get("description"),
          price: Number(form.get("price")),
          category: form.get("category"),
          level: form.get("level"),
          thumbnail: form.get("thumbnail"),
          mentorEmail: form.get("mentorEmail") || undefined,
        }),
      });
      formElement.reset();
      setMessage("Course created successfully.");
      await loadDashboard();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function createLesson(event, courseId) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      await apiRequest(`/api/courses/${courseId}/lessons`, {
        method: "POST",
        body: JSON.stringify({
          title: form.get("title"),
          content: form.get("content"),
          videoUrl: form.get("videoUrl"),
          order: Number(form.get("order")),
        }),
      });
      formElement.reset();
      setMessage("Lesson added.");
      await loadDashboard();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formElement = event.currentTarget.form;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setMessage("Choose a JPG, PNG, WebP or GIF image under 5 MB.");
      return;
    }
    const form = new FormData();
    form.append("image", file);
    try {
      const result = await apiRequest("/api/upload-image", { method: "POST", body: form });
      formElement.elements.thumbnail.value = result.data.url;
      setMessage("Image uploaded.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function updateRole(id, role) {
    try {
      await apiRequest(`/api/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) });
      setMessage("User role updated.");
      await loadDashboard();
    } catch (error) { setMessage(error.message); }
  }

  async function updateCourse(course, update) {
    try {
      await apiRequest(`/api/courses/${course._id}`, { method: "PATCH", body: JSON.stringify(update) });
      setMessage("Course updated.");
      await loadDashboard();
    } catch (error) { setMessage(error.message); }
  }

  async function editCourse(event, course) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await updateCourse(course, {
      title: form.get("title"),
      description: form.get("description"),
      price: Number(form.get("price")),
      category: form.get("category"),
      level: form.get("level"),
      thumbnail: form.get("thumbnail"),
    });
  }

  async function deleteCourse(course) {
    if (!window.confirm(`Delete "${course.title}" and its lessons?`)) return;
    try {
      await apiRequest(`/api/courses/${course._id}`, { method: "DELETE" });
      setMessage("Course deleted.");
      await loadDashboard();
    } catch (error) { setMessage(error.message); }
  }

  async function deleteLesson(lesson) {
    if (!window.confirm(`Delete "${lesson.title}"?`)) return;
    try {
      await apiRequest(`/api/lessons/${lesson._id}`, { method: "DELETE" });
      setMessage("Lesson deleted.");
      await loadDashboard();
    } catch (error) { setMessage(error.message); }
  }

  async function updateLesson(event, lesson) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await apiRequest(`/api/lessons/${lesson._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: form.get("title"),
          content: form.get("content"),
          videoUrl: form.get("videoUrl"),
          order: Number(form.get("order")),
        }),
      });
      setMessage("Lesson updated.");
      await loadDashboard();
    } catch (error) { setMessage(error.message); }
  }

  async function logout() {
    await authClient.signOut();
    window.location.href = "/";
  }

  if (loading) return <main className="content"><p>Loading dashboard…</p></main>;
  if (!user) return <main className="content"><p className="alert">{message || "Could not load your account."}</p></main>;

  const role = user.role;
  return (
    <main className="dashboard">
      <aside className="sidebar">
        <strong>{role[0].toUpperCase() + role.slice(1)} dashboard</strong>
        <a href="/dashboard">Overview</a>
        {role === "student" && <a href="/courses">Browse courses</a>}
        {role === "mentor" && <a href="#create-course">Create course</a>}
        {role === "admin" && <a href="#users">Manage users</a>}
        <a href="/profile">Profile</a>
        <button className="button button-secondary" type="button" onClick={logout}>Log out</button>
      </aside>
      <section className="dashboard-main">
        <h1 className="page-title">Welcome, {user.name || "Learner"}</h1>
        {message && <p className="alert" role="status">{message}</p>}

        {role === "student" && (
          <>
            <div className="stats">
              <article className="stat">Enrolled courses<strong>{enrollments.length}</strong></article>
              <article className="stat">In progress<strong>{enrollments.filter((item) => item.status === "active").length}</strong></article>
              <article className="stat">Completed courses<strong>{enrollments.filter((item) => item.progressPercent === 100).length}</strong></article>
            </div>
            <h2 style={{ marginTop: 32 }}>My learning</h2>
            {enrollments.length ? enrollments.map((item) => (
              <article key={item._id} className="enrollment-card">
                <div>
                  <strong>{item.course?.title || "Course"}</strong>
                  <p className="muted">{item.progressPercent || 0}% complete</p>
                  <div className="progress-track"><div style={{ width: `${item.progressPercent || 0}%` }} /></div>
                </div>
                {item.course && <a className="button button-primary" href={`/learn/${item.courseId}`}>Continue learning</a>}
              </article>
            )) : <p className="muted">You are not enrolled in any courses yet. <a href="/courses">Browse courses</a>.</p>}
          </>
        )}

        {role === "mentor" && (
          <>
            <div className="stats">
              <article className="stat">My courses<strong>{courses.length}</strong></article>
              <article className="stat">Enrolled students<strong>{mentorEnrollments.reduce((sum, item) => sum + item.enrollments.length, 0)}</strong></article>
            </div>
            <form id="create-course" className="form dashboard-form" onSubmit={createCourse}>
              <h2>Create a course</h2>
              <label>Title<input className="input" name="title" maxLength={120} required /></label>
              <label>Description<textarea className="textarea" name="description" maxLength={5000} required /></label>
              <label>Price (USD)<input className="input" name="price" type="number" min="0" step="0.01" defaultValue="0" required /></label>
              <label>Category<select className="select" name="category"><option>Development</option><option>Design</option><option>Business</option></select></label>
              <label>Level<select className="select" name="level"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
              <label>Thumbnail image<input className="input" type="file" accept="image/*" onChange={uploadImage} /><input className="input" name="thumbnail" placeholder="Uploaded image URL" readOnly /></label>
              <button className="button button-primary" type="submit">Publish course</button>
            </form>
            <h2 style={{ marginTop: 36 }}>Manage my courses</h2>
            {courses.map((course) => (
              <article className="manage-card" key={course._id}>
                <div className="manage-heading">
                  <div><h3>{course.title}</h3><p className="muted">{course.price ? `$${course.price}` : "Free"} · {course.status}</p></div>
                  <button className="button button-secondary" type="button" onClick={() => deleteCourse(course)}>Delete course</button>
                </div>
                <details className="lesson-edit">
                  <summary>Edit course details</summary>
                  <form className="form lesson-form" onSubmit={(event) => editCourse(event, course)}>
                    <label>Title<input className="input" name="title" defaultValue={course.title} required /></label>
                    <label>Description<textarea className="textarea" name="description" defaultValue={course.description} required /></label>
                    <label>Price<input className="input" name="price" type="number" min="0" step="0.01" defaultValue={course.price} required /></label>
                    <label>Category<input className="input" name="category" defaultValue={course.category} required /></label>
                    <label>Level<select className="select" name="level" defaultValue={course.level}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
                    <label>Thumbnail URL<input className="input" name="thumbnail" type="url" defaultValue={course.thumbnail} /></label>
                    <button className="button button-primary" type="submit">Save course</button>
                  </form>
                </details>
                <h4>Lessons</h4>
                {course.lessons.map((lesson) => (
                  <details className="lesson-edit" key={lesson._id}>
                    <summary>{lesson.order}. {lesson.title}</summary>
                    <form className="form lesson-form" onSubmit={(event) => updateLesson(event, lesson)}>
                      <label>Title<input className="input" name="title" defaultValue={lesson.title} required /></label>
                      <label>Notes<textarea className="textarea" name="content" defaultValue={lesson.content} /></label>
                      <label>Video URL<input className="input" name="videoUrl" type="url" defaultValue={lesson.videoUrl} /></label>
                      <label>Order<input className="input" name="order" type="number" min="1" defaultValue={lesson.order} required /></label>
                      <div className="manage-actions">
                        <button className="button button-primary" type="submit">Save lesson</button>
                        <button className="button button-secondary" type="button" onClick={() => deleteLesson(lesson)}>Delete lesson</button>
                      </div>
                    </form>
                  </details>
                ))}
                <form className="form lesson-form" onSubmit={(event) => createLesson(event, course._id)}>
                  <h4>Add lesson</h4>
                  <label>Title<input className="input" name="title" required /></label>
                  <label>Notes<textarea className="textarea" name="content" /></label>
                  <label>Video URL<input className="input" name="videoUrl" type="url" /></label>
                  <label>Order<input className="input" name="order" type="number" min="1" defaultValue={course.lessons.length + 1} required /></label>
                  <button className="button button-primary" type="submit">Add lesson</button>
                </form>
              </article>
            ))}
            <h2 style={{ marginTop: 36 }}>Student enrollments</h2>
            {!mentorEnrollments.length && <p className="muted">No students are enrolled in your courses yet.</p>}
            {mentorEnrollments.map((item) => (
              <article className="manage-card" key={item.course._id}>
                <strong>{item.course.title}</strong>
                <p className="muted">{item.enrollments.length} enrolled student(s)</p>
                {item.enrollments.map((enrollment) => <p key={enrollment._id}>{enrollment.studentEmail} · {enrollment.progressPercent}% complete</p>)}
              </article>
            ))}
          </>
        )}

        {role === "admin" && (
          <>
            <div className="stats">
              <article className="stat">Registered users<strong>{users.length}</strong></article>
              <article className="stat">Mentors<strong>{users.filter((item) => item.role === "mentor").length}</strong></article>
              <article className="stat">Courses<strong>{courses.length}</strong></article>
            </div>
            <section id="users">
              <h2 style={{ marginTop: 32 }}>User and mentor management</h2>
              {users.map((target) => (
                <article className="user-row" key={String(target._id)}>
                  <span>{target.name}<br /><small className="muted">{target.email}</small></span>
                  <select className="select role-select" value={target.role} onChange={(event) => updateRole(target._id, event.target.value)}>
                    <option value="student">Student</option><option value="mentor">Mentor</option><option value="admin">Admin</option>
                  </select>
                </article>
              ))}
            </section>
            <section id="courses">
              <h2 style={{ marginTop: 32 }}>Course management</h2>
              <form className="form dashboard-form" onSubmit={createCourse}>
                <h3>Create a course</h3>
                <label>Title<input className="input" name="title" required maxLength={120} /></label>
                <label>Description<textarea className="textarea" name="description" required maxLength={5000} /></label>
                <label>Price (USD)<input className="input" name="price" type="number" min="0" step="0.01" defaultValue="0" required /></label>
                <label>Category<select className="select" name="category"><option>Development</option><option>Design</option><option>Business</option></select></label>
                <label>Level<select className="select" name="level"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
                <label>Thumbnail URL<input className="input" name="thumbnail" type="url" /></label>
                <label>Assign mentor
                  <select className="select" name="mentorEmail" defaultValue="">
                    <option value="">Admin-owned course</option>
                    {users.filter((target) => target.role === "mentor").map((mentor) => <option key={mentor._id} value={mentor.email}>{mentor.name} · {mentor.email}</option>)}
                  </select>
                </label>
                <button className="button button-primary" type="submit">Create course</button>
              </form>
              {!courses.length && <p className="muted">No courses yet.</p>}
              {courses.map((course) => (
                <article className="manage-card" key={String(course._id)}>
                  <div className="manage-heading">
                    <div><h3>{course.title}</h3><p className="muted">{course.mentorEmail} · ${course.price}</p></div>
                    <div className="manage-actions">
                      <select className="select status-select" value={course.status} onChange={(event) => updateCourse(course, { status: event.target.value })}>
                        <option value="published">Published</option><option value="draft">Draft</option>
                      </select>
                      <select className="select status-select" value={course.mentorEmail || user.email} onChange={(event) => updateCourse(course, { mentorEmail: event.target.value })}>
                        <option value={user.email}>Admin owner</option>
                        {users.filter((target) => target.role === "mentor").map((mentor) => <option key={mentor._id} value={mentor.email}>{mentor.name}</option>)}
                      </select>
                      <button className="button button-secondary" type="button" onClick={() => deleteCourse(course)}>Delete</button>
                    </div>
                  </div>
                  <details className="lesson-edit">
                    <summary>Edit course details</summary>
                    <form className="form lesson-form" onSubmit={(event) => editCourse(event, course)}>
                      <label>Title<input className="input" name="title" defaultValue={course.title} required /></label>
                      <label>Description<textarea className="textarea" name="description" defaultValue={course.description} required /></label>
                      <label>Price<input className="input" name="price" type="number" min="0" step="0.01" defaultValue={course.price} required /></label>
                      <label>Category<input className="input" name="category" defaultValue={course.category} required /></label>
                      <label>Level<select className="select" name="level" defaultValue={course.level}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
                      <label>Thumbnail URL<input className="input" name="thumbnail" type="url" defaultValue={course.thumbnail} /></label>
                      <button className="button button-primary" type="submit">Save course</button>
                    </form>
                  </details>
                  <h4>Lessons</h4>
                  {course.lessons.map((lesson) => (
                    <details className="lesson-edit" key={lesson._id}>
                      <summary>{lesson.order}. {lesson.title}</summary>
                      <form className="form lesson-form" onSubmit={(event) => updateLesson(event, lesson)}>
                        <label>Title<input className="input" name="title" defaultValue={lesson.title} required /></label>
                        <label>Notes<textarea className="textarea" name="content" defaultValue={lesson.content} /></label>
                        <label>Video URL<input className="input" name="videoUrl" type="url" defaultValue={lesson.videoUrl} /></label>
                        <label>Order<input className="input" name="order" type="number" min="1" defaultValue={lesson.order} required /></label>
                        <div className="manage-actions">
                          <button className="button button-primary" type="submit">Save lesson</button>
                          <button className="button button-secondary" type="button" onClick={() => deleteLesson(lesson)}>Delete lesson</button>
                        </div>
                      </form>
                    </details>
                  ))}
                  <form className="form lesson-form" onSubmit={(event) => createLesson(event, course._id)}>
                    <h4>Add lesson</h4>
                    <label>Title<input className="input" name="title" required /></label>
                    <label>Notes<textarea className="textarea" name="content" /></label>
                    <label>Video URL<input className="input" name="videoUrl" type="url" /></label>
                    <label>Order<input className="input" name="order" type="number" min="1" defaultValue={course.lessons.length + 1} required /></label>
                    <button className="button button-primary" type="submit">Add lesson</button>
                  </form>
                </article>
              ))}
            </section>
          </>
        )}
      </section>
    </main>
  );
}
