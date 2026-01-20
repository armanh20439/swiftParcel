import { connectMongoDB } from "../../../../../../lib/mongodb";
import Rider from "../../../../../../models/rider";
import User from "../../../../../../models/user";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectMongoDB();
 
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { status, userId } = await req.json();

    // 1. Update Rider Application Status (Approved or Rejected)
    const updatedRider = await Rider.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedRider) {
      return NextResponse.json({ message: "Rider application not found" }, { status: 404 });
    }

    // 2. If approved, update the User's role to 'rider'
    if (status === "approved" && userId) {
      await User.findByIdAndUpdate(userId, { role: "rider" });
    } 
    // If rejected,  role stays 'user' 
    else if (status === "rejected" && userId) {
      await User.findByIdAndUpdate(userId, { role: "user" });
    }else {
      // If status is 'pending', 'rejected', or 'deactivated', set role back to 'user'
      await User.findByIdAndUpdate(userId, { role: "user" });
    }

    return NextResponse.json({ message: `Application ${status} successfully` }, { status: 200 });
  } catch (error) {
    console.error("Patch Error:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

// DELETE route to permanently remove a rejected application if needed
export async function DELETE(req, { params }) {
  try {
    await connectMongoDB();
    const resolvedParams = await params;
    await Rider.findByIdAndDelete(resolvedParams.id);
    return NextResponse.json({ message: "Application deleted permanently" });
  } catch (error) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}