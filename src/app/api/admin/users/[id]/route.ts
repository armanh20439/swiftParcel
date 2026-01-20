import { connectMongoDB } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/user";
import { NextResponse } from "next/server";

//user delete from database
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectMongoDB();
    
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// UPDATE User Role 
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectMongoDB();
    
    
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const { role } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { role: role }, 
      { new: true } 
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Role updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}