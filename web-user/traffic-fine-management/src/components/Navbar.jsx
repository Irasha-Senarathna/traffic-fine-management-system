import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout as authLogout } from "../services/authService";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      authLogout();
    } catch (err) {
      // ignore
    }
    navigate("/login?mode=signin");
  };
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          TrafficFine
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {!isAdminPath && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/fines/1">
                  Fine Details
                </Link>
              </li>
              {/* My Fines removed from nav - page removed from app routes */}
              <li className="nav-item">
                <Link className="nav-link" to="/payment-success">
                  Payments
                </Link>
              </li>
            </ul>
          )}
          <div className="d-flex align-items-center ms-auto">
            {!isAdmin && (
              <Link
                className="btn btn-outline-secondary btn-sm me-2"
                to="/profile"
              >
                Profile
              </Link>
            )}
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
