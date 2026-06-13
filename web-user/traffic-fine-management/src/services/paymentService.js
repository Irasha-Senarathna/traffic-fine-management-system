import api from "./api";

export async function processPayment(paymentDto) {
  const res = await api.post("/api/payments", paymentDto);
  return res.data;
}

export async function getPaymentByFine(fineId) {
  const res = await api.get(`/api/payments/${fineId}`);
  return res.data;
}

export default { processPayment, getPaymentByFine };
