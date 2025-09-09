// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// pages
import Menu from "./pages/Menu";
import OrderFood from "./pages/OrderFood";
import BookTable from "./pages/BookTable";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMenu from "./pages/AdminMenu";
import MyOrders from "./pages/MyOrders";
import MyBookings from "./pages/MyBookings";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <h1 className="text-center mt-20 text-3xl">
              Welcome to Millets Cafe
            </h1>
          }
        />
        <Route path="/menu" element={<Menu />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User routes */}
        <Route
          path="/book"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <BookTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <OrderFood />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminMenu />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-20 text-2xl text-red-500">
              404 – Page Not Found
            </h1>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
