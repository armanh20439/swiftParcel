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
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

export default function MyParcels() {
  const { data: session, status } = useSession();
  const [parcels, setParcels] = useState<ParcelType[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Load parcels from API
  useEffect(() => {
    const email = session?.user?.email;
    if (status !== "authenticated" || !email) return;

    const loadParcels = async () => {
      try {
        const res = await fetch(`/api/parcels?email=${email}`);
        const data = await res.json();
        // Since API returns the array directly, we use data
        setParcels(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadParcels();
  }, [session, status]);

  // 🔥 2. Real-time Tracking Modal Logic
  const handleTrack = (parcel: ParcelType) => {
    const statuses = ["not_collected", "rider-assigned", "transit", "delivered"];
    const currentIndex = statuses.indexOf(parcel.delivery_status);

    // Determines CSS class based on your current status index
    const getStepClass = (index: number) => {
      if (index <= currentIndex) return "step-success"; // Completed or Current
      return ""; // Future steps
    };

    // Determine the relevant time to show in the modal
    let lastUpdateLabel = "Waiting for pickup...";
    let updateTime = "";

    if (parcel.delivery_status === "rider-assigned") {
      lastUpdateLabel = "Rider Assigned on:";
      updateTime = parcel.assignedAt ? new Date(parcel.assignedAt).toLocaleString() : "Recently";
    } else if (parcel.delivery_status === "transit") {
      lastUpdateLabel = "Picked up on:";
      updateTime = parcel.pickedUpAt ? new Date(parcel.pickedUpAt).toLocaleString() : "Recently";
    } else if (parcel.delivery_status === "delivered") {
      lastUpdateLabel = "Delivered on:";
      updateTime = parcel.deliveredAt ? new Date(parcel.deliveredAt).toLocaleString() : "Recently";
    }

    Swal.fire({
      title: `Tracking ID: ${parcel.trackingId}`,
      html: `
        <div class="py-4 font-sans">
          <ul class="steps steps-vertical lg:steps-horizontal w-full text-xs">
            <li class="step ${getStepClass(0)}">Pending</li>
            <li class="step ${getStepClass(1)}">Assigned</li>
            <li class="step ${getStepClass(2)}">Transit</li>
            <li class="step ${getStepClass(3)}">Delivered</li>
          </ul>
          
          <div class="mt-8 text-left p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p class="text-sm">
                <b>Status:</b> 
                <span class="badge badge-primary ml-2 capitalize">
                    ${parcel.delivery_status.replace('-', ' ')}
                </span>
            </p>
            <p class="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">
                <b>${lastUpdateLabel}</b> ${updateTime}
            </p>
          </div>
        </div>
      `,
      confirmButtonText: "Close",
      confirmButtonColor: "#00302E",
    });
  };

  // 3. Payment Handler
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

  // 4. Delete Handler
  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#374151",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/parcels/${id}`, { method: "DELETE" });
      if (res.ok) {
        setParcels((prev) => prev.filter((p) => p._id !== id));
        Swal.fire("Deleted", "Parcel deleted", "success");
      }
    } catch (error) {
      Swal.fire("Error", "Network error occurred", "error");
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center gap-1">
      <span className="loading loading-ball loading-lg text-[#C8E46E]"></span>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Parcels</h1>

      <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-100">
        <table className="table table-zebra w-full bg-white">
          <thead className="bg-gray-100 text-gray-700">
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
            {parcels.length > 0 ? (
              parcels.map((p, i) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td>{i + 1}</td>
                  <td className="font-mono text-sm font-bold text-blue-600">{p.trackingId}</td>
                  <td>{p.parcelName}</td>
                  <td>{p.cost} TK</td>
                  <td>
                    <span className={`badge p-3 font-semibold ${p.payment_status === "paid" ? "badge-success" : "badge-warning text-white"}`}>
                      {p.payment_status}
                    </span>
                  </td>
                  <td className="flex gap-2 items-center">
                    <button 
                      onClick={() => handleTrack(p)} 
                      className="btn btn-info btn-sm text-white"
                    >
                      Track
                    </button>

                    {p.payment_status === "unpaid" && (
                      <button onClick={() => handlePayment(p._id)} className="btn btn-primary btn-sm">Pay</button>
                    )}

                    <button onClick={() => handleDelete(p._id)} className="btn btn-error btn-sm text-white">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-20 text-gray-400">You haven't sent any parcels yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}