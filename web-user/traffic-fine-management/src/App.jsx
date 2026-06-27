import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FineDetailPage from "./pages/FineDetailPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentPage from "./pages/PaymentPage";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import PoliceLoginPage from "./pages/PoliceLoginPage";
import PoliceDashboardPage from "./pages/PoliceDashboardPage";
import "./App.css";

/** Redirect to login if no token */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

/** Redirect to police login if no police token */
function PoliceProtectedRoute({ children }) {
  const token = localStorage.getItem("policeToken");
  if (!token) return <Navigate to="/police/login" replace />;
  return children;
}

function AppContent() {
  const location = useLocation();
  const isPoliceRoute = location.pathname.startsWith("/police");
  const hideLayout =
    isPoliceRoute ||
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  // Police routes render without the shared Navbar/Footer wrapper
  if (isPoliceRoute) {
    return (
      <Routes>
        <Route path="/police/login" element={<PoliceLoginPage />} />
        <Route
          path="/police/dashboard"
          element={
            <PoliceProtectedRoute>
              <PoliceDashboardPage />
            </PoliceProtectedRoute>
          }
        />
      </Routes>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!hideLayout && <Navbar />}

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/fines/:id" element={<ProtectedRoute><FineDetailPage /></ProtectedRoute>} />
          <Route path="/payments/:fineId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
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
