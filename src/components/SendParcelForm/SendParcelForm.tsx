"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      parcelType: "non-document",
      parcelName: "",
      parcelWeight: "",
      senderName: "",
      senderEmail: "",
      senderPhone: "", // Added
      senderRegion: "",
      senderDistrict: "",
      senderAddress: "",
      pickupInstruction: "",
      receiverName: "",
      receiverEmail: "",
      receiverPhone: "", // Added
      receiverRegion: "",
      receiverDistrict: "",
      receiverAddress: "",
      deliveryInstruction: ""
    }
  });

  const [serviceCenters, setServiceCenters] = useState<CoverageItem[]>([]);

  // Load coverage data
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
    const weight = parseFloat(data.parcelWeight || "0");

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

    const trackingId = "TRK-" + crypto.randomUUID().slice(0, 8).toUpperCase();

    const parcelData = {
      ...data,
      cost: total,
      createdByEmail: session?.user?.email || "unknown",
      createdAt: new Date().toISOString(),
      trackingId,
      payment_status: "unpaid",
      delivery_status: "not_collected",
      costBreakdown: { base, extra, total },
      
      riderId: null,
      riderInfo: {
        name: "",
        email: "",
      },
      assignedAt: null,
      pickedUpAt: null,
      deliveredAt: null,
      riderEarnings: 0 // Added default
    };

    // Confirm price breakdown with user
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch("/api/parcels", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parcelData),
          });

          if (response.ok) {
            Swal.fire({
              title: "Success",
              text: "Parcel saved successfully! Redirecting...",
              icon: "success",
              timer: 2000,
              showConfirmButton: false
            });

            reset();
            setTimeout(() => {
              router.push("/dashboard/my-parcels"); 
            }, 2000);
            
          } else {
            Swal.fire("Error", "Failed to save parcel to database.", "error");
          }
        } catch (error) {
          console.error("SAVE ERROR:", error);
          Swal.fire("Error", "Network error occurred while saving.", "error");
        }
      }
    });
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-10 text-gray-800">Send A Parcel</h2>

      <form onSubmit={handleSubmit(handleSendParcel)} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex gap-6 mb-8">
          <label className="label cursor-pointer flex gap-2">
            <input
              type="radio"
              {...register("parcelType")}
              value="document"
              className="radio radio-primary"
            />
            <span className="label-text font-medium">Document</span>
          </label>

          <label className="label cursor-pointer flex gap-2">
            <input
              type="radio"
              {...register("parcelType")}
              value="non-document"
              className="radio radio-primary"
            />
            <span className="label-text font-medium">Non-Document</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div>
            <label className="label font-semibold">Parcel Name</label>
            <input
              {...register("parcelName", { required: "Parcel name required" })}
              className="input input-bordered w-full"
              placeholder="e.g. Laptop, Books"
            />
            {errors.parcelName && <span className="text-error text-sm">{errors.parcelName.message as any}</span>}
          </div>

          <div>
            <label className="label font-semibold">Parcel Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              {...register("parcelWeight", {
                required: parcelType === "non-document" ? "Weight required" : false,
                min: { value: 0, message: "Weight cannot be negative" },
              })}
              className="input input-bordered w-full"
              disabled={parcelType === "document"}
              placeholder="0.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Sender Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6 text-primary border-b pb-2">Sender Details</h3>

            <label className="label font-medium">Name</label>
            <input
              {...register("senderName", { required: "Sender name required" })}
              className="input input-bordered w-full"
              defaultValue={session?.user?.name || ""}
            />

            <label className="label font-medium">Email</label>
            <input
              {...register("senderEmail", { required: "Email required" })}
              className="input input-bordered w-full"
              defaultValue={session?.user?.email || ""}
            />

            {/* Added Sender Phone */}
            <label className="label font-medium">Phone Number</label>
            <input
              {...register("senderPhone", { required: "Phone number required" })}
              className="input input-bordered w-full"
              placeholder="01XXXXXXXXX"
            />

            <label className="label font-medium">Sender Region</label>
            <select {...register("senderRegion", { required: "Region is required" })} className="select select-bordered w-full">
              <option value="">Pick region</option>
              {regions.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>

            <label className="label font-medium">Sender District</label>
            <select {...register("senderDistrict", { required: "District is required" })} className="select select-bordered w-full">
              <option value="">Pick district</option>
              {districtsByRegion(senderRegion).map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>

            <label className="label font-medium">Sender Address</label>
            <input
              {...register("senderAddress", { required: "Address required" })}
              className="input input-bordered w-full"
              placeholder="House #, Road #, Area"
            />

            <label className="label font-medium">Pickup Instruction</label>
            <textarea {...register("pickupInstruction")} className="textarea textarea-bordered w-full" placeholder="e.g. Call before coming"></textarea>
          </div>

          {/* Receiver Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6 text-secondary border-b pb-2">Receiver Details</h3>

            <label className="label font-medium">Name</label>
            <input
              {...register("receiverName", { required: "Receiver name required" })}
              className="input input-bordered w-full"
            />

            <label className="label font-medium">Email</label>
            <input
              {...register("receiverEmail", { required: "Email required" })}
              className="input input-bordered w-full"
            />

            {/* Added Receiver Phone */}
            <label className="label font-medium">Phone Number</label>
            <input
              {...register("receiverPhone", { required: "Phone number required" })}
              className="input input-bordered w-full"
              placeholder="01XXXXXXXXX"
            />

            <label className="label font-medium">Receiver Region</label>
            <select {...register("receiverRegion", { required: "Region is required" })} className="select select-bordered w-full">
              <option value="">Pick region</option>
              {regions.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>

            <label className="label font-medium">Receiver District</label>
            <select {...register("receiverDistrict", { required: "District is required" })} className="select select-bordered w-full">
              <option value="">Pick district</option>
              {districtsByRegion(receiverRegion).map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>

            <label className="label font-medium">Receiver Address</label>
            <input
              {...register("receiverAddress", { required: "Address required" })}
              className="input input-bordered w-full"
            />

            <label className="label font-medium">Delivery Instruction</label>
            <textarea {...register("deliveryInstruction")} className="textarea textarea-bordered w-full"></textarea>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-full mt-12 text-white shadow-lg">
          Send Parcel
        </button>
      </form>
    </div>
  );
};

export default SendParcel;