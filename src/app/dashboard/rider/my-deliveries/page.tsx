"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

const RiderDashboard = () => {
  const { data: session } = useSession();
  const [allParcels, setAllParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. রাইডারের পার্সেল ডেটা ফেচ করা
  const fetchRiderData = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`/api/rider/parcels?email=${session.user.email}`);
      const data = await res.json();
      setAllParcels(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to sync with server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderData();
  }, [session]);

  // ২. ফিল্টার লজিক
  const activeTasks = allParcels.filter((p: any) => 
    p.delivery_status === "rider-assigned" || p.delivery_status === "transit"
  );
  const deliveredParcels = allParcels.filter((p: any) => p.delivery_status === "delivered");

  // ৩. আর্নিং ক্যালকুলেশন (Database Value অথবা Manual Fallback)
  const totalEarnings = deliveredParcels.reduce((sum, p: any) => {
    if (p.riderEarnings && p.riderEarnings > 0) {
      return sum + p.riderEarnings;
    }
    const sDist = (p.senderDistrict || "").toLowerCase().trim();
    const rDist = (p.receiverDistrict || "").toLowerCase().trim();
    const isSame = sDist === rDist && sDist !== "";
    const manualCalc = (Number(p.cost) || 0) * (isSame ? 0.80 : 0.30);
    return sum + manualCalc;
  }, 0);

  // ৪. একশন হ্যান্ডলার (Pickup/Deliver)
  const handleAction = async (parcelId: string, action: "pickup" | "deliver") => {
    const isPickup = action === "pickup";
    const result = await Swal.fire({
      title: isPickup ? "Confirm Pickup?" : "Confirm Delivery?",
      text: isPickup 
        ? "Have you collected the parcel from the sender?" 
        : "Is the parcel successfully handed over to the receiver?",
      icon: isPickup ? "info" : "success",
      showCancelButton: true,
      confirmButtonText: isPickup ? "Yes, Picked Up" : "Yes, Delivered",
      confirmButtonColor: "#C8E46E",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch("/api/rider/parcels", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parcelId,
            riderEmail: session?.user?.email,
            action: action 
          }),
        });

        if (res.ok) {
          toast.success(isPickup ? "Parcel is now in Transit!" : "Delivery Completed!");
          fetchRiderData(); 
        } else {
          toast.error("Failed to update status");
        }
      } catch (error) {
        toast.error("Network error occurred");
      }
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#C8E46E]"></span>
        <span className="ml-4 font-bold text-gray-600">Syncing Dashboard...</span>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster />

      {/* ৫. Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="stat bg-white shadow-md rounded-2xl border border-gray-100">
          <div className="stat-title text-gray-500 font-bold">Total Delivered</div>
          <div className="stat-value text-green-600">{deliveredParcels.length}</div>
          <div className="stat-desc font-medium">Items completed</div>
        </div>
        
        <div className="stat bg-white shadow-md rounded-2xl border border-gray-100">
          <div className="stat-title text-gray-500 font-bold">Active Tasks</div>
          <div className="stat-value text-blue-600">{activeTasks.length}</div>
          <div className="stat-desc font-medium">{activeTasks.length > 0 ? "Items in hand" : "Available for duty"}</div>
        </div>

        <div className="stat bg-[#00302E] text-white shadow-md rounded-2xl flex flex-col justify-between">
          <div>
            <div className="stat-title text-gray-300 font-bold">Total Balance</div>
            <div className="stat-value text-[#C8E46E]">৳ {totalEarnings.toFixed(2)}</div>
          </div>
          <div className="mt-2">
             <button 
               disabled={totalEarnings <= 0}
               className="btn btn-xs bg-[#C8E46E] text-[#00302E] border-none hover:bg-white font-bold"
             >
                Cashout
             </button>
          </div>
        </div>
      </div>

      {/* ৬. Active Assignments Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Active Assignments</h2>
        <button onClick={fetchRiderData} className="btn btn-ghost btn-sm border-gray-300">Refresh</button>
      </div>

      {activeTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {activeTasks.map((p: any) => (
            <div key={p._id} className={`bg-white p-6 rounded-3xl shadow-lg border-2 transition-all ${p.delivery_status === 'transit' ? 'border-blue-400' : 'border-[#C8E46E]'}`}>
              
              <div className="flex justify-between items-center mb-4">
                <span className="badge badge-lg bg-[#C8E46E] text-[#00302E] border-none font-bold px-4">{p.trackingId}</span>
                <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${p.delivery_status === 'transit' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                  {p.delivery_status.replace('-', ' ')}
                </span>
              </div>

              {/* Parcel Details Section */}
              <div className="mb-4 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-800 uppercase tracking-tighter mb-1">Parcel Info</p>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-700">{p.parcelName}</span>
                  <span className="badge badge-sm bg-blue-200 text-blue-800 border-none font-bold">{p.parcelWeight} kg</span>
                </div>
              </div>
              
              <div className="space-y-4 text-sm mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pickup Details */}
                <div className="bg-gray-50 p-4 rounded-2xl border">
                  <h3 className="font-bold text-[#00302E] border-b pb-1 mb-2 text-xs uppercase tracking-tighter">Pickup</h3>
                  <p className="font-bold">Name: {p.senderName}</p>
                  <p className="font-bold"> {p.senderEmail}</p>
                  <p className="text-blue-600 font-medium mb-1">Phone: {p.senderPhone || "nai"}</p>
                  <p className="text-gray-600 text-xs">Address: {p.senderAddress}, {p.senderDistrict}</p>
                  {p.pickupInstruction && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded-lg text-[10px] italic text-gray-500">
                      <span className="font-bold text-yellow-700 not-italic">Instruction:</span> {p.pickupInstruction}
                    </div>
                  )}
                </div>

                {/* Drop-off Details */}
                <div className="bg-gray-50 p-4 rounded-2xl border">
                  <h3 className="font-bold text-[#00302E] border-b pb-1 mb-2 text-xs uppercase tracking-tighter">Drop-off</h3>
                  <p className="font-bold">Name: {p.receiverName}</p>
                  <p className="text-blue-600 font-medium mb-1">Phone: {p.receiverPhone}</p>
                  <p className="text-gray-600 text-xs">Address: {p.receiverAddress}, {p.receiverDistrict}</p>
                  {p.deliveryInstruction && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-lg text-[10px] italic text-gray-500">
                      <span className="font-bold text-green-700 not-italic">Note:</span> {p.deliveryInstruction}
                    </div>
                  )}
                </div>
              </div>

              {p.delivery_status === "rider-assigned" ? (
                <button
                  onClick={() => handleAction(p._id, "pickup")}
                  className="btn w-full bg-[#C8E46E] text-[#00302E] hover:bg-[#b8d45e] border-none rounded-xl font-bold shadow-md"
                >
                  Confirm Pickup
                </button>
              ) : (
                <button
                  onClick={() => handleAction(p._id, "deliver")}
                  className="btn w-full bg-[#00302E] text-white hover:bg-black border-none rounded-xl font-bold shadow-md"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 bg-gray-50 rounded-3xl text-center mb-12 border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-gray-500 font-medium italic">No active assignments. You're ready for new tasks!</p>
        </div>
      )}

      {/* ৭. History Section */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 uppercase tracking-tight">Earning History</h2>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th>Tracking ID</th>
              <th>Destination</th>
              <th>Parcel</th>
              <th>Earnings (calc)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {deliveredParcels.length > 0 ? (
              deliveredParcels.map((p: any) => {
                const sDist = (p.senderDistrict || "").toLowerCase().trim();
                const rDist = (p.receiverDistrict || "").toLowerCase().trim();
                const isSame = sDist === rDist && sDist !== "";
                const displayEarnings = p.riderEarnings > 0 ? p.riderEarnings : (Number(p.cost) || 0) * (isSame ? 0.80 : 0.30);

                return (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="font-mono text-xs font-bold text-blue-600">{p.trackingId}</td>
                    <td>
                      <div className="font-bold">{p.receiverName}</div>
                      <div className="text-xs text-gray-400">{p.receiverDistrict}</div>
                    </td>
                    <td className="text-sm">{p.parcelName} ({p.parcelWeight}kg)</td>
                    <td className="font-bold text-green-600">৳ {displayEarnings.toFixed(2)}</td>
                    <td className="text-gray-500 text-sm">
                      {p.deliveredAt ? new Date(p.deliveredAt).toLocaleDateString() : "Historical"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">Your delivery history will appear here.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiderDashboard;