"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api-client";

export default function PaymentSuccessClient({ sessionId }) {
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("Missing Stripe checkout session.");
      return;
    }
    apiRequest(`/api/checkout/${encodeURIComponent(sessionId)}`)
      .then((result) => setPayment(result.data))
      .catch((requestError) => setError(requestError.message));
  }, [sessionId]);

  return (
    <main className="content">
      <div className="auth-card">
        <p className="eyebrow">Payment status</p>
        <h1 className="page-title">{payment?.paymentStatus === "paid" ? "Payment received" : "Confirming your payment"}</h1>
        {error ? <p className="alert">{error}</p> : payment ? (
          <>
            <p className="muted">{payment.courseTitle}</p>
            <p className="muted">{payment.enrolled ? "Your enrollment is active." : "Stripe is processing the verified webhook. Your access will appear as soon as it completes."}</p>
          </>
        ) : <p className="muted">Checking your payment with Stripe…</p>}
        <a className="button button-primary" href="/dashboard">Go to dashboard</a>
      </div>
    </main>
  );
}
