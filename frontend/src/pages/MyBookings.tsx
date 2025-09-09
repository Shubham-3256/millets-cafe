import React, { useEffect, useState } from "react";

interface Booking {
  _id: string;
  date: string;
  time: string;
  guests: number;
  status: string;
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/my-bookings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      {bookings.map((b) => (
        <div key={b._id} className="p-4 bg-gray-100 rounded mb-3">
          <p>
            <b>Date:</b> {b.date} at {b.time}
          </p>
          <p>
            <b>Guests:</b> {b.guests}
          </p>
          <p>
            <b>Status:</b> {b.status}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
