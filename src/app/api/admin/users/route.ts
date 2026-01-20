import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    // find all user info without password
    const users = await User.find().select("-password");
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
  }
}