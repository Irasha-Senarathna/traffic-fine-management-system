import axios from "axios";

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Single axios instance with interceptor to attach JWT
const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

export default api;
