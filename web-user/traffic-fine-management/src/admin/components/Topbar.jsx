import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    } catch (err) {}
    navigate("/login?mode=admin");
  };

  const navLink = (path) =>
    location.pathname === path
      ? "nav-link px-3 py-2 rounded fw-semibold"
      : "nav-link px-3 py-2 rounded";

  const activeLinkStyle = (path) =>
    location.pathname === path
      ? { backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }
      : { color: "rgba(255,255,255,0.8)" };

  return (
    <nav
      style={{
        width: "100%",
        backgroundColor: "#0d1b4b",
        boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          height: "64px",
        }}
      >
        {/* Brand */}
        <Link
          to="/admin"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginRight: "32px",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>🚔</span>
          <div style={{ lineHeight: 1.1 }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", display: "block" }}>
              Traffic Fine
            </span>
            <span style={{ color: "#ffd600", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "1px" }}>
              ADMIN PORTAL
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "32px",
            backgroundColor: "rgba(255,255,255,0.2)",
            marginRight: "24px",
          }}
        />

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", flexGrow: 1 }}>
          {[
            { path: "/admin", label: "Dashboard" },
            { path: "/admin/fines", label: "Fines" },
            { path: "/admin/fines/new", label: "Issue Fine" },
            { path: "/admin/users", label: "Users" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={navLink(path)}
              style={{
                textDecoration: "none",
                fontSize: "0.9rem",
                transition: "background 0.15s",
                ...activeLinkStyle(path),
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              backgroundColor: "#ffd600",
              color: "#0d1b4b",
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "1px",
              padding: "3px 10px",
              borderRadius: "12px",
            }}
          >
            ADMIN
          </span>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "rgba(255,255,255,0.9)",
              borderRadius: "6px",
              padding: "6px 16px",
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#c62828";
              e.currentTarget.style.borderColor = "#c62828";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
              e.currentTarget.style.color = "rgba(255,255,255,0.9)";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
