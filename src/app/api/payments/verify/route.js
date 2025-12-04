import Stripe from "stripe";
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Parcel from "../../../../models/parcel";
import Payment from "../../../../models/payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const session_id = req.nextUrl.searchParams.get("session_id");

    await connectMongoDB();

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const payment = await Payment.findOneAndUpdate(
        { sessionId: session_id },
        {
          status: "paid",
          paymentIntentId: session.payment_intent,
        },
        { new: true }
      );

      await Parcel.findByIdAndUpdate(payment.parcelId, {
        payment_status: "paid",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false });

  } catch (error) {
    return NextResponse.json(
      { message: "Verification failed", error: error.message },
      { status: 500 }
    );
  }
}
