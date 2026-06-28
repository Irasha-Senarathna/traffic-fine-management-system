import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const FINE_CATEGORIES = [
  "Speeding","Running Red Light","Illegal Parking","No Seat Belt","No Helmet",
  "Drunk Driving","Illegal U-Turn","Reckless Driving","Illegal Overtaking",
  "No Valid License","No Insurance","Overloading","Blocking Traffic",
  "Mobile Phone While Driving","Other",
];

const PoliceShield = () => (
  <svg width="28" height="32" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 2L3 7V16C3 23.5 8.5 29.5 15 31.5C21.5 29.5 27 23.5 27 16V7L15 2Z"
      fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    <text x="15" y="23" textAnchor="middle" fill="white" fontSize="13" fontFamily="system-ui, sans-serif">★</text>
  </svg>
);

function Field({ id, label, children, ...inputProps }) {
  if (children) {
    return (
      <div style={{ marginBottom: 18 }}>
        <label htmlFor={id} style={{ display: "block", fontSize: 9, fontWeight: 600, color: "var(--slate)", marginBottom: 5, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          {label}
        </label>
        {children}
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 18 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: 9, fontWeight: 600, color: "var(--slate)", marginBottom: 5, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'IBM Plex Sans', sans-serif" }}>
        {label}
      </label>
      <input
        id={id}
        style={{
          width: "100%", padding: "8px 0",
          background: "transparent", border: "none",
          borderBottom: "1.5px solid var(--rule)",
          color: "var(--ink)", fontSize: 14,
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

const STATUS_META = {
  UNPAID:  { label: "Unpaid",  color: "var(--danger)"  },
  PAID:    { label: "Paid",    color: "var(--success)" },
  PENDING: { label: "Pending", color: "var(--warning)" },
};

function FineRow({ fine: f, isLast }) {
  const meta = STATUS_META[f.status] || STATUS_META.UNPAID;
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "52px 1fr 100px 130px 80px",
      gap: 8, padding: "12px 20px",
      borderBottom: isLast ? "none" : "1px solid var(--paper-dk)",
      alignItems: "center",
    }}>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--muted)" }}>#{f.id}</span>
      <div>
        <div style={{ fontWeight: 500, fontSize: 13.5, color: "var(--ink)" }}>{f.vehiclePlate || "—"}</div>
        <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 1 }}>{f.reason || "—"}{f.district ? ` · ${f.district}` : ""}</div>
      </div>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--slate)" }}>
        {f.issuedAt ? new Date(f.issuedAt).toLocaleDateString("en-LK") : "—"}
      </span>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>
        LKR {Number(f.amount || 0).toLocaleString("en-LK")}
      </span>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: meta.color }}>
        {meta.label}
      </span>
    </div>
  );
}

export default function PoliceDashboardPage() {
  const navigate = useNavigate();
  const officerName = localStorage.getItem("policeName") || "Officer";
  const policeRole  = localStorage.getItem("policeRole")  || "POLICE";

  const [tab, setTab] = useState("issue");

  const [form, setForm] = useState({
    vehiclePlate: "", ownerNic: "", reason: FINE_CATEGORIES[0], customReason: "",
    amount: "", district: "", location: "", issuedAt: new Date().toISOString().slice(0, 10),
  });
  const [issueLoading, setIssueLoading] = useState(false);
  const [issueError,   setIssueError]   = useState(null);
  const [issueSuccess, setIssueSuccess] = useState(null);

  const [searchPlate,   setSearchPlate]   = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError,   setSearchError]   = useState(null);
  const [searched,      setSearched]      = useState(false);

  const [recentFines,   setRecentFines]   = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentError,   setRecentError]   = useState(null);

  const loadRecent = useCallback(() => {
    setRecentLoading(true);
    setRecentError(null);
    api.get("/api/fines")
      .then((r) => setRecentFines((r.data || []).slice(0, 20)))
      .catch((e) => setRecentError(e?.response?.data?.message || e.message || "Failed to load fines."))
      .finally(() => setRecentLoading(false));
  }, []);

  useEffect(() => { loadRecent(); }, [loadRecent]);

  function handleLogout() {
    localStorage.removeItem("policeToken");
    localStorage.removeItem("policeUserId");
    localStorage.removeItem("policeName");
    localStorage.removeItem("policeRole");
    navigate("/police/login");
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIssueError(null);
    setIssueSuccess(null);
  }

  async function handleIssueFine(e) {
    e.preventDefault();
    setIssueError(null);
    setIssueSuccess(null);
    setIssueLoading(true);

    const reason = form.reason === "Other" ? form.customReason.trim() : form.reason;
    if (!reason) { setIssueError("Please specify a reason."); setIssueLoading(false); return; }
    if (!form.ownerNic.trim()) { setIssueError("Owner NIC is required."); setIssueLoading(false); return; }

    const officerIdStr = localStorage.getItem("policeUserId");
    const payload = {
      vehiclePlate: form.vehiclePlate.toUpperCase().trim(),
      ownerNic:     form.ownerNic.trim(),
      reason,
      fineCategory: form.reason,
      amount:       parseFloat(form.amount),
      district:     form.district.trim()  || undefined,
      location:     form.location.trim()  || undefined,
      issuedAt:     form.issuedAt         || undefined,
      officerId:    officerIdStr ? parseInt(officerIdStr, 10) : undefined,
    };

    try {
      const res = await api.post("/api/fines", payload);
      setIssueSuccess(`Fine #${res.data?.id || ""} issued successfully for ${payload.vehiclePlate}.`);
      setForm({ vehiclePlate: "", ownerNic: "", reason: FINE_CATEGORIES[0], customReason: "", amount: "", district: "", location: "", issuedAt: new Date().toISOString().slice(0, 10) });
      loadRecent();
    } catch (err) {
      setIssueError(err?.response?.data?.message || err.message || "Failed to issue fine.");
    } finally {
      setIssueLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchPlate.trim()) return;
    setSearchLoading(true);
    setSearchError(null);
    setSearched(false);
    try {
      const res = await api.get(`/api/fines/vehicle/${encodeURIComponent(searchPlate.trim().toUpperCase())}`);
      setSearchResults(res.data || []);
      setSearched(true);
    } catch (err) {
      setSearchError(err?.response?.data?.message || err.message || "Search failed.");
    } finally {
      setSearchLoading(false);
    }
  }

  const selectStyle = {
    width: "100%", padding: "8px 0",
    background: "transparent", border: "none",
    borderBottom: "1.5px solid var(--rule)",
    color: "var(--ink)", fontSize: 14,
    fontFamily: "'IBM Plex Sans', sans-serif",
    outline: "none", cursor: "pointer",
    appearance: "none",
  };

  const TABS = [
    { id: "issue",  label: "Issue Fine"       },
    { id: "search", label: "Search Vehicle"   },
    { id: "recent", label: "Recent Fines"     },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "'IBM Plex Sans', sans-serif", color: "var(--ink)" }}>

      {/* Masthead */}
      <header style={{ background: "var(--crimson)", borderBottom: "2px solid var(--gold)", padding: "0 24px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", height: 60, display: "flex", alignItems: "center", gap: 14 }}>
          <PoliceShield />
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: 1.5, textTransform: "uppercase", lineHeight: 1 }}>
              Sri Lanka Police Department
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.3, marginTop: 2 }}>
              Officer Dashboard
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginRight: 4 }}>
            {officerName}
            <span style={{
              marginLeft: 8, fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 2, padding: "2px 6px", color: "#fff",
            }}>
              {policeRole}
            </span>
          </span>
          <button
            id="police-logout-btn"
            onClick={handleLogout}
            style={{
              padding: "6px 14px", borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.35)",
              background: "transparent", color: "rgba(255,255,255,0.85)",
              cursor: "pointer", fontSize: 13, fontFamily: "'IBM Plex Sans', sans-serif",
              transition: "background .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 24px" }}>

        {/* Page header */}
        <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid var(--rule)" }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--crimson)", marginBottom: 8 }}>
            Traffic Enforcement
          </div>
          <h1 style={{ fontFamily: "'PT Serif', 'Georgia', serif", fontSize: 26, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2 }}>
            Issue fines, search vehicles, and manage violations.
          </h1>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", borderBottom: "1.5px solid var(--rule)", marginBottom: 24 }}>
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              id={`tab-${id}`}
              onClick={() => setTab(id)}
              style={{
                padding: "10px 20px",
                background: "none", border: "none",
                borderBottom: tab === id ? "2px solid var(--crimson)" : "2px solid transparent",
                marginBottom: "-1.5px",
                fontSize: 13.5,
                fontWeight: tab === id ? 600 : 400,
                color: tab === id ? "var(--crimson)" : "var(--muted)",
                cursor: "pointer",
                fontFamily: "'IBM Plex Sans', sans-serif",
                transition: "color .15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Issue Fine */}
        {tab === "issue" && (
          <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--rule)" }}>
              <span style={{ fontFamily: "'PT Serif', serif", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Issue New Fine</span>
            </div>
            <div style={{ padding: "24px 20px" }}>
              {issueSuccess && (
                <div style={{ background: "var(--success-bg)", border: "1px solid #BBF7D0", borderRadius: 3, padding: "10px 14px", fontSize: 13, color: "var(--success)", marginBottom: 20 }}>
                  {issueSuccess}
                </div>
              )}
              {issueError && (
                <div style={{ background: "var(--danger-bg)", border: "1px solid #FECACA", borderRadius: 3, padding: "10px 14px", fontSize: 13, color: "var(--danger)", marginBottom: 20 }}>
                  {issueError}
                </div>
              )}

              <form onSubmit={handleIssueFine}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }} className="fine-form-grid">
                  <Field id="fine-vehicle-plate" label="Vehicle Plate *" type="text" placeholder="e.g. WP-CAB-1234"
                    value={form.vehiclePlate} onChange={(e) => handleFormChange("vehiclePlate", e.target.value)} required />
                  <Field id="fine-owner-nic" label="Owner NIC *" type="text" placeholder="e.g. 980123456V"
                    value={form.ownerNic} onChange={(e) => handleFormChange("ownerNic", e.target.value)} required />

                  <Field id="fine-reason-select" label="Violation Category *">
                    <select id="fine-reason-select" style={selectStyle} value={form.reason}
                      onChange={(e) => handleFormChange("reason", e.target.value)} required>
                      {FINE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>

                  {form.reason === "Other" ? (
                    <Field id="fine-custom-reason" label="Custom Reason *" type="text" placeholder="Describe the violation"
                      value={form.customReason} onChange={(e) => handleFormChange("customReason", e.target.value)} />
                  ) : <div />}

                  <Field id="fine-amount" label="Fine Amount (LKR) *" type="number" min="0" step="0.01"
                    placeholder="e.g. 2500.00" value={form.amount}
                    onChange={(e) => handleFormChange("amount", e.target.value)} required />
                  <Field id="fine-issued-at" label="Issue Date *" type="date" value={form.issuedAt}
                    onChange={(e) => handleFormChange("issuedAt", e.target.value)} required />

                  <Field id="fine-district" label="District" type="text" placeholder="e.g. Colombo"
                    value={form.district} onChange={(e) => handleFormChange("district", e.target.value)} />
                  <Field id="fine-location" label="Location / Road" type="text" placeholder="e.g. Galle Road, Dehiwala"
                    value={form.location} onChange={(e) => handleFormChange("location", e.target.value)} />
                </div>

                <div style={{ marginTop: 8 }}>
                  <button
                    id="issue-fine-btn"
                    type="submit"
                    disabled={issueLoading}
                    style={{
                      padding: "11px 28px", borderRadius: 3, border: "none",
                      background: issueLoading ? "var(--rule)" : "var(--crimson)",
                      color: "#fff", fontWeight: 600, fontSize: 14,
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      cursor: issueLoading ? "not-allowed" : "pointer",
                      transition: "background .15s",
                    }}
                    onMouseEnter={(e) => { if (!issueLoading) e.currentTarget.style.background = "var(--crimson-dk)"; }}
                    onMouseLeave={(e) => { if (!issueLoading) e.currentTarget.style.background = "var(--crimson)"; }}
                  >
                    {issueLoading ? "Issuing…" : "Issue Fine"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search */}
        {tab === "search" && (
          <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--rule)" }}>
              <span style={{ fontFamily: "'PT Serif', serif", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Search by Vehicle Plate</span>
            </div>
            <div style={{ padding: "20px" }}>
              <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                <input
                  id="search-plate-input"
                  type="text"
                  placeholder="Enter vehicle plate, e.g. WP-CAB-1234"
                  value={searchPlate}
                  onChange={(e) => setSearchPlate(e.target.value)}
                  required
                  style={{
                    flex: 1, padding: "9px 14px",
                    background: "var(--paper)", border: "1px solid var(--rule)",
                    borderRadius: 3, color: "var(--ink)", fontSize: 14,
                    fontFamily: "'IBM Plex Sans', sans-serif", outline: "none",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--crimson)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--rule)")}
                />
                <button
                  id="search-plate-btn"
                  type="submit"
                  disabled={searchLoading}
                  style={{
                    padding: "9px 20px", borderRadius: 3, border: "none",
                    background: searchLoading ? "var(--rule)" : "var(--crimson)",
                    color: "#fff", fontWeight: 600, fontSize: 13.5,
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    cursor: searchLoading ? "not-allowed" : "pointer",
                    transition: "background .15s", whiteSpace: "nowrap",
                  }}
                >
                  {searchLoading ? "Searching…" : "Search"}
                </button>
              </form>

              {searchError && (
                <div style={{ background: "var(--danger-bg)", border: "1px solid #FECACA", borderRadius: 3, padding: "10px 14px", fontSize: 13, color: "var(--danger)", marginBottom: 16 }}>
                  {searchError}
                </div>
              )}

              {searched && searchResults.length === 0 && (
                <div style={{ color: "var(--muted)", fontSize: 14, padding: "12px 0" }}>
                  No fines found for plate <strong style={{ color: "var(--ink)" }}>{searchPlate.toUpperCase()}</strong>.
                </div>
              )}

              {searchResults.length > 0 && (
                <>
                  <div style={{
                    display: "grid", gridTemplateColumns: "52px 1fr 100px 130px 80px",
                    gap: 8, padding: "8px 0",
                    borderBottom: "1px solid var(--rule)",
                    fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)",
                  }}>
                    <span>Ref</span><span>Violation</span><span>Date</span><span>Amount</span><span>Status</span>
                  </div>
                  {searchResults.map((f, i) => <FineRow key={f.id} fine={f} isLast={i === searchResults.length - 1} />)}
                </>
              )}
            </div>
          </div>
        )}

        {/* Recent Fines */}
        {tab === "recent" && (
          <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'PT Serif', serif", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Recent Fines</span>
              <button
                id="refresh-fines-btn"
                onClick={loadRecent}
                style={{
                  padding: "5px 12px", borderRadius: 3,
                  border: "1px solid var(--rule)", background: "transparent",
                  color: "var(--slate)", fontSize: 12,
                  cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif",
                }}
              >
                ↻ Refresh
              </button>
            </div>

            {recentError && (
              <div style={{ margin: "16px 20px", background: "var(--danger-bg)", border: "1px solid #FECACA", borderRadius: 3, padding: "10px 14px", fontSize: 13, color: "var(--danger)" }}>
                {recentError}
              </div>
            )}

            {recentLoading ? (
              <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>Loading…</div>
            ) : recentFines.length === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>No fines in the system yet.</div>
            ) : (
              <>
                <div style={{
                  display: "grid", gridTemplateColumns: "52px 1fr 100px 130px 80px",
                  gap: 8, padding: "8px 20px",
                  background: "var(--paper)", borderBottom: "1px solid var(--rule)",
                  fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)",
                }}>
                  <span>Ref</span><span>Violation</span><span>Date</span><span>Amount</span><span>Status</span>
                </div>
                {recentFines.map((f, i) => <FineRow key={f.id} fine={f} isLast={i === recentFines.length - 1} />)}
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 620px) {
          .fine-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
