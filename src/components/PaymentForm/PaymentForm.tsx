// components/PaymentForm.tsx
"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Swal from "sweetalert2";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Props = {
  parcelId: string;
};

function CheckoutForm({ parcelId }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    // Create PaymentIntent on server
    const res = await fetch("/api/payments/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parcelId }),
    });

    const data = await res.json();

    if (!data.clientSecret) {
      setLoading(false);
      Swal.fire("Error", data.error || "Failed to start payment", "error");
      return;
    }

    // Confirm card payment
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setLoading(false);
      Swal.fire("Error", "Card element not found", "error");
      return;
    }

    const confirm = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (confirm.error) {
      console.error("Stripe confirm error:", confirm.error);
      Swal.fire("Payment failed", confirm.error.message || "Error", "error");
      setLoading(false);
      return;
    }

    if (confirm.paymentIntent && confirm.paymentIntent.status === "succeeded") {
      // Optionally update parcel record client-side (server webhook will do this reliably).
      
      await fetch(`/api/parcels/payment-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcelId, paymentIntentId: confirm.paymentIntent.id }),
      });

      Swal.fire("Success", "Payment succeeded!", "success");
    } else {
      Swal.fire("Info", "Payment processing. You will be notified.", "info");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 border rounded">
        <CardElement />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}

export default function PaymentFormWrapper({ parcelId }: Props) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm parcelId={parcelId} />
    </Elements>
  );
}
