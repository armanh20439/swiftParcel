import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  parcelId: { type: mongoose.Schema.Types.ObjectId, ref: "Parcel", required: true },
  senderEmail: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Message || mongoose.model("Message", messageSchema);