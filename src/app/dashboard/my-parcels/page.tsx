"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export interface ParcelType {
  _id: string;
  trackingId: string;
  parcelName: string;
  cost: number;
  payment_status: "paid" | "unpaid";
  delivery_status: string;
}

export default function MyParcels() {
  const { data: session } = useSession();
  const [parcels, setParcels] = useState<ParcelType[]>([]);
  const [loading, setLoading] = useState(true);

  const email = session?.user?.email;

  // Load parcels
  useEffect(() => {
    if (!email) return;

    const loadParcels = async () => {
      const res = await fetch(`/api/parcels?email=${email}`);
      const data = await res.json();
      setParcels(data.parcels || []);
      setLoading(false);
    };

    loadParcels();
  }, [email]);

  // Pay button
  const handlePayment = async (id: string) => {
    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcelId: id }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        Swal.fire("Error", data.error || "Payment failed!", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Payment error occurred!", "error");
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch(`/api/parcels/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      setParcels((prev) => prev.filter((p) => p._id !== id));
      Swal.fire("Deleted", "Parcel deleted", "success");
    } else {
      Swal.fire("Error", data.message, "error");
    }
  };

  if (loading) return <div className="flex items-center justify-center"><span className="loading loading-ball loading-xs"></span>
    <span className="loading loading-ball loading-sm"></span>
    <span className="loading loading-ball loading-md"></span>
    <span className="loading loading-ball loading-lg"></span>
    <span className="loading loading-ball loading-xl"></span></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">My Parcels</h1>

      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Tracking ID</th>
            <th>Parcel Name</th>
            <th>Cost</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {parcels.map((p, i) => (
            <tr key={p._id}>
              <td>{i + 1}</td>
              <td>{p.trackingId}</td>
              <td>{p.parcelName}</td>
              <td>{p.cost} TK</td>

              <td>
                <span
                  className={`badge ${p.payment_status === "paid"
                      ? "badge-success"
                      : "badge-warning"
                    }`}
                >
                  {p.payment_status}
                </span>
              </td>

              <td className="flex gap-2 items-center">
                <button className="btn btn-info btn-sm">View</button>

                {p.payment_status === "unpaid" && (
                  <button
                    onClick={() => handlePayment(p._id)}
                    className="btn btn-primary btn-sm"
                  >
                    Pay
                  </button>
                )}



                <button
                  onClick={() => handleDelete(p._id)}
                  className="btn btn-error btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
