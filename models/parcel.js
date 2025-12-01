import mongoose from "mongoose";

const ParcelSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // ---- PARCEL DETAILS ----
    parcelName: { type: String, required: true },
    parcelType: { type: String, required: true },
    parcelWeight: { type: Number, required: true },

    cost: { type: Number, required: true },
    costBreakdown: {
      base: { type: Number, required: true },
      extra: { type: Number, required: true },
      total: { type: Number, required: true },
    },

    // ---- SENDER DETAILS ----
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderRegion: { type: String, required: true },
    senderDistrict: { type: String, required: true },
    senderAddress: { type: String, required: true },
    pickupInstruction: { type: String },

    // ---- RECEIVER DETAILS ----
    receiverName: { type: String, required: true },
    receiverEmail: { type: String, required: true },
    receiverRegion: { type: String, required: true },
    receiverDistrict: { type: String, required: true },
    receiverAddress: { type: String, required: true },
    deliveryInstruction: { type: String },

    // ---- TRACKING & META ----
    createdByEmail: {
      type: String,
      required: true,
      index: true, // faster "My Parcels" load
    },

    payment_status: {
      type: String,
      default: "unpaid",
      enum: ["unpaid", "paid"],
    },

    delivery_status: {
      type: String,
      default: "not_collected",
      enum: [
        "not_collected",
        "collected",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
    },

    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: true }
);

// Fix for Next.js hot-reload model overwrite
const Parcel =
  mongoose.models.Parcel || mongoose.model("Parcel", ParcelSchema);

export default Parcel;
