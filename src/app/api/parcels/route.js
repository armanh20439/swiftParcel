import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Parcel from "../../../../models/parcel";

// CREATE PARCEL -------------------------
export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const newParcel = await Parcel.create(body);

    return NextResponse.json(
      { message: "Parcel saved successfully!", parcel: newParcel },
      { status: 201 }
    );
  } catch (error) {
    console.error("PARCEL SAVE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to save parcel", error: error.message },
      { status: 500 }
    );
  }
}

// GET PARCELS (Supports both User and Admin) -------------------------
export async function GET(req) {
  try {
    await connectMongoDB();

    const email = req.nextUrl.searchParams.get("email");

    let parcels;

    if (email) {
      // 1. If email exists: Fetch parcels for a specific user (User Dashboard)
      parcels = await Parcel.find({ createdByEmail: email }).sort({
        createdAt: -1,
      });
    } else {
      // 2. If NO email exists: Fetch ALL parcels (Admin Management)
      parcels = await Parcel.find().sort({
        createdAt: -1,
      });
    }

    // Return the array directly so your frontend fetch (.json()) gets the array
    return NextResponse.json(parcels, { status: 200 });
    
  } catch (error) {
    console.error("FETCH ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch parcels", error: error.message },
      { status: 500 }
    );
  }
}