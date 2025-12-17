"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface PaymentType {
  _id: string;
  sessionId: string;
  amount: number;
  status: string;
  createdAt: string;
  parcelId: {
    parcelName: string;
    trackingId: string;
  };
}

export default function PaymentHistory() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchHistory = async () => {
      const res = await fetch(
        `/api/payments/history?email=${session?.user?.email}`
      );
      const data = await res.json();

      setPayments(data.payments || []);
      setLoading(false);
    };

    fetchHistory();
  }, [session]);

  if (loading) return <div className="flex items-center justify-center"><span className="loading loading-ball loading-xs"></span>
<span className="loading loading-ball loading-sm"></span>
<span className="loading loading-ball loading-md"></span>
<span className="loading loading-ball loading-lg"></span>
<span className="loading loading-ball loading-xl"></span></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Payment History</h1>

      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Parcel Name</th>
            <th>Tracking ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p, i) => (
            <tr key={p._id}>
              <td>{i + 1}</td>
              <td>{p.parcelId?.parcelName || "N/A"}</td>
              <td>{p.parcelId?.trackingId || "N/A"}</td>
              <td>{p.amount} TK</td>

              <td>
                <span
                  className={`badge ${
                    p.status === "paid" ? "badge-success" : "badge-error"
                  }`}
                >
                  {p.status}
                </span>
              </td>

              <td>{new Date(p.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
