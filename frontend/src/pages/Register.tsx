import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", { name, email, password });

      // After successful registration → redirect to login
      navigate("/login");
    } catch (err: any) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 border rounded-lg mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
