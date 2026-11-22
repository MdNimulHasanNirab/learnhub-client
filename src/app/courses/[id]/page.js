import CourseDetailsClient from "./CourseDetailsClient";
import { Suspense } from "react";

export default async function CourseDetailsPage({ params }) {
  const { id } = await params;
  return (
    <Suspense fallback={<main className="content"><p>Loading course…</p></main>}>
      <CourseDetailsClient id={id} />
    </Suspense>
  );
}
