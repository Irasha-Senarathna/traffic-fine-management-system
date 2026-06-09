// LandingPage placeholder
import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="text-center p-4">
        <h1 className="display-4 mb-3">Welcome to Traffic Fine Management</h1>
        <p className="lead mb-4">
          View and pay your traffic fines quickly and securely.
        </p>
        <div className="d-flex justify-content-center gap-2">
          <Link to="/login?mode=signin" className="btn btn-primary btn-lg">
            User Login
          </Link>
          <Link
            to="/login?mode=admin"
            className="btn btn-outline-danger btn-lg"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
