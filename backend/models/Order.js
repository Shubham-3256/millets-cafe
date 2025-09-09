import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  items: [
    {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: String, required: true },
      qty: { type: Number, required: true, min: 1 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "approved", "completed", "cancelled"],
    default: "pending",
  },
});

export default mongoose.model("Order", OrderSchema);
