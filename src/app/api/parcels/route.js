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

// GET USER PARCELS -------------------------
export async function GET(req) {
  try {
    await connectMongoDB();

    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const parcels = await Parcel.find({ createdByEmail: email }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ parcels }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch parcels", error: error.message },
      { status: 500 }
    );
  }
}
