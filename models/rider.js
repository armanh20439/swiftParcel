import mongoose, { Schema, models } from "mongoose";

const riderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User মডেলের সাথে সম্পর্ক
      required: true,
    },
    name: { type: String, required: true },
    email: {type: String, required: true, unique: true },
    age: { type: Number, required: true },
    region: { type: String, required: true },
    district: { type: String, required: true },
    nid: { type: String, required: true },
    contact: { type: String, required: true },
    bikeReg: { type: String, required: true },
    wirehouse: { type: String, required: true },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
  },
  { timestamps: true }
);

const Rider = models.Rider || mongoose.model("Rider", riderSchema);
export default Rider;