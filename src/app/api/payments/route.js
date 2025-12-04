import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount, parcelId, userEmail } = await req.json();

    if (!amount || !parcelId) {
      return NextResponse.json(
        { error: "Missing payment information" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Parcel Payment - ${parcelId}`,
              description: `Payment for parcel created by: ${userEmail}`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?parcelId=${parcelId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel`,
      metadata: { parcelId, userEmail },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("Payment API Error:", error);
    return NextResponse.json(
      { error: "Payment session failed" },
      { status: 500 }
    );
  }
}
