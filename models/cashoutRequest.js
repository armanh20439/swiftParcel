import mongoose from "mongoose";

const CashoutRequestSchema = new mongoose.Schema({
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rider", // রাইডার মডেলের সাথে লিংক করা
    required: true,
  },
  riderName: {
    type: String,
    required: true,
  },
  riderEmail: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    default: "Bkash/Nagad", // আপনি চাইলে এটি ডাইনামিক করতে পারেন
  },
  transactionId: {
    type: String,
    default: "", // অ্যাডমিন পেমেন্ট করার পর এখানে ট্রানজেকশন আইডি বসাবে
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date, // অ্যাডমিন যখন এপ্রুভ বা রিজেক্ট করবে
  }
}, { timestamps: true });

export default mongoose.models.CashoutRequest || mongoose.model("CashoutRequest", CashoutRequestSchema);