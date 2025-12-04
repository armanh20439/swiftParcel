import mongoose from "mongoose";

const ParcelSchema = new mongoose.Schema({
  parcelName: String,
  parcelType: String,
  parcelWeight: Number,

  senderName: String,
  senderEmail: String,
  senderRegion: String,
  senderDistrict: String,
  senderAddress: String,
  pickupInstruction: String,

  receiverName: String,
  receiverEmail: String,
  receiverRegion: String,
  receiverDistrict: String,
  receiverAddress: String,
  deliveryInstruction: String,

  cost: Number,
  costBreakdown: {
    base: Number,
    extra: Number,
    total: Number,
  },

  trackingId: String,
  createdByEmail: String,
  createdAt: Date,

  delivery_status: {
    type: String,
    default: "not_collected",
  },

  payment_status: {
    type: String,
    default: "unpaid",
  },

  stripeSessionId: String,
});

export default mongoose.models.Parcel ||
  mongoose.model("Parcel", ParcelSchema);
