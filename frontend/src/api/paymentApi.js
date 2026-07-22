import axios from "axios";

const API_URL = "http://localhost:5000/api/payment";

/*
==========================================
CREATE PAYMENT
==========================================
*/

export async function createPayment(paymentData) {
  try {
    const response = await axios.post(API_URL, paymentData);

    return response.data;
  } catch (error) {
    throw new Error("Failed to submit payment.");
  }
}

/*
==========================================
CONFIRM PAYMENT
==========================================
*/

export async function confirmPayment(id, paymentData = {}) {
  try {
    const response = await axios.patch(`${API_URL}/${id}/verify`, paymentData);

    return response.data;
  } catch (error) {
    throw new Error("Failed to confirm payment.");
  }
}

/*
==========================================
VERIFY PAYMENT
==========================================
*/

export async function verifyPayment(id, paymentData = {}) {
  return confirmPayment(id, paymentData);
}

/*
==========================================
REJECT PAYMENT
==========================================
*/

export async function rejectPayment(id, paymentData = {}) {
  try {
    const response = await axios.patch(`${API_URL}/${id}/reject`, paymentData);

    return response.data;
  } catch (error) {
    throw new Error("Failed to reject payment.");
  }
}

/*
==========================================
GET PAYMENT HISTORY
==========================================
*/

export async function getPaymentHistory(tenantId) {
  try {
    const response = await axios.get(`${API_URL}/tenant/${tenantId}`);

    return response.data;
  } catch (error) {
    throw new Error("Failed to retrieve payment history.");
  }
}

/*
==========================================
PAYMENT METRICS
==========================================
*/

export async function getPaymentMetrics() {
  try {
    const response = await axios.get(`${API_URL}/metrics`);

    return response.data;
  } catch (error) {
    throw new Error("Failed to retrieve payment metrics.");
  }
}
