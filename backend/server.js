// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import multer from "multer";
import path from "path";
import { auth } from "./middleware/auth.js";

// Models
import MenuItem from "./models/MenuItem.js";
import Order from "./models/Order.js";
import Booking from "./models/Booking.js";
import Message from "./models/Message.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Ensure uploads folder exists
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use("/uploads", express.static("uploads"));

// ------------------ MULTER CONFIG ------------------
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});
const upload = multer({ storage });

// ------------------ USER ROUTES ------------------

// Get logged-in user's orders
app.get("/api/my-orders", auth(["user", "admin"]), async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get logged-in user's bookings
app.get("/api/my-bookings", auth(["user", "admin"]), async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Place an order
app.post("/api/orders", auth(["user", "admin"]), async (req, res) => {
  try {
    const order = new Order({ ...req.body, userId: req.user.id });
    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Book a table
app.post("/api/bookings", auth(["user", "admin"]), async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, userId: req.user.id });
    await booking.save();
    res.status(201).json({ message: "Table booked successfully", booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Contact message (public)
app.post("/api/messages", async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json({ message: "Message received", data: message });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ------------------ MENU ROUTES ------------------

// Add new menu item with image upload
app.post(
  "/api/menu",
  auth(["admin"]),
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("📥 Incoming Menu Request:");
      console.log("Body:", req.body);
      console.log("File:", req.file);

      if (!req.body.name || !req.body.price) {
        return res.status(400).json({ error: "Name and price are required" });
      }

      const item = new MenuItem({
        name: req.body.name,
        price: Number(req.body.price),
        description: req.body.description || "",
        image: req.file ? `/uploads/${req.file.filename}` : null,
      });

      await item.save();
      res.status(201).json(item);
    } catch (err) {
      console.error("❌ Error saving menu item:", err);
      res.status(400).json({ error: err.message });
    }
  }
);

// Update menu item
app.put("/api/menu/:id", auth(["admin"]), async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete menu item
app.delete("/api/menu/:id", auth(["admin"]), async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get menu items (public)
app.get("/api/menu", async (req, res) => {
  const items = await MenuItem.find();
  res.json(items);
});

// ------------------ AUTH ROUTES ------------------

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashed });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create admin (one-time bootstrap)
app.post("/api/auth/create-admin", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash("admin123", salt);

  const admin = new User({
    name: "Admin",
    email: "admin@example.com",
    password: hashed,
    role: "admin",
  });

  await admin.save();
  res.json({ message: "Admin created", admin });
});

// ------------------ ADMIN ROUTES ------------------

// Admin can view all orders/bookings/messages
app.get("/api/orders", auth(["admin"]), async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.get("/api/bookings", auth(["admin"]), async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

app.get("/api/messages", auth(["admin"]), async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

// Update status (orders/bookings/messages)
app.put("/api/orders/:id/status", auth(["admin"]), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/bookings/:id/status", auth(["admin"]), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/messages/:id/status", auth(["admin"]), async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE operations
app.delete("/api/orders/:id", auth(["admin"]), async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/bookings/:id", auth(["admin"]), async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/messages/:id", auth(["admin"]), async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analytics (admin only)
app.get("/api/admin/stats", auth(["admin"]), async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();
    const bookingCount = await Booking.countDocuments();
    const messageCount = await Message.countDocuments();

    const revenueData = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: null, total: { $sum: "$items.price" } } },
    ]);

    res.json({
      orders: orderCount,
      bookings: bookingCount,
      messages: messageCount,
      revenue: revenueData[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ DB & SERVER ------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB connection error:", err));
