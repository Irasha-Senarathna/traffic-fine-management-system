// LandingPage placeholder
import React from "react";
import { Link } from "react-router-dom";
export default function LandingPage() {
  return (
    <section
      className="d-flex align-items-center justify-content-center text-white"
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(/swatch_landscape_traffic_june2024_1_1d97.jpg)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="text-center p-4"
        style={{ maxWidth: 900, color: "#f8f9fa" }}
      >
        <h1 className="display-4 mb-3">Welcome to Traffic Fine Management</h1>
        <p className="lead mb-3">
          A simple, secure portal to view, manage and pay traffic fines. Track
          your fines, make payments online, and stay informed about traffic
          violations and penalties.
        </p>
        <p className="mb-4" style={{ color: "rgba(248,249,250,0.9)" }}>
          Fast. Transparent. Mobile-friendly.
        </p>
        <div className="d-flex justify-content-center gap-2">
          <Link to="/login?mode=signin" className="btn btn-primary btn-lg">
            User Login
          </Link>
          <Link to="/login?mode=admin" className="btn btn-outline-light btn-lg">
            Admin Login
          </Link>
        </div>
      </div>
    </section>
  );
}
