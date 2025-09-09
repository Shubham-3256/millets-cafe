// src/types/models.ts
// Defines shared types for menu, orders, bookings, messages, etc.

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  status?: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  userId: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  status?: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  status?: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}
