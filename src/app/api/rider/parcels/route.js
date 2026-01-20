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

    // assign, deliver, tansit parcel are fetch
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
      // earning rule fixed, Case-insensitive copmpare and remoev space
      const senderDist = String(parcel.senderDistrict || "").trim().toLowerCase();
      const receiverDist = String(parcel.receiverDistrict || "").trim().toLowerCase();
      
      const isSameDistrict = senderDist === receiverDist;
      
      // rider earning percent 
      const earningsPercentage = isSameDistrict ? 0.80 : 0.30;
      
      // cost decide 
      const parcelCost = Number(parcel.cost) || 0;
      const calculatedEarnings = parcelCost * earningsPercentage;

      updateData = { 
        delivery_status: "delivered", 
        deliveredAt: new Date(),
        
        riderEarnings: parseFloat(calculatedEarnings.toFixed(2)) 
      };
    }

    
    const updatedParcel = await Parcel.findByIdAndUpdate(
      parcelId, 
      { $set: updateData },
      { new: true }
    );

    // make rider available again
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