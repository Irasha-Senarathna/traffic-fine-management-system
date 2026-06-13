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
  const [showPassword, setShowPassword] = useState(false);

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
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                    <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                  </svg>
                )}
              </button>
            </div>
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
