import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // Make category optional with default
    category: { type: String, default: "General" },
    price: { type: Number, required: true },
    image: { type: String, default: null },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", MenuItemSchema);
