"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api-client";

export default function PaymentSuccessClient({ sessionId }) {
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;
    let active = true;
    let timer;
    let attempts = 0;
    async function refreshStatus() {
      try {
        const result = await apiRequest(`/api/checkout/${encodeURIComponent(sessionId)}`);
        if (!active) return;
        setPayment(result.data);
        if (result.data.paymentStatus !== "paid" && attempts++ < 20) timer = setTimeout(refreshStatus, 2500);
      } catch (requestError) { if (active) setError(requestError.message); }
    }
    void refreshStatus();
    return () => { active = false; clearTimeout(timer); };
  }, [sessionId]);

  return (
    <main className="content">
      <div className="auth-card">
        <p className="eyebrow">Payment status</p>
        <h1 className="page-title">{payment?.paymentStatus === "paid" ? "Payment received" : "Confirming your payment"}</h1>
        {error || !sessionId ? <p className="alert">{error || "Missing Stripe checkout session."}</p> : payment ? (
          <>
            <p className="muted">Booking status: {payment.bookingStatus}</p>
            <p className="muted">{payment.paymentStatus === "paid" ? "Your rental is confirmed." : "Stripe is processing the verified payment webhook. Your booking will confirm when that completes."}</p>
          </>
        ) : <p className="muted">Checking your payment with Stripe…</p>}
        <Link className="btn button button-primary" href="/dashboard">Go to dashboard</Link>
      </div>
    </main>
  );
}
