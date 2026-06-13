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
    try {
      const jwtPayload = JSON.parse(atob(data.token.split(".")[1]));
      const email = jwtPayload.sub;
      if (email) {
        const usersRes = await api.get("/api/users");
        const match = usersRes.data.find((u) => u.email === email);
        if (match?.id) {
          localStorage.setItem("userId", String(match.id));
        }
      }
    } catch (e) {
      // ignore — profile page will show login prompt
    }
  }
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  try {
    localStorage.removeItem("isAdmin");
  } catch (e) {}
}

export default { register, login, logout };
