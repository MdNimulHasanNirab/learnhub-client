import PaymentSuccessClient from "./PaymentSuccessClient";

export default async function PaymentSuccessPage({ searchParams }) {
  const { session_id: sessionId } = await searchParams;
  return <PaymentSuccessClient sessionId={sessionId || ""} />;
}
