"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function SuccessPage() {
  const params = useSearchParams();
  const parcelId = params.get("parcel");

  useEffect(() => {
    const updateStatus = async () => {
      await fetch(`/api/parcels/${parcelId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status: "paid" })
      });

      Swal.fire("Payment Successful!", "Your parcel is now paid.", "success");
    };

    updateStatus();
  }, []);

  return <h1 className="text-3xl text-green-600">Payment Successful 🎉</h1>;
}
