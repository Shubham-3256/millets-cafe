// src/pages/AdminMenu.tsx
import React, { useEffect, useState } from "react";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

const AdminMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch menu from backend
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/menu");
      if (!res.ok) throw new Error("Failed to fetch menu");
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      setError("⚠️ Failed to load menu items.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // ------------------- Add Menu Item -------------------
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.name || !newItem.price) {
      alert("Name and price are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("price", String(newItem.price));
    formData.append("description", newItem.description);
    if (file) formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/api/menu", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to add item");

      setNewItem({ name: "", price: "", description: "" });
      setFile(null);
      fetchMenu();
    } catch (err) {
      alert("❌ Failed to add menu item");
      console.error(err);
    }
  };

  // ------------------- Update Menu Item -------------------
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/menu/${editingItem._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingItem.name,
            price: editingItem.price,
            description: editingItem.description,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update item");

      setEditingItem(null);
      fetchMenu();
    } catch (err) {
      alert("❌ Failed to update menu item");
      console.error(err);
    }
  };

  // ------------------- Delete Menu Item -------------------
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete item");
      fetchMenu();
    } catch (err) {
      alert("❌ Failed to delete menu item");
      console.error(err);
    }
  };

  // ------------------- UI -------------------
  if (loading) {
    return <p className="p-6 text-gray-600">Loading menu...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Menu</h1>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Add new item form */}
      <form onSubmit={handleAdd} className="mb-6 space-y-3">
        <h2 className="text-lg font-semibold">➕ Add New Item</h2>
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          placeholder="Description"
          value={newItem.description}
          onChange={(e) =>
            setNewItem({ ...newItem, description: e.target.value })
          }
          className="border p-2 rounded w-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Item
        </button>
      </form>

      {/* Edit item form */}
      {editingItem && (
        <form
          onSubmit={handleUpdate}
          className="mb-6 space-y-3 bg-yellow-100 p-4 rounded"
        >
          <h2 className="text-lg font-semibold">✏️ Edit Item</h2>
          <input
            type="text"
            value={editingItem.name}
            onChange={(e) =>
              setEditingItem({ ...editingItem, name: e.target.value })
            }
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="number"
            value={editingItem.price}
            onChange={(e) =>
              setEditingItem({
                ...editingItem,
                price: Number(e.target.value),
              })
            }
            className="border p-2 rounded w-full"
            required
          />
          <textarea
            value={editingItem.description}
            onChange={(e) =>
              setEditingItem({
                ...editingItem,
                description: e.target.value,
              })
            }
            className="border p-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Item
          </button>
          <button
            type="button"
            onClick={() => setEditingItem(null)}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Existing items list */}
      {menuItems.length === 0 ? (
        <p className="text-gray-600">No items in the menu yet.</p>
      ) : (
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center bg-white p-3 rounded shadow"
            >
              <span>
                {item.image && (
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 inline-block mr-2 object-cover rounded"
                  />
                )}
                {item.name} - ${item.price}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminMenu;
