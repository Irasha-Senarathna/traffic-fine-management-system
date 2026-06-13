import api from "./api";

export async function getAllFines() {
  const res = await api.get("/api/fines");
  return res.data;
}

export async function getFineById(id) {
  const res = await api.get(`/api/fines/${id}`);
  return res.data;
}

export async function getFinesByUser(userId) {
  const res = await api.get(`/api/fines/user/${userId}`);
  return res.data;
}

export async function getFinesByVehicle(plate) {
  const res = await api.get(`/api/fines/vehicle/${encodeURIComponent(plate)}`);
  return res.data;
}

export async function issueFine(fineDto) {
  const res = await api.post("/api/fines", fineDto);
  return res.data;
}

export async function updateFine(id, fineDto) {
  const res = await api.put(`/api/fines/${id}`, fineDto);
  return res.data;
}

export async function markFineAsPaid(id) {
  const res = await api.put(`/api/fines/${id}/pay`);
  return res.data;
}

export async function deleteFine(id) {
  const res = await api.delete(`/api/fines/${id}`);
  return res.data;
}

export default {
  getAllFines,
  getFineById,
  getFinesByUser,
  getFinesByVehicle,
  issueFine,
  updateFine,
  markFineAsPaid,
  deleteFine,
};
