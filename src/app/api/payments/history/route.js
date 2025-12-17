import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Payment from "../../../../../models/payment";
import Parcel from "../../../../../models/parcel";

export async function GET(req) {
  try {
    await connectMongoDB();

    // Get user email from URL
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email missing" }, { status: 400 });
    }

    // Find parcels created by user
    const userParcels = await Parcel.find({ createdByEmail: email });

    const parcelIds = userParcels.map((p) => p._id);

    // Find payments for these parcels
    const payments = await Payment.find({ parcelId: { $in: parcelIds } })
      .populate("parcelId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("History Error:", error);
    return NextResponse.json(
      { message: "Failed to load payment history", error: error.message },
      { status: 500 }
    );
  }
}
