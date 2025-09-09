// src/components/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo / Brand */}
      <Link to="/" className="font-bold text-xl text-orange-600">
        Millets Cafe
      </Link>

      {/* Links */}
      <div className="space-x-4">
        {/* Always visible */}
        <Link to="/menu" className="hover:text-orange-500">
          Menu
        </Link>

        {/* Show Contact only if not admin */}
        {role !== "admin" && (
          <Link to="/contact" className="hover:text-orange-500">
            Contact
          </Link>
        )}

        {/* Guest only */}
        {!token && (
          <>
            <Link to="/login" className="hover:text-orange-500">
              Login
            </Link>
            <Link to="/register" className="hover:text-orange-500">
              Register
            </Link>
          </>
        )}

        {/* User only */}
        {token && role === "user" && (
          <>
            <Link to="/order" className="hover:text-orange-500">
              Order Food
            </Link>
            <Link to="/book" className="hover:text-orange-500">
              Book Table
            </Link>
            <Link to="/my-orders" className="hover:text-orange-500">
              My Orders
            </Link>
            <Link to="/my-bookings" className="hover:text-orange-500">
              My Bookings
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-red-500 font-semibold"
            >
              Logout
            </button>
          </>
        )}

        {/* Admin only */}
        {token && role === "admin" && (
          <>
            <Link to="/admin/dashboard" className="hover:text-orange-500">
              Dashboard
            </Link>
            <Link to="/admin/menu" className="hover:text-orange-500">
              Manage Menu
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-red-500 font-semibold"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
