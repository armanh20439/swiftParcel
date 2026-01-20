import Stripe from "stripe";
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";

import Parcel from "../../../../../models/parcel";
import Payment from "../../../../../models/payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const parcelId = searchParams.get("parcel");
    const sessionId = searchParams.get("session_id");

    await connectMongoDB();

    //  Verify Stripe Session Status
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ message: "Payment not completed" });
    }

    // Update Parcel → payment_status paid
    await Parcel.findByIdAndUpdate(parcelId, {
      payment_status: "paid",
    });

    //  Update Payment table
    await Payment.findOneAndUpdate(
      { sessionId },
      {
        status: "paid",
        paymentIntentId: session.payment_intent,
      }
    );

    return NextResponse.json({ message: "Payment Updated Successfully" });
  } catch (error) {
    console.error("SUCCESS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update after success", error: error.message },
      { status: 500 }
    );
  }
}
