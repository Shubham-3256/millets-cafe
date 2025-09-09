// src/pages/ContactUs.tsx
import React, { useState } from "react";

const ContactUs: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    const data = await res.json();
    alert(data.message);

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
        <p className="text-center text-gray-600 mb-6">
          Have questions or feedback? Send us a message!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Message</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
