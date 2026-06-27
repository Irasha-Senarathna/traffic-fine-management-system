import api from "./api";
export async function register(payload) {
  const res = await api.post("/api/auth/register", payload);
  return res.data;
}

export async function login(payload) {
  const res = await api.post("/api/auth/login", payload);
  const data = res.data;
  if (data && data.token) {
    localStorage.setItem("token", data.token);
    if (data.userId) {
      localStorage.setItem("userId", String(data.userId));
    }
    if (data.role) {
      localStorage.setItem("role", data.role);
    }
    if (data.name) {
      localStorage.setItem("userName", data.name);
    }
  }
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("userName");
  try {
    localStorage.removeItem("isAdmin");
  } catch (e) {}
}

export default { register, login, logout };

