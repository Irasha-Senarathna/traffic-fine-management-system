import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  login as authLogin,
  register as authRegister,
} from "../services/authService";

export default function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramMode = searchParams.get("mode");
  const initialMode =
    paramMode === "signup"
      ? "signup"
      : paramMode === "admin"
        ? "admin"
        : "signin";
  const [mode, setMode] = useState(initialMode);

  const [name, setName] = useState("");
  const [nic, setNic] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const switchMode = (newMode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (mode === "signup") {
      authRegister({ name, nic, email, password })
        .then((res) => {
          setLoading(false);
          // show success and switch to signin
          setMode("signin");
          setSearchParams({ mode: "signin" });
          setInfo(res?.message || "Registered successfully. Please sign in.");
        })
        .catch((err) => {
          setLoading(false);
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Registration failed",
          );
        });
    } else {
      authLogin({ email, password })
        .then((res) => {
          setLoading(false);
          if (mode === "admin") {
            try {
              localStorage.setItem("isAdmin", "true");
            } catch (e) {}
            navigate("/admin");
          } else {
            try {
              localStorage.removeItem("isAdmin");
            } catch (e) {}
            navigate("/dashboard");
          }
        })
        .catch((err) => {
          setLoading(false);
          setError(
            err?.response?.data?.message || err.message || "Login failed",
          );
        });
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  return (
    <div
      className="d-flex align-items-center justify-content-center"
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
        className={`card shadow-sm p-3 mx-3 ${mode === "admin" ? "border border-danger" : ""}`}
        style={{
          maxWidth: 380,
          width: "100%",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        <h2 className={`mb-3 ${mode === "admin" ? "text-danger" : ""}`}>
          {mode === "admin"
            ? "Admin Login"
            : mode === "signin"
              ? "Sign in"
              : "Create account"}
        </h2>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <div className="mb-3">
                <label className="form-label">Full name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label className="form-label">NIC</label>
                <input
                  type="text"
                  className="form-control"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus={mode === "signin"}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className={`btn btn-sm ${mode === "admin" ? "btn-danger" : "btn-primary"}`}
            >
              {loading
                ? "Please wait..."
                : mode === "signin" || mode === "admin"
                  ? "Sign in"
                  : "Sign up"}
            </button>
          </div>
          {error && <div className="text-danger small mt-2">{error}</div>}
          {info && <div className="text-success small mt-2">{info}</div>}
          {mode === "signin" && (
            <div className="text-center mt-2">
              <a
                href="#"
                className="small text-danger"
                onClick={(e) => {
                  e.preventDefault();
                  switchMode("admin");
                }}
              >
                Or login as admin
              </a>
            </div>
          )}
        </form>

        <div className="text-center mt-3 small text-muted">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  switchMode("signin");
                }}
              >
                Sign in
              </a>
            </>
          ) : mode === "admin" ? (
            <>
              Want user login?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  switchMode("signin");
                }}
              >
                Switch to User Login
              </a>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  switchMode("signup");
                }}
              >
                Sign up
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
