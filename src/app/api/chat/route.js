import { connectMongoDB } from "../../../../lib/mongodb";
import Message from "../../../../models/message";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const newMessage = await Message.create(body);
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const parcelId = searchParams.get("parcelId");
    
    const messages = await Message.find({ parcelId }).sort({ timestamp: 1 });
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}