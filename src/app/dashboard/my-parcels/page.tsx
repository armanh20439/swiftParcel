"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export interface ParcelType {
  _id: string;
  trackingId: string;

  parcelName: string;
  parcelType: string;
  parcelWeight?: number;

  cost: number;
  costBreakdown: {
    base: number;
    extra: number;
    total: number;
  };

  senderName: string;
  senderEmail: string;
  senderRegion: string;
  senderDistrict: string;
  senderAddress: string;
  pickupInstruction?: string;

  receiverName: string;
  receiverEmail: string;
  receiverRegion: string;
  receiverDistrict: string;
  receiverAddress: string;
  deliveryInstruction?: string;

  createdAt: string;
  createdByEmail: string;

  payment_status: string;
  delivery_status: string;
}

export default function MyParcels() {
  const { data: session } = useSession();
  const [parcels, setParcels] = useState<ParcelType[]>([]);
  const [loading, setLoading] = useState(true);

  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return;

    const fetchParcels = async () => {
      try {
        const res = await fetch(`/api/parcels?email=${email}`);
        const data = await res.json();
        setParcels(data.parcels || []);
        setLoading(false);
      } catch (error) {
        console.log("Fetch error:", error);
        setLoading(false);
      }
    };

    fetchParcels();
  }, [email]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Parcels</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Parcel Name</th>
              <th>Cost</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {parcels.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-5 text-gray-500">
                  No parcels found
                </td>
              </tr>
            )}

            {parcels.map((parcel: ParcelType, index: number) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>

                <td className="font-semibold">{parcel.trackingId}</td>

                <td>{parcel.parcelName}</td>

                <td>{parcel.cost} TK</td>

                <td>
                  <span
                    className={`badge text-amber-50 ${
                      parcel. payment_status === "unpaid"
                        ? "badge-warning"
                        : "badge-success"
                    }`}
                  >
                    {parcel. payment_status}
                  </span>
                </td>

                <td className="flex gap-2 justify-center">
                  {/* View Button */}
                  <button className="btn btn-sm btn-info">View</button>

                  {/* Pay Button */}
                  <button className="btn btn-sm btn-primary">Pay</button>

                  {/* Delete Button */}
                  <button className="btn btn-sm btn-error">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
