import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  message: { type: String, required: true, minlength: 5 },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "approved", "completed", "cancelled"],
    default: "pending",
  },
});

export default mongoose.model("Message", MessageSchema);
