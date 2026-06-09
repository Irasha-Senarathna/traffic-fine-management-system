import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    } catch (err) {
      // ignore
    }
    navigate("/login?mode=signin");
  };
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
            <li className="nav-item">
              <Link className="nav-link" to="/fines">
                My Fines
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/payment-success">
                Payments
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
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
