import { connectMongoDB } from "../../../../../lib/mongodb";
import Parcel from "../../../../../models/parcel";
import User from "../../../../../models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();

    
    const totalParcels = await Parcel.countDocuments();
    const totalUsers = await User.countDocuments();
    const pendingDeliveries = await Parcel.countDocuments({ 
      delivery_status: { $in: ["pending", "rider-assigned"] } 
    });

    return NextResponse.json({
      totalParcels,
      totalUsers,
      pendingDeliveries
    });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching stats" }, { status: 500 });
  }
}