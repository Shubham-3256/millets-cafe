// src/pages/BookTable.tsx
import React, { useState } from "react";

const BookTable: React.FC = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const booking = { name, date, time, guests };

    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });

    const data = await res.json();
    alert(data.message);

    // reset form
    setName("");
    setDate("");
    setTime("");
    setGuests(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Book a Table</h1>

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
            <label className="block font-semibold mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Time</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Guests</label>
            <input
              type="number"
              min={1}
              max={20}
              required
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTable;
