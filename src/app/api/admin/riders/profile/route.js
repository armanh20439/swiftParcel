import { connectMongoDB } from "../../../../../../lib/mongodb";
import Rider from "../../../../../../models/rider";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // ডাটাবেস থেকে রাইডারকে খুঁজে বের করা
    const rider = await Rider.findOne({ email });

    if (!rider) {
      return NextResponse.json({ message: "Rider profile not found" }, { status: 404 });
    }

    return NextResponse.json(rider);
  } catch (error) {
    console.error("PROFILE FETCH ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}