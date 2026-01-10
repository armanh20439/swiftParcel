import { connectMongoDB } from "../../../../../../lib/mongodb";
import Parcel from "../../../../../../models/parcel";
import Rider from "../../../../../../models/rider";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await connectMongoDB();
    const { parcelId, riderId, riderName, riderEmail } = await req.json();

    // ১. রাইডার প্রোফাইল এবং আইডি চেক করা
    const rider = await Rider.findById(riderId);
    if (!rider) {
      return NextResponse.json({ message: "Rider not found" }, { status: 404 });
    }

    // ২. রাইডার বর্তমানে অন্য ডেলিভারিতে ব্যস্ত কি না তা যাচাই করা
    if (rider.workStatus === "in-delivery") {
      return NextResponse.json(
        { message: "Rider is currently busy with another delivery!" },
        { status: 400 }
      );
    }

    // ৩. পার্সেল আপডেট (ফ্লো-চার্ট অনুযায়ী স্ট্যাটাস: rider-assigned)
    const updatedParcel = await Parcel.findByIdAndUpdate(
      parcelId,
      {
        $set: { 
          // স্ট্যাটাস এখন সরাসরি 'transit' হবে না
          delivery_status: "rider-assigned", 
          riderId: riderId,
          riderInfo: {
            name: riderName,
            email: riderEmail,
          },
          assignedAt: new Date().toISOString(),
        }
      },
      { new: true, runValidators: true } 
    );

    if (!updatedParcel) {
      return NextResponse.json({ message: "Parcel assignment failed" }, { status: 404 });
    }

    // ৪. রাইডারের কাজের স্ট্যাটাস আপডেট করা (যাতে অন্য কেউ তাকে এসাইন না করতে পারে)
    await Rider.findByIdAndUpdate(riderId, { 
      $set: { workStatus: "in-delivery" } 
    });

    return NextResponse.json(
      { message: "Rider assigned! Waiting for parcel pickup." }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Assign Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}