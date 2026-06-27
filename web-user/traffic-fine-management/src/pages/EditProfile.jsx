import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../services/userService";

function Field({ id, label, ...inputProps }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label htmlFor={id} style={{
        display: "block", fontSize: 10, fontWeight: 600, color: "var(--slate)",
        marginBottom: 6, letterSpacing: 0.9, textTransform: "uppercase",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}>
        {label}
      </label>
      <input
        id={id}
        style={{
          width: "100%", padding: "9px 0",
          background: "transparent", border: "none",
          borderBottom: "1.5px solid var(--rule)",
          color: "var(--ink)", fontSize: 15,
          fontFamily: "'IBM Plex Sans', sans-serif",
          outline: "none", transition: "border-color .15s", boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderBottomColor = "var(--crimson)")}
        onBlur={(e) => (e.target.style.borderBottomColor = "var(--rule)")}
        {...inputProps}
      />
    </div>
  );
}

export default function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", nic: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) { setError("No user session found. Please log in."); return; }
    setLoading(true);
    getUserById(id)
      .then((data) => {
        setUser({ name: data.name || "", email: data.email || "", nic: data.nic || "" });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err?.response?.data?.message || err.message || "Failed to load profile");
      });
  }, []);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const id = localStorage.getItem("userId");
    if (!id) return setError("No user session found.");
    setSaving(true);
    try {
      await updateUser(id, user);
      setSaving(false);
      navigate("/profile");
    } catch (err) {
      setSaving(false);
      setError(err?.response?.data?.message || err.message || "Failed to save");
    }
  };

  if (loading) return (
    <div style={{ minHeight: "calc(100vh - 62px)", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14 }}>
      Loading…
    </div>
  );

  return (
    <div style={{ minHeight: "calc(100vh - 62px)", background: "var(--paper)", padding: "36px 24px", fontFamily: "'IBM Plex Sans', sans-serif", color: "var(--ink)" }}>
      <div style={{ maxWidth: 540, margin: "0 auto" }}>

        <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid var(--rule)" }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--crimson)", marginBottom: 8 }}>
            Citizen Profile
          </div>
          <h1 style={{ fontFamily: "'PT Serif', 'Georgia', serif", fontSize: 28, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2 }}>
            Edit Profile
          </h1>
        </div>

        {error && (
          <div style={{ background: "var(--danger-bg)", border: "1px solid #FECACA", borderRadius: 3, padding: "10px 14px", fontSize: 13, color: "var(--danger)", marginBottom: 20 }}>
            {error}
          </div>
        )}

        <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: 3, padding: "32px 28px" }}>
          <Field id="edit-name"     label="Full Name"      type="text"  name="name"  value={user.name}  onChange={handleChange} autoFocus />
          <Field id="edit-email"    label="Email Address"  type="email" name="email" value={user.email} onChange={handleChange} autoComplete="email" />
          <Field id="edit-nic"      label="NIC Number"     type="text"  name="nic"   value={user.nic}   onChange={handleChange} />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: "10px 20px", borderRadius: 3,
                border: "1px solid var(--rule)", background: "transparent",
                color: "var(--slate)", fontSize: 13.5, fontWeight: 500,
                cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif",
                transition: "border-color .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--slate)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--rule)")}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "10px 24px", borderRadius: 3, border: "none",
                background: saving ? "var(--rule)" : "var(--crimson)",
                color: "#fff", fontWeight: 600, fontSize: 13.5,
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "'IBM Plex Sans', sans-serif", transition: "background .15s",
              }}
              onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = "var(--crimson-dk)"; }}
              onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = "var(--crimson)"; }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
