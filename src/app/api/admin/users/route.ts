import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    // পাসওয়ার্ড বাদে সব ইউজার ডাটা নিয়ে আসা হচ্ছে
    const users = await User.find().select("-password");
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
  }
}