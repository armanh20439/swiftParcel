import { connectMongoDB } from "../../../../../lib/mongodb";
import Rider from "../../../../../models/rider";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const rider = await Rider.findOne({ email });
    return NextResponse.json(rider);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}