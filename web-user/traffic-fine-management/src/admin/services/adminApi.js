import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Auth
export const adminLogin = (data) =>
  API.post("/auth/login", data);

// Fines
export const getAllFines = () =>
  API.get("/fines");

export const getFineById = (id) =>
  API.get(`/fines/${id}`);

export const issueFine = (data) =>
  API.post("/fines", data);

export const updateFine = (id, data) =>
  API.put(`/fines/${id}`, data);

// Users
export const getAllUsers = () =>
  API.get("/users");

export const getUserById = (id) =>
  API.get(`/users/${id}`);

export const deleteUser = (id) =>
  API.delete(`/users/${id}`);

export default API;