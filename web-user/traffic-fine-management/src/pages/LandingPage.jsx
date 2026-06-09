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
            Login
          </Link>
          <Link
            to="/login?mode=signup"
            className="btn btn-outline-secondary btn-lg"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
