// src/pages/Menu.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Menu item type matches backend MenuItem model
interface MenuItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/menu");
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error("❌ Error fetching menu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Our Menu</h1>

      {menuItems.length === 0 ? (
        <p className="text-center text-gray-600">
          No menu items available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition"
            >
              {item.image && (
                <img
                  // full URL for backend-hosted images
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="h-40 w-full object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-gray-600">${item.price}</p>
              {item.description && (
                <p className="text-sm text-gray-500">{item.description}</p>
              )}
              <Link
                to="/order"
                className="mt-3 block text-center bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition"
              >
                Order Now
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
