"use client";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

const PendingRiders = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingRiders = async () => {
    try {
      const res = await fetch("/api/rider-applications");
      const data = await res.json();
      // Filter only pending ones
      setRiders(data.filter((r: any) => r.status === "pending"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPendingRiders(); }, []);

  // APPROVE Logic
  const handleApprove = async (id: string, userId: string) => {
    const res = await fetch(`/api/admin/riders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved", userId }),
    });

    if (res.ok) {
      toast.success("Rider Approved!");
      fetchPendingRiders();
    }
  };

  // REJECT Logic
  const handleReject = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to reject this rider application?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Reject",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`/api/admin/riders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "rejected" }),
        });

        if (res.ok) {
          toast.error("Application Rejected");
          fetchPendingRiders();
        }
      }
    });
  };

  const showDetails = (rider: any) => {
    Swal.fire({
      title: `<strong>Rider Details</strong>`,
      html: `
        <div style="text-align:left; line-height: 1.8;">
          <p><b>Name:</b> ${rider.name}</p>
          <p><b>Email:</b> ${rider.email}</p>
          <p><b>NID:</b> ${rider.nid}</p>
          <p><b>Bike Reg:</b> ${rider.bikeReg}</p>
          <p><b>Contact:</b> ${rider.contact}</p>
          <p><b>Warehouse:</b> ${rider.wirehouse}</p>
        </div>
      `,
    });
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading...</div>;

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-6">Pending Riders</h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>Name</th>
              <th>District</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider: any) => (
              <tr key={rider._id} className="border-b">
                <td>{rider.name}</td>
                <td>{rider.district}</td>
                <td className="flex gap-2">
                  <button onClick={() => showDetails(rider)} className="btn btn-xs btn-outline">Details</button>
                  <button onClick={() => handleApprove(rider._id, rider.userId)} className="btn btn-xs btn-success text-white">Approve</button>
                  <button onClick={() => handleReject(rider._id)} className="btn btn-xs btn-error text-white">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {riders.length === 0 && <p className="p-5 text-center text-gray-400">No pending applications.</p>}
      </div>
    </div>
  );
};

export default PendingRiders;