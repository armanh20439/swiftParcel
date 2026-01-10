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
  createdAt: { type: Date, default: Date.now },

  delivery_status: {
    type: String,
    default: "not_collected",
  },

  payment_status: {
    type: String,
    default: "unpaid",
  },

  stripeSessionId: String,

  riderId: { type: String, default: null },
  riderInfo: {
    name: String,
    email: String,
  },
  
  // 🔥 গুরুত্বপূর্ণ: ড্যাশবোর্ডে টাকা এবং তারিখ দেখানোর জন্য এই ফিল্ডগুলো লাগবে
  riderEarnings: { type: Number, default: 0 }, 
  assignedAt: Date,
  pickedUpAt: Date,
  deliveredAt: Date,
}, { timestamps: true });

export default mongoose.models.Parcel || mongoose.model("Parcel", ParcelSchema);