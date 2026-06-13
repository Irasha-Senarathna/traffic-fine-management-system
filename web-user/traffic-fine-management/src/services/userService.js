import api from "./api";

export async function getAllUsers() {
  const res = await api.get("/api/users");
  return res.data;
}

export async function getUserById(id) {
  const res = await api.get(`/api/users/${id}`);
  return res.data;
}

export async function updateUser(id, user) {
  const res = await api.put(`/api/users/${id}`, user);
  return res.data;
}

export async function deleteUser(id) {
  const res = await api.delete(`/api/users/${id}`);
  return res.data;
}

export default { getAllUsers, getUserById, updateUser, deleteUser };
