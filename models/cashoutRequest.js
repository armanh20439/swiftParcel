import mongoose from "mongoose";

const CashoutRequestSchema = new mongoose.Schema({
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rider", 
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
    default: "card/Bkash/Nagad", 
  },
  transactionId: {
    type: String,
    default: "", 
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date, // 
  }
}, { timestamps: true });

export default mongoose.models.CashoutRequest || mongoose.model("CashoutRequest", CashoutRequestSchema);