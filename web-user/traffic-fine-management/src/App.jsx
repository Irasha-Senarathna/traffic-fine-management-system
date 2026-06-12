import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FineDetailPage from "./pages/FineDetailPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentPage from "./pages/PaymentPage";
import AdminPage from "./pages/AdminPage";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const hideLayout =
    location.pathname === "/" || location.pathname === "/login";

  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideLayout && <Navbar />}

      <main className="container my-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/fines/:id" element={<FineDetailPage />} />
          <Route path="/payments/:fineId" element={<PaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
