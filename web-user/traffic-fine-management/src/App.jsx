import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MyFinesPage from "./pages/MyFinesPage";
import FineDetailPage from "./pages/FineDetailPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import FinesListPage from "./admin/pages/FinesListPage";
import IssueFineForm from "./admin/pages/IssueFineForm";
import UsersListPage from "./admin/pages/UsersListPage";
import AdminFineDetailPage from "./admin/pages/AdminFineDetailPage";
import UserDetailPage from "./admin/pages/UserDetailPage";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const hideLayout =
    location.pathname === "/" || location.pathname === "/login" || isAdminRoute;

  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideLayout && <Navbar />}

      <main className={`flex-grow-1${isAdminRoute ? "" : " container my-4"}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/fines" element={<MyFinesPage />} />
          <Route path="/fines/:id" element={<FineDetailPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="fines" element={<FinesListPage />} />
            <Route path="fines/new" element={<IssueFineForm />} />
            <Route path="fines/:id" element={<AdminFineDetailPage />} />
            <Route path="users" element={<UsersListPage />} />
            <Route path="users/:id" element={<UserDetailPage />} />
          </Route>
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
