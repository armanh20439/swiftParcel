// components/ParcelCard.tsx
import React from "react";

type Props = {
  parcel: any;
};

export default function ParcelCard({ parcel }: Props) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">Tracking</p>
          <p className="font-mono font-semibold">{parcel.trackingId}</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Status</p>
          <p className="badge badge-outline">{parcel.delivery_status ?? parcel.status ?? "paid"}</p>
        </div>
      </div>

      <hr className="my-3" />

      <p><b>Parcel:</b> {parcel.parcelName}</p>
      <p><b>Type:</b> {parcel.parcelType}</p>
      <p><b>Weight:</b> {parcel.parcelWeight ?? 0} kg</p>

      <div className="mt-3 text-sm text-gray-600">
        <p><b>From:</b> {parcel.senderName} — {parcel.senderDistrict}</p>
        <p><b>To:</b> {parcel.receiverName} — {parcel.receiverDistrict}</p>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <div>
          <p><b>Price:</b> {parcel.cost ?? parcel.price ?? 0} TK</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">
            {new Date(parcel.createdAt ?? parcel.createdAt ?? parcel.createdAt || Date.now()).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
