import { connectMongoDB } from "../../../../../../lib/mongodb";
import CashoutRequest from "../../../../../../models/cashoutRequest";
import Rider from "../../../../../../models/rider";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await connectMongoDB();
    const { requestId, riderEmail, amount } = await req.json();

    //  approve cashout request
    const requestUpdate = await CashoutRequest.findByIdAndUpdate(
      requestId,
      { status: "approved", processedAt: new Date() },
      { new: true }
    );

    // add withdrawnAmount in rider model 
    const riderUpdate = await Rider.findOneAndUpdate(
      { email: riderEmail },
      { $inc: { withdrawnAmount: Number(amount) } },
      { new: true }
    );

    return NextResponse.json({ 
      message: "Approved and Rider balance updated!",
      updatedRider: riderUpdate 
    });
  } catch (error) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}