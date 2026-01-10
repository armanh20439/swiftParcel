"use client";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

const ParcelManagement = () => {
    const [parcels, setParcels] = useState([]);
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            // ১. পার্সেল ফেচ করা (ইমেইল ছাড়া সব পার্সেল আসবে)
            const parcelRes = await fetch("/api/parcels");
            if (!parcelRes.ok) throw new Error("Parcel fetch failed");
            const parcelData = await parcelRes.json();

            // Filter: Paid & Not Collected
            const readyParcels = parcelData.filter(
                (p: any) => p.payment_status === "paid" && p.delivery_status === "not_collected"
            );
            setParcels(readyParcels);

            // ২. একটিভ রাইডার ফেচ করা
            const riderRes = await fetch("/api/rider-applications");
            if (!riderRes.ok) throw new Error("Rider fetch failed");
            const riderData = await riderRes.json();
            setRiders(riderData.filter((r: any) => r.status === "approved"));

        } catch (err) {
            console.error(err);
            toast.error("Error loading data from database");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssign = async (parcelId: string, riderJson: string) => {
  if (!riderJson) return;
  const rider = JSON.parse(riderJson); // ড্রপডাউন থেকে পুরো রাইডার অবজেক্টটি নিন

  try {
    const res = await fetch("/api/admin/parcels/assign", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parcelId: parcelId,
        riderId: rider._id,      // রাইডারের আইডি
        riderName: rider.name,   // রাইডারের নাম
        riderEmail: rider.email, // রাইডারের ইমেইল
      }),
    });

    if (res.ok) {
      toast.success("Rider Assigned and Data Updated!");
      fetchData(); // আপনার ডাটা রিফ্রেশ ফাংশন
    } else {
      const error = await res.json();
      toast.error(error.message);
    }
  } catch (err) {
    toast.error("Network error!");
  }
};

    if (loading) return <div className="p-10 text-center font-bold">Connecting to Database...</div>;

    return (
        <div className="p-6">
            <Toaster position="top-right" />
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Parcel Assignment</h1>

            <div className="overflow-x-auto shadow-2xl rounded-2xl border border-gray-100 bg-white">
                <table className="table w-full">
                    <thead className="bg-gray-50 text-gray-700">
                        <tr>
                            <th>Tracking ID</th>
                            <th>Destination</th>
                            <th>Parcel Name</th>
                            <th>Assign Rider</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcels.map((parcel: any) => (
                            <tr key={parcel._id} className="border-b hover:bg-gray-50 transition">
                                <td className="font-mono text-sm font-bold text-blue-600">
                                    {parcel.trackingId}
                                </td>
                                <td>
                                    <div className="font-medium">{parcel.receiverDistrict}</div>
                                    <div className="text-xs text-gray-400">{parcel.receiverAddress}</div>
                                </td>
                                <td>{parcel.parcelName}</td>
                                <td>
                                    <select
                                        onChange={(e) => handleAssign(parcel._id, e.target.value)}
                                        className="select select-bordered select-sm w-full max-w-xs"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select a Rider</option>
                                        {riders.map((rider: any) => (
                                            <option
                                                key={rider._id}
                                                value={JSON.stringify(rider)}
                                                disabled={rider.workStatus === "in-delivery"} // 🚫 বিজি হলে ডিজেবল থাকবে
                                            >
                                                {rider.name} {rider.workStatus === "in-delivery" ? "(Busy)" : `(${rider.district})`}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {parcels.length === 0 && (
                    <div className="p-20 text-center text-gray-400">
                        No parcels are currently waiting for assignment. <br />
                        (Parcels must be <b>Paid</b> and <b>Not Collected</b>)
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParcelManagement;