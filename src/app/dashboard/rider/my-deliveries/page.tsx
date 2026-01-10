"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

const RiderDashboard = () => {
  const { data: session } = useSession();
  const [allParcels, setAllParcels] = useState([]);
  const [riderInfo, setRiderInfo] = useState<any>(null); 
  const [loading, setLoading] = useState(true);

  const fetchRiderData = async () => {
    if (!session?.user?.email) return;
    try {
      // রাইডার প্রোফাইল এবং পার্সেল ডাটা একই সাথে ফেচ করা
      const [parcelRes, profileRes] = await Promise.all([
        fetch(`/api/rider/parcels?email=${session.user.email}`),
        fetch(`/api/rider/profile?email=${session.user.email}`)
      ]);

      if (!parcelRes.ok || !profileRes.ok) {
        throw new Error("API Connection Failed");
      }

      const parcelData = await parcelRes.json();
      const profileData = await profileRes.json();

      setAllParcels(Array.isArray(parcelData) ? parcelData : []);
      setRiderInfo(profileData);

    } catch (err) {
      console.error("Sync Error:", err);
      toast.error("Sync Error: Please check API or Database connection");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderData();
  }, [session]);

  const deliveredParcels = allParcels.filter((p: any) => p.delivery_status === "delivered");
  const activeTasks = allParcels.filter((p: any) => 
    ["rider-assigned", "transit"].includes(p.delivery_status)
  );

  // মোট আয় ক্যালকুলেশন
  const totalEarnings = deliveredParcels.reduce((sum, p: any) => {
    if (p.riderEarnings && p.riderEarnings > 0) return sum + p.riderEarnings;
    const sDist = (p.senderDistrict || "").toLowerCase().trim();
    const rDist = (p.receiverDistrict || "").toLowerCase().trim();
    const isSame = sDist === rDist && sDist !== "";
    return sum + (Number(p.cost) || 0) * (isSame ? 0.80 : 0.30);
  }, 0);

  // ব্যালেন্স লজিক: মোট আয় - উইথড্র করা টাকা
  const currentBalance = totalEarnings - (Number(riderInfo?.withdrawnAmount) || 0);

  const handleCashout = async () => {
    if (currentBalance < 500) {
      return Swal.fire("Insufficient Balance", "Min ৳ 500 needed", "warning");
    }

    const result = await Swal.fire({
      title: "Request Cashout?",
      text: `Amount: ৳ ${currentBalance.toFixed(2)}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00302E",
    });

    if (result.isConfirmed) {
      const res = await fetch("/api/rider/cashout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riderEmail: session?.user?.email, amount: currentBalance }),
      });
      if (res.ok) {
        Swal.fire("Success", "Request Sent", "success");
        fetchRiderData();
      }
    }
  };

  const handleAction = async (parcelId: string, action: string) => {
    const res = await fetch("/api/rider/parcels", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parcelId, riderEmail: session?.user?.email, action }),
    });
    if (res.ok) {
      toast.success("Updated!");
      fetchRiderData();
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-bold">Connecting...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="stat bg-white shadow-md border rounded-2xl">
          <div className="stat-title font-bold text-xs uppercase">Lifetime Earn</div>
          <div className="stat-value text-green-600">৳ {totalEarnings.toFixed(2)}</div>
        </div>
        <div className="stat bg-white shadow-md border rounded-2xl">
          <div className="stat-title font-bold text-xs uppercase">Withdrawn</div>
          <div className="stat-value text-red-500">৳ {(Number(riderInfo?.withdrawnAmount) || 0).toFixed(2)}</div>
        </div>
        <div className="stat bg-[#00302E] text-white shadow-md rounded-2xl flex flex-col justify-between">
          <div>
            <div className="stat-title font-bold text-xs uppercase text-gray-300">Net Balance</div>
            <div className="stat-value text-[#C8E46E]">৳ {currentBalance.toFixed(2)}</div>
          </div>
          <button onClick={handleCashout} disabled={currentBalance <= 0} className="btn btn-xs bg-[#C8E46E] text-[#00302E] font-bold border-none mt-2">Cashout</button>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">ACTIVE TASKS</h2>
      {activeTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {activeTasks.map((p: any) => (
            <div key={p._id} className="bg-white p-6 rounded-3xl shadow-md border-2 border-[#C8E46E]">
              <p className="font-bold mb-4">Tracking: {p.trackingId}</p>
              <button onClick={() => handleAction(p._id, p.delivery_status === "rider-assigned" ? "pickup" : "deliver")} className="btn btn-sm w-full bg-[#00302E] text-white">
                {p.delivery_status === "rider-assigned" ? "Pick Up" : "Mark Delivered"}
              </button>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-400 italic mb-10">No active tasks.</p>}

      <h2 className="text-xl font-bold mb-4">HISTORY</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="table w-full">
          <thead><tr><th>ID</th><th>Earnings</th><th>Date</th></tr></thead>
          <tbody>
            {deliveredParcels.map((p: any) => (
              <tr key={p._id}>
                <td>{p.trackingId}</td>
                <td className="font-bold text-green-600">৳ {(p.riderEarnings || 0).toFixed(2)}</td>
                <td>{p.deliveredAt ? new Date(p.deliveredAt).toLocaleDateString() : "History"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiderDashboard;