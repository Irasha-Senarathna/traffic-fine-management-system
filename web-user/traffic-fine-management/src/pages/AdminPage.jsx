import React from "react";

export default function AdminPage() {
  return (
    <div className="container py-4">
      <div
        className="p-4 rounded-3 shadow-sm text-center"
        style={{ border: "1px solid #dc3545", background: "#fff" }}
      >
        <h1 className="text-danger mb-2">Admin Page</h1>
        <p className="mb-0 text-muted">
          Administrative dashboard and tools will appear here.
        </p>
      </div>
    </div>
  );
}
