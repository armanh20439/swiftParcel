import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is missing in .env");
}

let isConnected = false;

export const connectMongoDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("❌ MongoDB Error:", error);
  }
};
