import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Parcel from "../../../../../models/parcel";

export async function DELETE(req, context) {
  try {
    await connectMongoDB();

    const { id } = await context.params;  // FIXED: await used

    if (!id) {
      return NextResponse.json(
        { message: "Parcel ID is required" },
        { status: 400 }
      );
    }

    const deleted = await Parcel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Parcel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Parcel deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Delete failed", error: error.message },
      { status: 500 }
    );
  }
}
