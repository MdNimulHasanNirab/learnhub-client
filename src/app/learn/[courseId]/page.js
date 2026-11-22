import LearningClient from "./LearningClient";

export default async function LearningPage({ params }) {
  const { courseId } = await params;
  return <LearningClient courseId={courseId} />;
}
