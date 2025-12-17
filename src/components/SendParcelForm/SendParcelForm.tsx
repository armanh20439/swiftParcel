"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";

import { useSession } from "next-auth/react";

type CoverageItem = {
  region: string;
  district: string;
  city: string;
  covered_area: string[];
  status: string;
  flowchart: string;
  longitude: number;
  latitude: number;
};

const SendParcel = () => {
  const { data: session } = useSession();
  

 const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,                    // এটা যোগ করো
    formState: { errors },
  } = useForm();

  const [serviceCenters, setServiceCenters] = useState<CoverageItem[]>([]);

  useEffect(() => {
    fetch("/data/coverageData.json")
      .then((res) => res.json())
      .then((data) => setServiceCenters(data));
  }, []);

  const parcelType = useWatch({ control, name: "parcelType" });
  const senderRegion = useWatch({ control, name: "senderRegion" });
  const receiverRegion = useWatch({ control, name: "receiverRegion" });

  const regions = [...new Set(serviceCenters.map((c) => c.region))];

  const districtsByRegion = (region: string) =>
    serviceCenters.filter((i) => i.region === region).map((d) => d.district);

  // Disable weight instantly for document
  useEffect(() => {
    if (parcelType === "document") {
      setValue("parcelWeight", "");
    }
  }, [parcelType, setValue]);

  // SUBMIT HANDLER -----------------------------------
  const handleSendParcel = async (data: any) => {
    const isDocument = data.parcelType === "document";
    const isSameDistrict = data.senderDistrict === data.receiverDistrict;
    const weight = parseFloat(data.parcelWeight || 0);

    let base = 0;
    let extra = 0;
    let total = 0;

    if (isDocument) {
      base = isSameDistrict ? 80 : 100;
      total = base;
    } else {
      base = isSameDistrict ? 110 : 150;

      if (weight > 3) {
        const extraKg = weight - 3;
        extra = isSameDistrict ? extraKg * 40 : extraKg * 80;
      }

      total = base + extra;
    }

    const trackingId =
      "TRK-" + crypto.randomUUID().slice(0, 8).toUpperCase();

    const parcelData = {
      ...data,
      cost: total,

      createdByEmail: session?.user?.email || "unknown",
      createdAt: new Date().toISOString(),
      trackingId,
      payment_status: "unpaid",
      delivery_status: "not_collected",

      costBreakdown: { base, extra, total },
    };

    // Confirm alert
    Swal.fire({
      title: "Price Breakdown",
      html: `
        <div style="text-align:left;font-size:16px;">
          <p><b>Parcel Type:</b> ${isDocument ? "Document" : "Non-document"}</p>
          <p><b>Same District:</b> ${isSameDistrict ? "Yes" : "No"}</p>
          <hr/>
          <p><b>Base Charge:</b> ${base} TK</p>
          ${extra > 0 ? `<p><b>Extra Charge:</b> ${extra} TK</p>` : ""}
          <hr/>
          <p style="font-size:20px;font-weight:800;color:#d9534f;">
            Total: ${total} TK
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirm & Save",
      cancelButtonText: "Back",
      icon: "info",
    }).then(async (res) => {
      if (res.isConfirmed) {
  fetch("/api/parcels", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parcelData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("SERVER RESPONSE:", data);
      
      Swal.fire("Success", "Parcel saved & proceeding to payment!", "success");
      reset();

     
    })
    .catch((error) => {
      console.error("SAVE ERROR:", error);
      Swal.fire("Error", "Failed to save parcel.", "error");
    });
}
reset()
      
    });
  };

  return (
    <div className="p-10">
      <h2 className="text-4xl font-bold">Send A Parcel</h2>

      <form onSubmit={handleSubmit(handleSendParcel)} className="mt-10">
        {/* Radio */}
        <div className="flex gap-6">
          <label className="label cursor-pointer">
            <input
              type="radio"
              {...register("parcelType")}
              value="document"
              
              className="radio"
            />
            Document
          </label>

          <label className="label cursor-pointer">
            <input
              type="radio"
              {...register("parcelType")}
              value="non-document"
              defaultChecked
              className="radio"
            />
            Non-Document
          </label>
        </div>

        {/* Parcel Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-10">
          <div>
            <label className="label">Parcel Name</label>
            <input
              {...register("parcelName", { required: "Parcel name required" })}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">Parcel Weight (kg)</label>
            <input
              type="number"
              {...register("parcelWeight", {
                required: parcelType === "non-document" ? "Weight required" : false,
                min: { value: 0, message: "Weight cannot be negative" },
              })}
              className="input input-bordered w-full"
              disabled={parcelType === "document"}
            />
          </div>
        </div>

        {/* Sender + Receiver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Sender */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Sender Details</h3>

            <label className="label">Name</label>
            <input
              {...register("senderName", { required: "Sender name required" })}
              className="input input-bordered w-full"
              placeholder={session?.user?.name ?? ""}
            />

            <label className="label mt-4">Email</label>
            <input
              {...register("senderEmail", { required: "Email required" })}
              className="input input-bordered w-full"
              placeholder={session?.user?.email ?? ""}
            />

            <label className="label mt-4">Sender Region</label>
            <select {...register("senderRegion")} className="select select-bordered w-full">
              <option value="">Pick region</option>
              {regions.map((r, i) => (
                <option key={i}>{r}</option>
              ))}
            </select>

            <label className="label mt-4">Sender District</label>
            <select {...register("senderDistrict")} className="select select-bordered w-full">
              <option value="">Pick district</option>
              {districtsByRegion(senderRegion).map((d, i) => (
                <option key={i}>{d}</option>
              ))}
            </select>

            <label className="label mt-4">Sender Address</label>
            <input
              {...register("senderAddress", { required: "Address required" })}
              className="input input-bordered w-full"
            />

            <label className="label mt-4">Pickup Instruction</label>
            <textarea {...register("pickupInstruction")} className="textarea textarea-bordered w-full"></textarea>
          </div>

          {/* Receiver */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Receiver Details</h3>

            <label className="label">Name</label>
            <input
              {...register("receiverName", { required: "Receiver name required" })}
              className="input input-bordered w-full"
            />

            <label className="label mt-4">Email</label>
            <input
              {...register("receiverEmail", { required: "Email required" })}
              className="input input-bordered w-full"
            />

            <label className="label mt-4">Receiver Region</label>
            <select {...register("receiverRegion")} className="select select-bordered w-full">
              <option value="">Pick region</option>
              {regions.map((r, i) => (
                <option key={i}>{r}</option>
              ))}
            </select>

            <label className="label mt-4">Receiver District</label>
            <select {...register("receiverDistrict")} className="select select-bordered w-full">
              <option value="">Pick district</option>
              {districtsByRegion(receiverRegion).map((d, i) => (
                <option key={i}>{d}</option>
              ))}
            </select>

            <label className="label mt-4">Receiver Address</label>
            <input
              {...register("receiverAddress", { required: "Address required" })}
              className="input input-bordered w-full"
            />

            <label className="label mt-4">Delivery Instruction</label>
            <textarea {...register("deliveryInstruction")} className="textarea textarea-bordered w-full"></textarea>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-10">
          Send Parcel
        </button>
      </form>
    </div>
  );
};

export default SendParcel;
