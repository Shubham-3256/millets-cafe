import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // inside Login.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    // inside Login.tsx, after successful login
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // redirect based on role
      if (data.role === "admin") {
        window.location.href = "/admin/dashboard"; // ✅ match App.tsx route
      } else {
        window.location.href = "/"; // go to homepage for users
      }
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
