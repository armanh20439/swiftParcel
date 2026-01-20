import { connectMongoDB } from "../../../../lib/mongodb";
import Rider from "../../../../models/rider";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await connectMongoDB();
    // show new rider in sort
    const riders = await Rider.find().sort({ createdAt: -1 });
    return NextResponse.json(riders);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch riders" }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectMongoDB();

    const existingApplication = await Rider.findOne({ email: data.email });
    if (existingApplication) {
      return NextResponse.json(
        { message: "You have already submitted an application." },
        { status: 400 }
      );
    }

    await Rider.create(data);
    return NextResponse.json({ message: "Application submitted successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Rider Application Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}