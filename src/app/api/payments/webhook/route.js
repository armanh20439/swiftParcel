// import Stripe from "stripe";
// import { NextResponse } from "next/server";
// import { connectMongoDB } from "../../../../../lib/mongodb";
// import Parcel from "../../../../../models/parcel";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
// console.log("stripe secret key:-------",process.env.STRIPE_SECRET_KEY)
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   let event;
//   const rawBody = await req.text();
//   const signature = req.headers.get("stripe-signature");

//   try {
//     event = stripe.webhooks.constructEvent(
//       rawBody,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (error) {
//     return NextResponse.json({ message: `Webhook Error: ${error.message}` }, { status: 400 });
//   }

//   // PAYMENT SUCCESS EVENT
//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//     const parcelId = session.metadata.parcelId;

//     await connectMongoDB();

//     await Parcel.findByIdAndUpdate(parcelId, {
//       payment_status: "paid",
//     });

//     console.log(`Parcel ${parcelId} marked as PAID`);
//   }

//   return NextResponse.json({ received: true }, { status: 200 });
// }
