import { connectMongoDB } from "../../../../../lib/mongodb";
import CashoutRequest from "../../../../../models/cashoutRequest";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    
    // show all cashout request, show new request in the up
    const requests = await CashoutRequest.find().sort({ createdAt: -1 });
    
    return NextResponse.json(requests);
  } catch (error) {
    console.error("ADMIN CASHOUT GET ERROR:", error);
    return NextResponse.json({ message: "Failed to fetch requests" }, { status: 500 });
  }
}