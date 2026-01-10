import { connectMongoDB } from "../../../../../../lib/mongodb";
import Parcel from "../../../../../../models/parcel";
import Rider from "../../../../../../models/rider";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const rider = await Rider.findOne({ email });
    if (!rider) return NextResponse.json([]);

    const history = await Parcel.find({ 
      riderId: rider._id.toString(), 
      delivery_status: "delivered" 
    }).sort({ deliveredAt: -1 });

    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch history" }, { status: 500 });
  }
}