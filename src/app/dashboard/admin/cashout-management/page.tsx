"use client";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

const CashoutManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // load all cashout request
  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/cashout"); // return all request
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // request approve
  const handleApprove = async (request: any) => {
    const confirm = await Swal.fire({
      title: "Confirm Payment?",
      text: `Are you sure you have paid ৳${request.amount} to ${request.riderEmail}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Approved",
      confirmButtonColor: "#22C55E",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch("/api/admin/cashout/approve", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestId: request._id,
            riderEmail: request.riderEmail,
            amount: request.amount
          }),
        });

        if (res.ok) {
          Swal.fire("Success", "Cashout approved and balance updated!", "success");
          fetchRequests(); //refresh the list
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading Requests...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster />
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Cashout Management</h1>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <table className="table w-full">
          <thead className="bg-gray-50">
            <tr>
              <th>Rider Details</th>
              <th>Amount</th>
              <th>Requested At</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((req: any) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td>
                    <div className="font-bold">{req.riderName}</div>
                    <div className="text-xs text-gray-400">{req.riderEmail}</div>
                  </td>
                  <td className="font-bold text-[#00302E]">৳ {req.amount.toFixed(2)}</td>
                  <td className="text-sm">{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-sm font-bold ${req.status === 'pending' ? 'badge-warning' : 'badge-success text-white'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="text-center">
                    {req.status === "pending" && (
                      <button 
                        onClick={() => handleApprove(req)}
                        className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none rounded-lg"
                      >
                        Approve & Deduct
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">No payout requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashoutManagement;