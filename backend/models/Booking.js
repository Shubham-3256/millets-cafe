import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, min: 1, max: 20 },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "approved", "completed", "cancelled"],
    default: "pending",
  },
});

export default mongoose.model("Booking", BookingSchema);
