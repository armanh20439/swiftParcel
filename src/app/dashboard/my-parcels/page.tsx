"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ChatBox from "@/components/Chat/ChatBox"; 

export interface ParcelType {
  _id: string;
  trackingId: string;
  parcelName: string;
  parcelType: string;
  parcelWeight: number;
  cost: number;
  payment_status: "paid" | "unpaid";
  delivery_status: string;
  senderName: string;
  senderPhone: string;
  senderDistrict: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverDistrict: string;
  receiverAddress: string;
  costBreakdown?: {
    base: number;
    extra: number;
    total: number;
  };
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  riderInfo?: {
    name: string;
    email: string;
  };
  riderPhone?: string; 
}

export default function MyParcels() {
  const { data: session, status } = useSession();
  const [parcels, setParcels] = useState<ParcelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<ParcelType | null>(null);

  useEffect(() => {
    const email = session?.user?.email;
    if (status !== "authenticated" || !email) return;

    const loadParcels = async () => {
      try {
        const res = await fetch(`/api/parcels?email=${email}`);
        const data = await res.json();
        setParcels(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadParcels();
  }, [session, status]);

  // 1. Digital Receipt Generator
  const downloadInvoice = (parcel: ParcelType) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(0, 48, 46); 
    doc.text("SwiftParcel Invoice", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 28, { align: "center" });

    doc.setDrawColor(200);
    doc.rect(14, 35, 182, 30); 
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Tracking ID: ${parcel.trackingId}`, 20, 45);
    doc.text(`Payment Status: ${parcel.payment_status.toUpperCase()}`, 20, 52);
    doc.text(`Delivery Status: ${parcel.delivery_status.replace('-', ' ').toUpperCase()}`, 20, 59);

    autoTable(doc, {
      startY: 75,
      head: [['Sender Details', 'Receiver Details']],
      body: [
        [
          `Name: ${parcel.senderName}\nPhone: ${parcel.senderPhone}\nDistrict: ${parcel.senderDistrict}\nAddress: ${parcel.senderAddress}`,
          `Name: ${parcel.receiverName}\nPhone: ${parcel.receiverPhone}\nDistrict: ${parcel.receiverDistrict}\nAddress: ${parcel.receiverAddress}`
        ]
      ],
      theme: 'striped',
      headStyles: { fillStyle: 'fill', fillColor: [0, 48, 46] },
    });

    const isDocument = parcel.parcelType === "document";
    const weight = parcel.parcelWeight || 0;
    const baseCharge = parcel.costBreakdown?.base || 0;
    const extraCharge = parcel.costBreakdown?.extra || 0;
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Description', 'Calculation Details', 'Amount']],
      body: [
        [`Parcel: ${parcel.parcelName}`, `Type: ${isDocument ? "Document" : "Non-Document"}\nWeight: ${weight} KG`, `--`],
        ["Base Charge", isDocument ? "Fixed rate" : "Up to 3 KG", `${baseCharge} TK`],
        ["Extra Weight", weight > 3 ? `${(weight - 3).toFixed(1)} KG extra` : "No extra", `${extraCharge} TK`]
      ],
      foot: [['', 'Total Amount:', `${parcel.cost} TK`]],
      footStyles: { fillColor: [200, 228, 110], textColor: [0, 48, 46] },
      theme: 'grid'
    });

    doc.save(`Receipt_${parcel.trackingId}.pdf`);
  };

  // 2. Real-time Tracking Modal
  const handleTrack = (parcel: ParcelType) => {
    const statuses = ["not_collected", "rider-assigned", "transit", "delivered"];
    const currentIndex = statuses.indexOf(parcel.delivery_status);
    const getStepClass = (index: number) => index <= currentIndex ? "step-success" : "";

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

    const riderDetailsHtml = parcel.riderInfo?.name ? `
      <div class="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-left">
        <p class="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-2">Assigned Rider Info</p>
        <div class="flex items-center gap-3">
          <div class="avatar placeholder">
            <div class="bg-blue-600 text-white rounded-full w-8"><span>${parcel.riderInfo.name.charAt(0)}</span></div>
          </div>
          <div>
            <p class="text-sm font-bold text-gray-800">${parcel.riderInfo.name}</p>
            <p class="text-xs text-blue-700 font-medium">${parcel.riderPhone || "Contact via Chat"}</p>
          </div>
        </div>
      </div>` : "";

    Swal.fire({
      title: `Tracking: ${parcel.trackingId}`,
      html: `
        <div class="py-4 font-sans">
          <ul class="steps steps-vertical lg:steps-horizontal w-full text-xs">
            <li class="step ${getStepClass(0)}">Pending</li>
            <li class="step ${getStepClass(1)}">Assigned</li>
            <li class="step ${getStepClass(2)}">Transit</li>
            <li class="step ${getStepClass(3)}">Delivered</li>
          </ul>
          <div class="mt-8 text-left p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p class="text-sm"><b>Status:</b> <span class="badge badge-primary ml-2 capitalize">${parcel.delivery_status.replace('-', ' ')}</span></p>
            <p class="text-[10px] text-gray-500 mt-2 uppercase"><b>${lastUpdateLabel}</b> ${updateTime}</p>
            ${riderDetailsHtml}
          </div>
        </div>`,
      confirmButtonText: "Close",
      confirmButtonColor: "#00302E",
    });
  };

  const handlePayment = async (id: string) => {
    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcelId: id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      Swal.fire("Error", "Payment error!", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Delete Parcel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/parcels/${id}`, { method: "DELETE" });
        if (res.ok) {
          setParcels((prev) => prev.filter((p) => p._id !== id));
          Swal.fire("Deleted", "", "success");
        }
      } catch (error) { console.error(error); }
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
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
              <th>Status</th>
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
                  <td className="font-bold">{p.cost} TK</td>
                  <td>
                    <span className={`badge p-3 font-semibold ${p.payment_status === "paid" ? "badge-success" : "badge-warning text-white"}`}>
                      {p.payment_status}
                    </span>
                  </td>
                  <td className="flex gap-2 items-center">
                    <button onClick={() => handleTrack(p)} className="btn btn-info btn-sm text-white">Track</button>
                    
                    {p.payment_status === "paid" && (
                      <button onClick={() => downloadInvoice(p)} className="btn btn-success btn-sm text-white">Receipt</button>
                    )}

                    {/* Chat Button: Enabled once a rider is assigned */}
                    {p.riderInfo?.email && (
                       <button 
                        onClick={() => setActiveChat(p)} 
                        className="btn btn-ghost btn-sm text-[#00302E] border-gray-200"
                        title="Chat with Rider"
                       >
                         💬 Chat
                       </button>
                    )}

                    {p.payment_status === "unpaid" && (
                      <button onClick={() => handlePayment(p._id)} className="btn btn-primary btn-sm">Pay</button>
                    )}

                    <button onClick={() => handleDelete(p._id)} className="btn btn-error btn-sm text-white">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="text-center py-20 text-gray-400">No parcels found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Chat Component */}
      {activeChat && (
        <ChatBox 
          parcelId={activeChat._id}
          senderEmail={session?.user?.email}
          receiverEmail={activeChat.riderInfo?.email}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
}