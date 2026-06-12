import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";

export default function AdminLayout() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f6f9" }}>
      <Topbar />
      <Outlet />
    </div>
  );
}
