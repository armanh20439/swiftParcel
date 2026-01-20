import { connectMongoDB } from "../../../../../lib/mongodb";
import CashoutRequest from "../../../../../models/cashoutRequest"; // আপনাকে এই মডেলটি তৈরি করতে হবে
import Rider from "../../../../../models/rider";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { riderEmail, amount } = await req.json();

    // find rider
    const rider = await Rider.findOne({ email: riderEmail });
    
    // make cashout request
    const newRequest = await CashoutRequest.create({
      riderId: rider._id,
      riderName: rider.name,
      riderEmail: riderEmail,
      amount: amount,
      status: "pending", // primary status
      requestedAt: new Date()
    });

    return NextResponse.json({ message: "Cashout request sent!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to send request" }, { status: 500 });
  }
}