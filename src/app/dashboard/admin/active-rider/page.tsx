"use client";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

const ActiveRiders = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveRiders = async () => {
    try {
      const res = await fetch("/api/rider-applications");
      const data = await res.json();
      setRiders(data.filter((r: any) => r.status === "approved"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActiveRiders(); }, []);

  // DEACTIVATE Logic
  const handleDeactivate = async (id: string, userId: string) => {
    Swal.fire({
      title: "Deactivate Rider?",
      text: "The user will lose rider access and move back to the pending list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#facc15", // yellow
      confirmButtonText: "Yes, Deactivate",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`/api/admin/riders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "pending", userId }), // Moves back to pending
        });

        if (res.ok) {
          toast.success("Rider deactivated and role set to User");
          fetchActiveRiders();
        }
      }
    });
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading Active Riders...</div>;

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-6 text-green-700">Active Riders</h1>
      
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="table w-full bg-white">
          <thead className="bg-green-50">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Warehouse</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider: any) => (
              <tr key={rider._id} className="border-b hover:bg-gray-50 transition">
                <td className="font-semibold">{rider.name}</td>
                <td>{rider.email}</td>
                <td><span className="badge badge-ghost">{rider.wirehouse}</span></td>
                <td>
                  <button 
                    onClick={() => handleDeactivate(rider._id, rider.userId)} 
                    className="btn btn-xs btn-warning text-black"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {riders.length === 0 && <p className="p-10 text-center text-gray-400">No active riders found.</p>}
      </div>
    </div>
  );
};

export default ActiveRiders;