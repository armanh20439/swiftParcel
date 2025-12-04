import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  parcelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parcel",
    required: true,
  },
  sessionId: { type: String, required: true },
  paymentIntentId: { type: String },
  amount: { type: Number, required: true },

  status: {
    type: String,
    enum: ["paid", "failed", "pending"],
    default: "pending",
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);
