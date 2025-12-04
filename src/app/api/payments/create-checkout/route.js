import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Parcel from "../../../../../models/parcel";
import Payment from "../../../../../models/payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    await connectMongoDB();

    const { parcelId } = await req.json();

    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
      return NextResponse.json(
        { message: "Parcel not found" },
        { status: 404 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Parcel: ${parcel.parcelName}`,
            },
            unit_amount: parcel.cost * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/my-parcels`,
    });

    parcel.stripeSessionId = session.id;
    await parcel.save();

    await Payment.create({
      parcelId: parcel._id,
      trackingId: parcel.trackingId,
      email: parcel.createdByEmail,
      amount: parcel.cost,
      currency: "bdt",
      paymentStatus: "paid",
      stripeSessionId: session.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { message: "Checkout Error", error: error.message },
      { status: 500 }
    );
  }
}
