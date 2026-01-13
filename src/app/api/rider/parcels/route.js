import { connectMongoDB } from "../../../../../lib/mongodb";
import Parcel from "../../../../../models/parcel";
import Rider from "../../../../../models/rider";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    const rider = await Rider.findOne({ email });
    if (!rider) {
      return NextResponse.json({ message: "Rider not found" }, { status: 404 });
    }

    // ডেলিভারি হওয়া পার্সেলসহ সব এসাইন করা পার্সেল ফেচ করা
    const allAssignedParcels = await Parcel.find({ 
      riderId: rider._id.toString(), 
      delivery_status: { $in: ["rider-assigned", "transit", "delivered"] } 
    }).sort({ updatedAt: -1 });

    return NextResponse.json(allAssignedParcels);
  } catch (error) {
    console.error("RIDER FETCH ERROR:", error);
    return NextResponse.json({ message: "Fetch failed" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectMongoDB();
    const { parcelId, riderEmail, action } = await req.json();

    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
      return NextResponse.json({ message: "Parcel not found" }, { status: 404 });
    }

    let updateData = {};

    if (action === "pickup") {
      updateData = { 
        delivery_status: "transit", 
        pickedUpAt: new Date() 
      };
    } else if (action === "deliver") {
      // 🔥 আর্নিং রুলস ফিক্স: Case-insensitive তুলনা এবং স্পেস রিমুভ করা
      const senderDist = String(parcel.senderDistrict || "").trim().toLowerCase();
      const receiverDist = String(parcel.receiverDistrict || "").trim().toLowerCase();
      
      const isSameDistrict = senderDist === receiverDist;
      
      // আর্নিং পার্সেন্টেজ নির্ধারণ
      const earningsPercentage = isSameDistrict ? 0.80 : 0.30;
      
      // কস্ট নিশ্চিত করে ক্যালকুলেট করা
      const parcelCost = Number(parcel.cost) || 0;
      const calculatedEarnings = parcelCost * earningsPercentage;

      updateData = { 
        delivery_status: "delivered", 
        deliveredAt: new Date(),
        // ২ দশমিক পর্যন্ত সঠিক নাম্বার হিসেবে সেভ করা
        riderEarnings: parseFloat(calculatedEarnings.toFixed(2)) 
      };
    }

    // ১. পার্সেল আপডেট (Status, Date and Earnings)
    const updatedParcel = await Parcel.findByIdAndUpdate(
      parcelId, 
      { $set: updateData },
      { new: true }
    );

    // ২. রাইডারকে আবার 'available' করা
    if (action === "deliver") {
      await Rider.findOneAndUpdate(
        { email: riderEmail },
        { $set: { workStatus: "available" } }
      );
    }

    return NextResponse.json({ 
        message: action === "pickup" ? "Picked Up" : "Delivered", 
        parcel: updatedParcel 
    });
  } catch (error) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}