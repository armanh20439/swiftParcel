"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import ChatBox from "@/components/Chat/ChatBox"; 

const RiderDashboard = () => {
  const { data: session } = useSession();
  const [allParcels, setAllParcels] = useState([]);
  const [riderProfile, setRiderProfile] = useState<any>(null); // State for withdrawnAmount
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<any>(null);
  

  // 1. Fetch Rider-specific Parcels and Profile
  const fetchRiderData = async () => {
    if (!session?.user?.email) return;
    try {
      // Fetch Parcels
      const resParcels = await fetch(`/api/rider/parcels?email=${session.user.email}`);
      const dataParcels = await resParcels.json();
      setAllParcels(Array.isArray(dataParcels) ? dataParcels : []);

      // Fetch Rider Profile for withdrawnAmount
      const resProfile = await fetch(`/api/rider/profile?email=${session.user.email}`);
      const dataProfile = await resProfile.json();
      setRiderProfile(dataProfile);
    } catch (err) {
      toast.error("Failed to sync with server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderData();
  }, [session]);

  // 2. Logic for filtering tasks
  const activeTasks = allParcels.filter((p: any) => 
    p.delivery_status === "rider-assigned" || p.delivery_status === "transit"
  );
  const deliveredParcels = allParcels.filter((p: any) => p.delivery_status === "delivered");

  // 3. Lifetime Earnings Calculation
  const totalLifetimeEarnings = deliveredParcels.reduce((sum, p: any) => {
    if (p.riderEarnings && p.riderEarnings > 0) {
      return sum + p.riderEarnings;
    }
    const sDist = (p.senderDistrict || "").toLowerCase().trim();
    const rDist = (p.receiverDistrict || "").toLowerCase().trim();
    const isSame = sDist === rDist && sDist !== "";
    const manualCalc = (Number(p.cost) || 0) * (isSame ? 0.80 : 0.30);
    return sum + manualCalc;
  }, 0);

  // Available Balance Logic: Total Earnings - Amount already withdrawn
  const availableBalance = totalLifetimeEarnings - (riderProfile?.withdrawnAmount || 0);

  // 4. Status Update Actions (Pickup/Deliver)
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

  // 5. Cashout Logic
  const handleCashout = async () => {
    if (availableBalance <= 0) return;

    const result = await Swal.fire({
      title: "Request Cashout?",
      text: `Your available balance is ৳ ${availableBalance.toFixed(2)}. Send request to admin?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Request",
      confirmButtonColor: "#C8E46E",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch("/api/rider/cashout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            riderEmail: session?.user?.email,
            riderName: session?.user?.name,
            amount: availableBalance
          }),
        });

        if (res.ok) {
          Swal.fire("Requested!", "Your cashout request has been sent to admin.", "success");
          fetchRiderData(); 
        } else {
          toast.error("Failed to process request");
        }
      } catch (error) {
        toast.error("Network error");
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="stat bg-white shadow-md rounded-2xl border border-gray-100">
          <div className="stat-title text-gray-500 font-bold">Total Delivered</div>
          <div className="stat-value text-green-600">{deliveredParcels.length}</div>
          <div className="stat-desc font-medium">Completed Deliveries</div>
        </div>
        
        <div className="stat bg-white shadow-md rounded-2xl border border-gray-100">
          <div className="stat-title text-gray-500 font-bold">Lifetime Earnings</div>
          <div className="stat-value text-blue-600">৳ {totalLifetimeEarnings.toFixed(2)}</div>
          <div className="stat-desc font-medium text-xs">Total earned since joining</div>
        </div>

        <div className="stat bg-[#00302E] text-white shadow-md rounded-2xl flex flex-col justify-between">
          <div>
            <div className="stat-title text-gray-300 font-bold">Available Balance</div>
            <div className="stat-value text-[#C8E46E]">৳ {availableBalance.toFixed(2)}</div>
          </div>
          <div className="mt-2">
             <button 
                onClick={handleCashout}
                disabled={availableBalance <= 0}
                className="btn btn-xs bg-[#C8E46E] text-[#00302E] border-none hover:bg-white font-bold disabled:bg-gray-700"
             >
                Cashout
             </button>
          </div>
        </div>
      </div>

      {/* Active Assignments */}
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
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveChat(p)} 
                    className="btn btn-xs btn-outline border-gray-300 text-[#00302E]"
                  >
                    💬 Chat
                  </button>
                  <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${p.delivery_status === 'transit' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                    {p.delivery_status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-800 uppercase tracking-tighter mb-1">Parcel Information</p>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-700">{p.parcelName}</span>
                  <span className="badge badge-sm bg-blue-200 text-blue-800 border-none font-bold">{p.parcelWeight} kg</span>
                </div>
              </div>
              
              <div className="space-y-4 text-sm mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border">
                  <h3 className="font-bold text-[#00302E] border-b pb-1 mb-2 text-xs uppercase tracking-tighter">Pickup</h3>
                  <p className="font-bold">{p.senderName}</p>
                  <p className="text-blue-600 font-medium mb-1">📞 {p.senderPhone || "N/A"}</p>
                  <p className="text-gray-600 text-[11px] leading-tight">{p.senderAddress}, {p.senderDistrict}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border">
                  <h3 className="font-bold text-[#00302E] border-b pb-1 mb-2 text-xs uppercase tracking-tighter">Drop-off</h3>
                  <p className="font-bold">{p.receiverName}</p>
                  <p className="text-blue-600 font-medium mb-1">📞 {p.receiverPhone || "N/A"}</p>
                  <p className="text-gray-600 text-[11px] leading-tight">{p.receiverAddress}, {p.receiverDistrict}</p>
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
          <p className="text-gray-500 font-medium italic">All clear! No active tasks at the moment.</p>
        </div>
      )}

      {/* Delivery History */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 uppercase tracking-tight">Delivery History</h2>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th>Tracking ID</th>
              <th>Recipient</th>
              <th>Parcel</th>
              <th>Earnings</th>
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

      {activeChat && (
        <ChatBox 
          parcelId={activeChat._id}
          senderEmail={session?.user?.email}
          receiverEmail={activeChat.senderEmail}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
};

export default RiderDashboard;