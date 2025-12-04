import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  parcelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parcel",
  },
  trackingId: String,
  email: String,

  amount: Number,
  currency: String,

  paymentStatus: String,
  stripeSessionId: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
