import Stripe from "stripe";
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";

import Parcel from "../../../../../models/parcel";
import Payment from "../../../../../models/payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { parcelId } = await req.json();

    await connectMongoDB();

    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
      return NextResponse.json({ message: "Parcel not found" }, { status: 404 });
    }

    // Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: { name: parcel.parcelName },
            unit_amount: parcel.cost * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/success?parcel=${parcelId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/my-parcels`,
    });

    // Save pending payment record
    await Payment.create({
      parcelId: parcelId,
      sessionId: session.id,
      amount: parcel.cost,
      status: "pending",
    });

    // Save sessionId in parcel
    parcel.stripeSessionId = session.id;
    await parcel.save();

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    return NextResponse.json(
      {
        message: "Payment Session Failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
