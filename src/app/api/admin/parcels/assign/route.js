import { connectMongoDB } from "../../../../../../lib/mongodb";
import Parcel from "../../../../../../models/parcel";
import Rider from "../../../../../../models/rider";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await connectMongoDB();
    const { parcelId, riderId, riderName, riderEmail } = await req.json();

    // check rider profile by id
    const rider = await Rider.findById(riderId);
    if (!rider) {
      return NextResponse.json({ message: "Rider not found" }, { status: 404 });
    }

    // check rider are busy or not
    if (rider.workStatus === "in-delivery") {
      return NextResponse.json(
        { message: "Rider is currently busy with another delivery!" },
        { status: 400 }
      );
    }

    // update parcel for rider assigned status
    const updatedParcel = await Parcel.findByIdAndUpdate(
      parcelId,
      {
        $set: { 
         
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

    // update rider status for admin donot assigned him another work
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