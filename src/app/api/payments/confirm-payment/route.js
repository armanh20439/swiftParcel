import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectMongoDB } from "../../../../../lib/mongodb";

import Parcel from "../../../../../models/parcel";
import Payment from "../../../../../models/payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");

    await connectMongoDB();

    // 🔥 Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ message: "Payment not completed" }, { status: 400 });
    }

    // Get payment document
    const payment = await Payment.findOne({ sessionId: session_id });
    if (!payment) {
      return NextResponse.json({ message: "Payment record not found" }, { status: 404 });
    }

    // Update payment
    payment.status = "paid";
    await payment.save();

    // Update parcel payment_status
    await Parcel.findByIdAndUpdate(payment.parcelId, {
      payment_status: "paid",
    });

    return NextResponse.json({ message: "Payment confirmed & parcel updated" });
  } catch (error) {
    console.error("CONFIRM ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
