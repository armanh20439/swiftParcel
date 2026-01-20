"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import ChatBox from "@/components/Chat/ChatBox"; 
import { CheckCircle, MessageCircle, Package, Calendar, User } from "lucide-react";

const FinishedDeliveries = () => {
  const { data: session } = useSession();
  const [deliveredParcels, setDeliveredParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<any>(null);

  // complete delivery data
  const fetchFinishedData = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`/api/rider/parcels?email=${session.user.email}`);
      const data = await res.json();
      
      // find deliverh status
      const finished = Array.isArray(data) 
        ? data.filter((p: any) => p.delivery_status === "delivered") 
        : [];
      
      setDeliveredParcels(finished);
    } catch (err) {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinishedData();
  }, [session]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <span className="loading loading-spinner loading-lg text-[#00302E]"></span>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <Toaster />
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-100 rounded-2xl">
          <CheckCircle className="text-green-600 w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-tight">Finished Deliveries</h1>
          <p className="text-gray-500 font-medium text-sm">Review your successful delivery history and earnings</p>
        </div>
      </div>

      {deliveredParcels.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deliveredParcels.map((p: any) => {
            // earning calculation
            const sDist = (p.senderDistrict || "").toLowerCase().trim();
            const rDist = (p.receiverDistrict || "").toLowerCase().trim();
            const isSame = sDist === rDist && sDist !== "";
            const earnings = p.riderEarnings > 0 ? p.riderEarnings : (Number(p.cost) || 0) * (isSame ? 0.80 : 0.30);

            return (
              <div key={p._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header: Tracking & Date */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Tracking ID</span>
                      <h3 className="font-mono text-lg font-bold text-blue-600">{p.trackingId}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Delivered On</span>
                      <div className="flex items-center gap-1 text-gray-600 font-medium">
                        <Calendar size={14} />
                        <span className="text-sm">{p.deliveredAt ? new Date(p.deliveredAt).toLocaleDateString() : "Historical"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Parcel Info Section */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-2 text-blue-800">
                        <Package size={16} />
                        <span className="text-xs font-bold uppercase tracking-tighter">Parcel Info</span>
                      </div>
                      <p className="font-bold text-gray-800 text-sm">{p.parcelName}</p>
                      <p className="text-xs text-gray-500">{p.parcelWeight} kg • {p.parcelType}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                      <div className="flex items-center gap-2 mb-2 text-green-800">
                        <span className="text-lg">৳</span>
                        <span className="text-xs font-bold uppercase tracking-tighter">Your Earning</span>
                      </div>
                      <p className="font-bold text-green-700 text-xl">৳ {earnings.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Sender/User Info & Chat */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-[#00302E] text-white rounded-full w-10">
                          <span className="text-xs font-bold">{p.senderName?.charAt(0)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Sender</p>
                        <p className="font-bold text-gray-800 text-sm">{p.senderName}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setActiveChat(p)}
                      className="btn btn-sm bg-[#00302E] text-white hover:bg-black border-none rounded-xl gap-2 normal-case font-bold"
                    >
                      <MessageCircle size={16} />
                      Chat with User
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-xl font-bold text-gray-700">No finished deliveries yet!</h2>
          <p className="text-gray-500">Complete assignments to build your history.</p>
        </div>
      )}

      {/* Floating ChatBox */}
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

export default FinishedDeliveries;