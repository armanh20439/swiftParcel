"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Define the shape of our coverage data
interface CoverageItem {
  region: string;
  district: string;
  city: string;
  covered_area: string[];
  status: string;
}

const BeARider = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  // use react hook form
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      age: "",
      region: "",
      district: "",
      nid: "",
      contact: "",
      bikeReg: "",
      wirehouse: ""
    }
  });

  const [serviceCenters, setServiceCenters] = useState<CoverageItem[]>([]);

 
  useEffect(() => {
    fetch("/data/coverageData.json")
      .then((res) => res.json())
      .then((data) => setServiceCenters(data));
  }, []);

  // 2. Auto-fill Form when Session is available
  useEffect(() => {
    if (session?.user) {
      setValue("name", session.user.name || "");
      setValue("email", session.user.email || "");
    }
  }, [session, setValue]);

  //  Page Protection
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  //  Watch Region to filter District
  const selectedRegion = useWatch({ control, name: "region" });
  const regions = [...new Set(serviceCenters.map((c) => c.region))];

  const districtsByRegion = (regionName: string) =>
    serviceCenters.filter((i) => i.region === regionName).map((d) => d.district);

  // 5. Submit Handler
  const onSubmit = async (data: any) => {
    const riderApplication = {
      ...data,
      userId: (session?.user as any)?.id, 
      email: session?.user?.email, 
      status: "pending",
      workStatus: "available", 
    };

    Swal.fire({
      title: "Confirm Application?",
      text: "Submit your rider application to the database?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Submit",
      confirmButtonColor: "#C8E46E",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch("/api/rider-applications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(riderApplication),
          });

          const resData = await res.json();

          if (res.ok) {
            Swal.fire("Success", resData.message, "success");
            reset();
          } else {
            Swal.fire("Error", resData.message || "Failed to submit", "error");
          }
        } catch (error) {
          Swal.fire("Error", "Network error. Please try again.", "error");
        }
      }
    });
  };

  if (status === "loading") return <div className="p-10 text-center font-bold">Loading Session...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
        
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#00302E] mb-4">Be a Rider</h1>
          <p className="text-gray-500 text-lg">
            Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
          </p>
        </div>

        <hr className="mb-10 border-gray-100" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#00302E] mb-6">Tell us about yourself</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label font-medium">Your Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="input input-bordered w-full bg-gray-50"
                placeholder="Full Name"
              />
              {errors.name && <span className="text-red-500 text-xs">{errors.name.message as string}</span>}
            </div>

            <div className="form-control">
              <label className="label font-medium">Your age</label>
              <input
                type="number"
                {...register("age", { required: "Age is required" })}
                className="input input-bordered w-full"
                placeholder="Age"
              />
            </div>

            <div className="form-control">
              <label className="label font-medium">Your Email</label>
              <input
                {...register("email")}
                readOnly
                className="input input-bordered w-full bg-gray-100 cursor-not-allowed text-gray-500"
              />
            </div>

            <div className="form-control">
              <label className="label font-medium">Your Region</label>
              <select 
                {...register("region", { required: "Region is required" })} 
                className="select select-bordered w-full"
              >
                <option value="">Pick region</option>
                {regions.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label font-medium">Your District</label>
              <select 
                {...register("district", { required: "District is required" })} 
                disabled={!selectedRegion}
                className="select select-bordered w-full disabled:bg-gray-100"
              >
                <option value="">Pick district</option>
                {districtsByRegion(selectedRegion).map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label font-medium">NID No</label>
              <input 
                {...register("nid", { required: "NID is required" })} 
                className="input input-bordered w-full" 
                placeholder="NID Number"
              />
            </div>

            <div className="form-control">
              <label className="label font-medium">Contact</label>
              <input 
                {...register("contact", { required: "Contact is required" })} 
                className="input input-bordered w-full" 
                placeholder="Phone Number"
              />
            </div>

            <div className="form-control">
              <label className="label font-medium">Bike Registration Number</label>
              <input 
                {...register("bikeReg", { required: "Registration is required" })} 
                className="input input-bordered w-full" 
                placeholder="e.g. DHAKA METRO-LA-12-3456"
              />
            </div>

            <div className="form-control">
              <label className="label font-medium">Which wire-house you want to work?</label>
              <input 
                {...register("wirehouse", { required: "Warehouse selection required" })} 
                className="input input-bordered w-full" 
                placeholder="e.g. Dhaka Main Warehouse"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#C8E46E] hover:bg-[#b8d45e] text-[#00302E] font-bold py-4 rounded-xl shadow-lg transition-all border-none mt-8"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default BeARider;