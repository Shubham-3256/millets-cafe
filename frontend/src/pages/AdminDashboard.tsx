// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";

interface Order {
  _id: string;
  items: { name: string; qty: number; price: string }[];
  createdAt: string;
  status?: string;
}

interface Booking {
  _id: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  createdAt: string;
  status?: string;
}

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status?: string;
}

interface Stats {
  orders: number;
  bookings: number;
  messages: number;
  revenue: number;
}

// ✅ Small reusable component for updating status
const StatusDropdown: React.FC<{
  value: string;
  onChange: (newStatus: string) => void;
}> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border rounded p-1 ml-2"
  >
    <option value="pending">Pending</option>
    <option value="approved">Approved</option>
    <option value="completed">Completed</option>
    <option value="cancelled">Cancelled</option>
  </select>
);

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);

      const [ordersRes, bookingsRes, messagesRes, statsRes] = await Promise.all(
        [
          fetch("http://localhost:5000/api/orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/bookings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/messages", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]
      );

      setOrders(await ordersRes.json());
      setBookings(await bookingsRes.json());
      setMessages(await messagesRes.json());
      setStats(await statsRes.json());
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const updateStatus = async (endpoint: string, id: string, status: string) => {
    try {
      await fetch(`http://localhost:5000/api/${endpoint}/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch (err) {
      alert("❌ Failed to update status");
    }
  };

  const deleteItem = async (endpoint: string, id: string) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      await fetch(`http://localhost:5000/api/${endpoint}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      alert("❌ Failed to delete");
    }
  };

  // Format date for readability
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) {
    return <p className="p-6">⏳ Loading dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      {stats && (
        <section className="bg-white shadow rounded p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 Site Stats</h2>
          <p>Total Orders: {stats.orders}</p>
          <p>Total Bookings: {stats.bookings}</p>
          <p>Total Messages: {stats.messages}</p>
          <p>Total Revenue: ${stats.revenue.toFixed(2)}</p>
        </section>
      )}

      {/* Orders */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="p-4 bg-gray-100 rounded-lg">
                <p>
                  <b>ID:</b> {order._id}
                </p>
                <p>
                  <b>Status:</b>
                  <StatusDropdown
                    value={order.status || "pending"}
                    onChange={(val) => updateStatus("orders", order._id, val)}
                  />
                </p>
                <p>
                  <b>Created:</b> {formatDate(order.createdAt)}
                </p>
                <p>
                  <b>Items:</b>
                </p>
                <ul className="list-disc ml-6">
                  {order.items.map((i, idx) => (
                    <li key={idx}>
                      {i.name} x{i.qty} – {i.price}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => deleteItem("orders", order._id)}
                  className="mt-2 bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bookings */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600">No bookings yet.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b._id} className="p-4 bg-gray-100 rounded-lg">
                <p>
                  <b>{b.name}</b> booked {b.guests} guest(s)
                </p>
                <p>
                  {b.date} at {b.time}
                </p>
                <p>
                  <b>Status:</b>
                  <StatusDropdown
                    value={b.status || "pending"}
                    onChange={(val) => updateStatus("bookings", b._id, val)}
                  />
                </p>
                <p>
                  <b>Created:</b> {formatDate(b.createdAt)}
                </p>
                <button
                  onClick={() => deleteItem("bookings", b._id)}
                  className="mt-2 bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Messages */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Messages</h2>
        {messages.length === 0 ? (
          <p className="text-gray-600">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m._id} className="p-4 bg-gray-100 rounded-lg">
                <p>
                  <b>From:</b> {m.name} ({m.email})
                </p>
                <p className="mt-1">{m.message}</p>
                <p>
                  <b>Status:</b>
                  <StatusDropdown
                    value={m.status || "pending"}
                    onChange={(val) => updateStatus("messages", m._id, val)}
                  />
                </p>
                <p>
                  <b>Created:</b> {formatDate(m.createdAt)}
                </p>
                <button
                  onClick={() => deleteItem("messages", m._id)}
                  className="mt-2 bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
