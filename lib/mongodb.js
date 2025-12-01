import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is missing in .env file!");
}

// --------- GLOBAL CACHE (Prevents multiple connections on hot reload) ---------

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// --------- CONNECT FUNCTION ---------
export async function connectMongoDB() {
  if (cached.conn) {
    console.log("➡️ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⏳ Creating new MongoDB connection...");

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "switch-parcel-delivery", // your DB name
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected Successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
