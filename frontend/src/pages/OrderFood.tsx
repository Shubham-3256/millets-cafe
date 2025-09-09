// src/pages/OrderFood.tsx
import React from "react";
import { Link } from "react-router-dom";

interface OrderItem {
  id: number;
  name: string;
  price: string;
  qty: number;
}

const initialOrders: OrderItem[] = [
  { id: 1, name: "Margherita Pizza", price: "$12", qty: 1 },
  { id: 2, name: "Veggie Combo", price: "$18", qty: 1 },
];

const OrderFood: React.FC = () => {
  const [orders, setOrders] = React.useState<OrderItem[]>(initialOrders);

  const increaseQty = (id: number) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };

  const total = orders.reduce(
    (sum, item) => sum + parseFloat(item.price.replace("$", "")) * item.qty,
    0
  );

  const confirmOrder = async () => {
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: orders }),
    });

    const data = await res.json();
    alert(data.message);
    // redirect after success
    window.location.href = "/done";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Your Order</h1>

      <div className="max-w-2xl mx-auto space-y-4">
        {orders.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-gray-500">{item.price}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => decreaseQty(item.id)}
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                -
              </button>
              <span>{item.qty}</span>
              <button
                onClick={() => increaseQty(item.id)}
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
        ))}

        <div className="mt-6 text-right">
          <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
          <button
            onClick={confirmOrder}
            className="mt-3 inline-block bg-orange-500 text-white py-2 px-6 rounded-xl hover:bg-orange-600 transition"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFood;
