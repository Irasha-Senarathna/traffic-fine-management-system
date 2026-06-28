import api from "./api";

export async function processPayment(paymentDto) {
  const res = await api.post("/api/payments", paymentDto);
  return res.data;
}

export async function createStripeSession(fineId) {
  const res = await api.post(`/api/payments/checkout-session/${fineId}`);
  return res.data;
}

export async function verifyStripeSession(sessionId) {
  const res = await api.post(`/api/payments/verify-checkout-session?sessionId=${sessionId}`);
  return res.data;
}

export async function getPaymentByFine(fineId) {
  const res = await api.get(`/api/payments/${fineId}`);
  return res.data;
}

export default {
  processPayment,
  createStripeSession,
  verifyStripeSession,
  getPaymentByFine,
};
