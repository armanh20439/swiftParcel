
import { connectMongoDB } from "../../../../../../lib/mongodb";
import CashoutRequest from "../../../../../../models/cashoutRequest";
import Rider from "../../../../../../models/rider";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await connectMongoDB();
    const { requestId, riderEmail, amount } = await req.json();

    if (!requestId || !riderEmail || !amount) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // ১. ক্যাশআউট রিকোয়েস্ট আপডেট
    const requestUpdate = await CashoutRequest.findByIdAndUpdate(
      requestId,
      { status: "approved", processedAt: new Date() },
      { new: true }
    );

    if (!requestUpdate) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    // ২. রাইডার ব্যালেন্স আপডেট ($inc ব্যবহার করা হয়েছে)
    const riderUpdate = await Rider.findOneAndUpdate(
      { email: riderEmail },
      { $inc: { withdrawnAmount: Number(amount) } },
      { new: true }
    );

    return NextResponse.json({ 
      message: "Approved and Balance adjusted!",
      updatedRider: riderUpdate 
    });

  } catch (error) {
    console.error("APPROVE API ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}