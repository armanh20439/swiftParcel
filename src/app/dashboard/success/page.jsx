"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const parcelId = searchParams.get("parcel");

  const [status, setStatus] = useState("Processing payment...");

  useEffect(() => {
    if (!session_id) return;

    const confirmPayment = async () => {
      try {
        const res = await fetch(
          `/api/payments/confirm-payment?session_id=${session_id}`
        );

        const data = await res.json();

        if (res.ok) {
          setStatus("🎉 Payment confirmed successfully!");
        } else {
          setStatus("❌ Payment confirmation failed.");
          console.log("Confirm error:", data);
        }
      } catch (error) {
        console.log("Error confirming payment:", error);
        setStatus("❌ Network error while confirming payment.");
      }
    };

    confirmPayment();
  }, [session_id]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">Payment Success</h1>
      <p className="mt-4 text-lg">{status}</p>

      <a
        href="/dashboard/my-parcels"
        className="btn btn-primary mt-6"
      >
        Go Back to My Parcels
      </a>
    </div>
  );
}
