"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const CompletedDeliveries = () => {
  const { data: session } = useSession();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/rider/parcels/history?email=${session.user.email}`);
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [session]);

  // মোট ইনকাম ক্যালকুলেট করা
  const totalEarnings = history.reduce((sum, p: any) => sum + (p.riderEarnings || 0), 0);

  if (loading) return <div className="p-10 text-center">Loading History...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Delivery History</h1>
        
        {/* Earnings Card */}
        <div className="bg-[#00302E] text-white p-4 rounded-2xl shadow-lg flex items-center gap-4">
          <div>
            <p className="text-xs opacity-70 uppercase tracking-widest">Available Balance</p>
            <h2 className="text-2xl font-bold">৳ {totalEarnings.toFixed(2)}</h2>
          </div>
          <button className="btn btn-sm bg-[#C8E46E] text-[#00302E] border-none hover:bg-white">
            Cashout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <table className="table w-full">
          <thead className="bg-gray-50">
            <tr>
              <th>Tracking ID</th>
              <th>Destination</th>
              <th>Type</th>
              <th>Earnings</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((p: any) => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="font-mono text-blue-600 font-bold">{p.trackingId}</td>
                  <td>{p.receiverDistrict}</td>
                  <td>
                    <span className={`badge badge-sm ${p.senderDistrict === p.receiverDistrict ? 'badge-ghost' : 'badge-outline'}`}>
                      {p.senderDistrict === p.receiverDistrict ? 'Same District' : 'Other District'}
                    </span>
                  </td>
                  <td className="font-bold text-green-600">৳ {p.riderEarnings?.toFixed(2)}</td>
                  <td className="text-gray-500">{new Date(p.deliveredAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">No completed deliveries yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedDeliveries;