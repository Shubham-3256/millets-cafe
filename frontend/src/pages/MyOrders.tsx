import React, { useEffect, useState } from "react";

interface Order {
  _id: string;
  items: { name: string; qty: number; price: string }[];
  status: string;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.map((o) => (
        <div key={o._id} className="p-4 bg-gray-100 rounded mb-3">
          <p>
            <b>Status:</b> {o.status}
          </p>
          <ul className="list-disc ml-6">
            {o.items.map((i, idx) => (
              <li key={idx}>
                {i.name} x{i.qty} – {i.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
